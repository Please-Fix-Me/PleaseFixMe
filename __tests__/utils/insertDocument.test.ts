
import '@testing-library/jest-dom'
import insertDocument from '../../app/utils/insertDocument'
import { Collection, InsertOneResult, ObjectId } from 'mongodb';

const mockInsertOne = jest.fn();
jest.mock('mongodb', () => ({
  Collection: jest.fn().mockImplementation(() => ({
    insertOne: mockInsertOne,
  })),
  ObjectId: jest.fn().mockImplementation(() => 'mockObjectId'),
}));

describe('insertDocument', () => {
  let collection: Collection;

  beforeEach(() => {
    collection = new Collection();
  });

  it('should return success when document is inserted', async () => {
    const mockResult: InsertOneResult<any> = {
      acknowledged: true,
      insertedId: new ObjectId(),
    };
    mockInsertOne.mockResolvedValue(mockResult);
    const result = await insertDocument(collection, {});
    expect(result).toEqual({ success: true, message: 'Document was successfully inserted.' });
  });

  it('should return failure when no document is inserted', async () => {
    const mockResult: InsertOneResult<any> = {
      acknowledged: false,
      insertedId: new ObjectId(),
    };
    mockInsertOne.mockResolvedValue(mockResult);
    const result = await insertDocument(collection, {});
    expect(result).toEqual({ success: false, message: 'No document was inserted.' });
  });

  it('should return error message when an error occurs', async () => {
    const mockError = new Error('Test error');
    mockInsertOne.mockRejectedValue(mockError);
    const result = await insertDocument(collection, {});
    expect(result).toEqual({ success: false, message: 'Test error' });
  });
});
