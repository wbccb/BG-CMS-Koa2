/**
 * 获取obj所有字段
 */
function getAllfieldNames(obj, option) {
    // options = {
    //     prefix?: string;
    //     filter?: (key: any) => boolean;
    // }
    let keys = Reflect.ownKeys(obj);
    return filterPreFix(keys, option);
}


function getAllMethodNames(obj, options) {
    const methods = new Set();

    // 检测是否是箭头函数
    if (Reflect.getPrototypeOf(obj)) {
        let keys = Reflect.ownKeys(obj);
        keys.forEach(key => {
            methods.add(key);
        });
        keys = Array.from(methods.values());
        return filterPreFix(keys, options);
    }

    return [];
}


function filterPreFix(keys, option) {
    if (option && option.prefix) {
        // 筛选前缀
        keys = keys.filter((key) => {
            return key.toString().startsWith(option.prefix);
        });
    }

    if (option && option.filter) {
        keys = keys.filter(option.filter);
    }

    return keys;
}

function adaptToChildrenList(o, childrenListMap) {
    const parentId = o["menuId"] || o["id"];
    if (!parentId || !childrenListMap[parentId]) {
        return;
    }
    // childrenListMap = {parentId: [child1, child2, child3]}
    o["children"] = childrenListMap[parentId];

    for (let c of o["children"]) {
        adaptToChildrenList(c, childrenListMap);
    }
}

module.exports = {
    getAllfieldNames,
    getAllMethodNames,
    adaptToChildrenList
};
