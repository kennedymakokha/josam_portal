export function isEmpty(obj: any) {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return true;
}

export function isNumber(str: any) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}