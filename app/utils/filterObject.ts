export default function filterObject(obj: { [key: string]: any }, allowedFields: string[]): { [key: string]: any } {
    const filteredObj: { [key: string]: any } = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && allowedFields.includes(key)) {
            filteredObj[key] = obj[key];
        }
    }

    return filteredObj;
}