const { CommonValidator, Rule, RuleResult } = require("../lib/common-validator");
const User = require("../models/user");
const { LoginType } = require("../config/login-type");



class CreateOrUpdateMenuValidator extends CommonValidator {
    constructor() {
        super();
    }
}

/**
 * 通用型错误检测，每一个接口的删除都是根据id进行删除
 */
class DeleteValidator extends CommonValidator {
    constructor() {
        super();
        // this.menuId = [
        //     new Rule("isNotEmpty", "id不能为空")
        // ]
    }
}


module.exports = {
    CreateOrUpdateMenuValidator,
    DeleteValidator: DeleteValidator
};
