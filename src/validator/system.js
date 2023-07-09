const { CommonValidator, Rule, RuleResult } = require("../lib/common-validator");
const User = require("../models/user");
const { LoginType } = require("../config/login-type");

class CreateOrUpdateMenuValidator extends CommonValidator {
    constructor() {
        super();
    }
}

class DeleteMenuValidator extends CommonValidator {
    constructor() {
        super();
        // this.menuId = [
        //     new Rule("isNotEmpty", "id不能为空")
        // ]
    }
}


module.exports = {
    CreateOrUpdateMenuValidator,
    DeleteMenuValidator
};
