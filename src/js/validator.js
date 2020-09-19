function isEmail(value) {
    if (!isNonEmptyString(value)) return false;

    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return re.test(String(value).toLowerCase());
}

function isFullName(name) {
    return isNonEmptyString(name) && name.trim().split(' ').length > 1;
}

function isNonEmptyString(value) {
    return (typeof value === 'string') && value.trim();
}

module.exports = {
    isEmail,
    isFullName,
    isNonEmptyString,
};
