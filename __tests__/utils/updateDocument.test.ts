
import '@testing-library/jest-dom'
import updateDocument from '../../app/utils/updateDocument'
import { Collection } from 'mongodb';
import { ObjectId as BsonObjectId } from 'bson';

jest.mock('mongodb');

describe('updateDocument', () => {
    let mockCollection: jest.Mocked<Collection>;

    beforeEach(() => {
        mockCollection = {
            updateOne: jest.fn(),
        } as any;
    });

    it('should update the document successfully', async () => {
        const formData = {
            name: 'test',
            contactName: 'test contact',
            contactEmail: 'test@test.com',
            contactPhone: '1234567890',
        };

        mockCollection.updateOne.mockResolvedValue({
            acknowledged: true, 
            upsertedId: new BsonObjectId(),
            matchedCount: 1,
            modifiedCount: 1,
            upsertedCount: 1
        });

        const result = await updateDocument(mockCollection, formData);

        expect(result).toEqual({ success: true, message: 'Document was successfully updated.' });
    });

    it('should return an error if no document was updated', async () => {
        const formData = {
            name: 'test',
            contactName: 'test contact',
            contactEmail: 'test@test.com',
            contactPhone: '1234567890',
        };

        mockCollection.updateOne.mockResolvedValue({
            acknowledged: false, 
            matchedCount: 0,
            modifiedCount: 0,
            upsertedCount: 0,
            upsertedId: new BsonObjectId(),
        });

        const result = await updateDocument(mockCollection, formData);

        expect(result).toEqual({ success: false, message: 'No document was updated.' });
    });

    it('should return an error if an exception is thrown', async () => {
        const formData = {
            name: 'test',
            contactName: 'test contact',
            contactEmail: 'test@test.com',
            contactPhone: '1234567890',
        };

        mockCollection.updateOne.mockRejectedValue(new Error('Test error'));

        const result = await updateDocument(mockCollection, formData);

        expect(result).toEqual({ success: false, message: 'Test error' });
    });

    it('should return an unknown error if a non-Error exception is thrown', async () => {
        const formData = {
            name: 'test',
            contactName: 'test contact',
            contactEmail: 'test@test.com',
            contactPhone: '1234567890',
        };

        mockCollection.updateOne.mockRejectedValue('Test error');

        const result = await updateDocument(mockCollection, formData);

        expect(result).toEqual({ success: false, message: 'An unknown error occurred.' });
    });
});