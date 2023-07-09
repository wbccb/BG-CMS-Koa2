const { CommonValidator, Rule, RuleResult } = require("../lib/common-validator");
const User = require("../models/user");
const { LoginType } = require("../config/login-type");

class CreateMenuValidator extends CommonValidator {
    constructor() {
        super();
    }
}


module.exports = {
    CreateMenuValidator
};
