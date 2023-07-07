const {cloneDeep, isArray, unset, isEmpty, get, last} = require("lodash");
const {ParameterException} = require("./http-exception");
const {getAllfieldNames, getAllMethodNames} = require("./util");
const validator = require("validator");

class RuleResult {
    static getSuccessMsg(key = "", msg = "") {
        return [true, key, msg];
    }

    static getErrorMsg(key, msg) {
        return [false, key, msg];
    }
}

class Rule {
    constructor(name, msg, ...options) {
        this.name = name;
        this.msg = msg;
        this.options = options; // options=[2, 20] 或者是 options=[{max:1, min:2}]
        if (this.name === "isOptional") {
            // this.name = new Rule("isOptional", "该key为可选，也就是可以为空", 2, 20)
            // this.name = new Rule("isOptional", "该key为可选，也就是可以为空", {max: 1, min: 2})
            this.optional = true;
            this.defaultValue = options && options[0];
        }
        this.parsedValue = undefined;
    }

    validate(value) {
        // new Rule(方法)
        if (typeof this.name === "function") {
            return;
        }

        // new Rule("isInt")
        // 如果是自定义的字段，需要额外处理
        // 如果是validator这个第三方库所具备的字段，直接调用default即可
        switch (this.name) {
            case "isInt":
                if (typeof value === "string") {
                    this.parsedValue = validator.toInt(value);
                    return validator.isInt(value, this.options);
                } else {
                    this.parsedValue = value;
                    return validator.isInt(String(value), this.options);
                }
            case "isFloat":
                if (typeof value === "string") {
                    this.parsedValue = validator.toFloat(value);
                    return validator.isFloat(value, this.options);
                } else {
                    this.parsedValue = value;
                    return validator.isFloat(String(value), this.options);
                }
            case "isBoolean":
                if (typeof value === "string") {
                    this.parsedValue = validator.toBoolean(value);
                    return validator.isBoolean(value, this.options);
                } else {
                    this.parsedValue = value;
                    return validator.isBoolean(String(value), this.options);
                }
            case "isNotEmpty":
                // TODO 自定实现是否为空的判断
                console.error("isNotEmpty还没实现");
                return false;
            default:
                return validator[this.name](value, this.options);
        }
    }
}

class CommonValidator {
    constructor() {
        this.data = {}; // 装载数据的容器
        this.parsed = {}; // 解析后的数据容器
        this.errors = [];
    }

    /**
     * 根据定义的Rule规则进行校验，校验规则为key: msg，服从validator第三方库的规则
     * https://github.com/validatorjs/validator.js
     * @param ctx
     * @param alias
     * @returns {Promise<void>}
     */
    async validate(ctx, alias = {}) {
        // 根据ctx的参数进行校验
        this.alias = alias;
        const requestData = this.normalizeRequest(ctx);
        // 原始数据
        this.data = cloneDeep(requestData);
        // 解析后的数据
        this.parsed = {
            ...cloneDeep(requestData),
            default: {},
        };

        const checkParamsResult = await this.checkRules();
        if (!checkParamsResult) {
            // 参数校验不通过
            if (this.errors.length === 1) {
                throw new ParameterException(this.errors[0].message);
                return;
            }

            let errorObj = {};
            for (const item of this.errors) {
                errorObj[item.key] = item.message;
            }
            throw new ParameterException(JSON.stringify(errorObj));
            console.log("最终validate抛出错误");
        }

        console.log("最终validate仍然return");
        ctx.v = this;
        return this;
    }

    normalizeRequest(ctx) {
        return {
            body: ctx.request.body,
            query: ctx.request.query,
            path: ctx.params,
            header: ctx.request.header,
        };
    }

