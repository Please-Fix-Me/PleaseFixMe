import insertDocument from '../../app/utils/insertDocument'
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

let mockInsertOne = jest.fn();
(MongoClient as any as jest.Mock).mockReturnValue({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
            insertOne: mockInsertOne,
        }),
    }),
    close: jest.fn().mockResolvedValue(undefined),
});

it('should insert a doc into collection and return success', async () => {
    const collectionName = 'testCollection';
    const json = { test: 'test' };

    mockInsertOne.mockResolvedValue({ acknowledged: true, insertedId: 'testId' });

    const result = await insertDocument(collectionName, json);

    expect(result).toEqual({ success: true, message: 'Document was successfully inserted.' });
    expect(mockInsertOne).toHaveBeenCalledWith(json);
});

it('should fail to insert a doc into collection and return failure', async () => {
    const collectionName = 'testCollection';
    const json = { test: 'test' };

    mockInsertOne.mockResolvedValue({ acknowledged: false });

    const result = await insertDocument(collectionName, json);

    expect(result).toEqual({ success: false, message: 'No document was inserted.' });
    expect(mockInsertOne).toHaveBeenCalledWith(json);
});

it('should handle errors when they are instances of Error', async () => {
    const collectionName = 'testCollection';
    const json = { _id: 'invalid' }; // Invalid _id will cause an error

    mockInsertOne.mockRejectedValue(new Error('An error occurred.'));

    const result = await insertDocument(collectionName, json);

    expect(result.success).toBe(false);
    expect(result.message).toBe('An error occurred.');
});

it('should handle errors when they are not instances of Error', async () => {
    const collectionName = 'testCollection';
    const json = { _id: 'invalid' }; // Invalid _id will cause an error

    mockInsertOne.mockRejectedValue('An error occurred.');

    const result = await insertDocument(collectionName, json);

    expect(result.success).toBe(false);
    expect(result.message).toBe('An unknown error occurred.');
});