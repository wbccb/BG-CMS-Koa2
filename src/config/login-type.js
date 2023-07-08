function isThisType(value) {
    for(let key in this) {
        if(this[key] === value) {
            return true;
        }
    }
    return false;
}

const LoginType = {
    USER_EMAIL: 101,
    USER_MOBILE: 102,
    USER_MINI_PROGRAM: 103,
    isThisType
}

module.exports = {
    LoginType
}