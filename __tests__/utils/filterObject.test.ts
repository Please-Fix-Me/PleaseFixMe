import filterObject from "@/app/utils/filterObject";

it('should remove fields not present in allowedFields list', () => {
    const obj = {
        name: 'John',
        age: 30,
        city: 'New York',
        country: 'USA'
    };
    const allowedFields = ['name', 'age'];

    const filteredObj = filterObject(obj, allowedFields);

    expect(filteredObj).toEqual({
        name: 'John',
        age: 30
    });
});

it('should return an empty object if all fields are removed', () => {
    const obj = {
        name: 'John',
        age: 30
    };
    const allowedFields: string[] = [];

    const filteredObj = filterObject(obj, allowedFields);

    expect(filteredObj).toEqual({});
});

it('should return the original object if allowedFields include all keys', () => {
    const obj = {
        name: 'John',
        age: 30
    };
    const allowedFields = ['name', 'age'];

    const filteredObj = filterObject(obj, allowedFields);

    expect(filteredObj).toEqual(obj);
});