    async checkRules() {
        const filter = (key) => {
            // 校验器是直接this.key1 = new Rule("isNotEmpty", "必须传入搜索关键字");
            // 因此需要遍历所有key，检测是否属于new Rule()
            const value = this[key];
            if (isArray(value)) {
                if (value.length === 0) {
                    return false;
                }

                console.log(JSON.stringify(value));
                // 抛出异常可以终止forEach循环
                // return false/true只能终止本次执行，不能终止循环
                value.forEach((item) => {
                    if (!(item instanceof Rule)) {
                        // 如果是数组，并且存在不是Rule，应该报错
                        this.errors.push({
                            errorKey: key,
                            message: key + "为数组类型的话，每一个item都必须是Rule类型",
                        });
                        throw new Error(key + "为数组类型的话，每一个item都必须是Rule类型");
                    }
                });

                return true;
            }

            return value instanceof Rule;
        };

        // 根据filter筛选出所有规则：this.key1 = new Rule("isNotEmpty", "必须传入搜索关键字");
        let keys = getAllfieldNames(this, {
            filter,
        });

        // 别名替换得到替换的数组
        keys = this.replace(keys);

        // 开始进行每一个key进行检验！根据规则进行验证Rule.validate()
        await this.checkStringRules(keys);

        if (this.errors.length > 0) {
            return false;
        }

        // 自定义的检验方法执行
        const validateFunctionNames = getAllMethodNames(this, {
            filter: (key) => {
                // 方法 并且 是以validate开头的
                return /validate([A-Z])\w+/g.test(key) && typeof this[key] === "function";
            },
        });

        for (const validateFnName of validateFunctionNames) {
            // 自定义检验方法
            const validateFn = get(this, validateFnName);
            let validateResultObj = await validateFn.call(this, this.data);
            if (!validateResultObj) {
                // 没有返回检验信息，说明方法实现不充分
                const errorKey = validateFnName.replace("validate", "");
                const errorException = new ParameterException("校验方法错误，参数错误", errorKey);
                this.errors.push(errorException.getData());
            } else {
                // 自定义校验函数，第一个参数是校验是否成功，第二个参数为错误信息
                let validateResult = validateResultObj[0];
                let validateMessage = validateResultObj[1];
                let errorKey = validateResultObj[2] || validateFnName.replace("validate", "");
                if (!validateResult) {
                    const errorException = new ParameterException(validateMessage, errorKey);
                    this.errors.push(errorException.getData());
                } else {
                    // 成功！
                }
            }
        }

        return this.errors.length === 0;
    }

    async checkStringRules(keys) {
        for (const key of keys) {
            // this.count = new Rule("isNotEmpty", "必须传入搜索关键字");
            // keys=["count", "author"]
            // 对count这个值进行校验！
            const [requestKey, requestValue] = this.findRequestData(key);
            let rules = this[key];
            if (!Array.isArray(rules)) {
                rules = [rules];
            }
            let optional = false;
            let stopFlag = false;
            if (isEmpty(requestValue)) {
                // 检测规则中是否有可选optional标志
                let defaultValue = "";
                let message = "";
                for (const rule of rules) {
                    // 多条规则可能其中一条是rule.optional=true
                    // 因此需要遍历所有的规则
                    if (rule.optional) {
                        optional = true;
                        defaultValue = rule.defaultValue;
                        break;
                    } else {
                        message = rule.message;
                    }
                }

                if (!optional) {
                    this.errors.push(
                        new ParameterException(message || `${key}不能为空`, key).getData()
                    );
                } else {
                    this.parsed["default"][key] = defaultValue;
                }
                continue; // 继续下一个key的校验
            }

            for (const rule of rules) {
                let errorMessage = "";
                if (!stopFlag && !rule.optional) {
                    const ruleResult = await rule.validate(requestValue);
                    if (!ruleResult) {
                        errorMessage = rule.msg;
                        stopFlag = true; // 不用进行下一个规则的验证了！
                    }
                }

                if (rule.parsedValue) {
                    // TODO 如果有解析成功的值，赋值给this.parsed?
                    this.parsed[requestKey][key] = rule.parsedValue;
                }
                if (errorMessage) {
                    this.errors.push({
                        key,
                        message: errorMessage,
                    });
                }
            }
        }
    }

    replace(keys) {
        // 根据初始化的this.alias替换目前this[key]
        // this.alias = {"name": "newName"}
        // this[newName] = this[name]
        // delete this[name]
        // array.push(newName);
        if (!this.alias) {
            return keys;
        }
        const arr = [];
        for (let key of keys) {
            const newKeyName = this.alias[key];
            if (newKeyName) {
                this[newKeyName] = this[key];
                unset(this, key);
                // 替换后，添加新的别名作为key
                arr.push(newKeyName);
            } else {
                // 不需要替换，直接添加目前的key
                arr.push(key);
            }
        }
        return arr;
    }

    findRequestData(key) {
        // 在this.data中寻找对应的key
        const keys = Object.keys(this.data);
        for (const requestKey of keys) {
            const requestValue = this.data[requestKey][key];
            if (requestValue !== void 0) {
                return [requestKey, requestValue];
            }
        }

        return [];
    }

    get(path, parsed = true) {
        if (parsed) {
            const value = get(this.parsed, path, null);
            if (value == null) {
                // 如果从this.parsed找不到对应的数据，则去default，也就是optional=true
                // 寻找是否有默认值
                const keys = path.split(".");
                const key = last(keys);
                return get(this.parsed.default, key);
            }
            return value;
        } else {
            return get(this.data, path);
        }
    }
}

module.exports = {
    CommonValidator,
    Rule,
    RuleResult,
};
