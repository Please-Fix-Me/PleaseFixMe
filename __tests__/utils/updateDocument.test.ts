import updateDocument from '../../app/utils/updateDocument'
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

let mockUpdateOne = jest.fn();
(MongoClient as any as jest.Mock).mockReturnValue({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
            updateOne: mockUpdateOne,
        }),
    }),
    close: jest.fn().mockResolvedValue(undefined),
});

it('should update a doc in the collection and return success', async () => {
    const collectionName = 'testCollection';
    const json = { name: 'test', contactName: 'test', contactEmail: 'test@test.com', contactPhone: '1234567890' };

    mockUpdateOne.mockResolvedValue({ acknowledged: true, upsertedId: 'testId' });

    const result = await updateDocument(collectionName, json);

    expect(result).toEqual({ success: true, message: 'Document was successfully updated.' });
    expect(mockUpdateOne).toHaveBeenCalledWith({ name: 'test' }, { $set: { contactName: 'test', contactEmail: 'test@test.com', contactPhone: '1234567890' } });
});

it('should fail to update a doc in the collection and return failure', async () => {
    const collectionName = 'testCollection';
    const json = { name: 'test', contactName: 'test', contactEmail: 'test@test.com', contactPhone: '1234567890' };

    mockUpdateOne.mockResolvedValue({ acknowledged: false });

    const result = await updateDocument(collectionName, json);

    expect(result).toEqual({ success: false, message: 'No document was updated.' });
    expect(mockUpdateOne).toHaveBeenCalledWith({ name: 'test' }, { $set: { contactName: 'test', contactEmail: 'test@test.com', contactPhone: '1234567890' } });
});

it('should handle errors when they are instances of Error', async () => {
    const collectionName = 'testCollection';
    const json = { name: 'test', contactName: 'test', contactEmail: 'test@test.com', contactPhone: '1234567890' };

    mockUpdateOne.mockRejectedValue(new Error('An error occurred.'));

    const result = await updateDocument(collectionName, json);

    expect(result.success).toBe(false);
    expect(result.message).toBe('An error occurred.');
});

it('should handle errors when they are not instances of Error', async () => {
    const collectionName = 'testCollection';
    const json = { name: 'test', contactName: 'test', contactEmail: 'test@test.com', contactPhone: '1234567890' };

    mockUpdateOne.mockRejectedValue('An error occurred.');

    const result = await updateDocument(collectionName, json);

    expect(result.success).toBe(false);
    expect(result.message).toBe('An unknown error occurred.');
});