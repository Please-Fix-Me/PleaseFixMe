import { mockDeep, MockProxy } from 'jest-mock-extended';
import queryDb from '@/app/utils/queryCollection';
import { MongoClient, Db, Collection } from 'mongodb';

jest.mock('mongodb');

let mockClient: MockProxy<MongoClient> & MongoClient;
let mockDb: MockProxy<Db> & Db;
let mockCollection: MockProxy<Collection> & Collection;
let mockCursor: MockProxy<ReturnType<Collection['find']>>;

beforeEach(() => {
    mockCursor = mockDeep<ReturnType<Collection['find']>>();
    mockCursor.toArray.mockResolvedValue([]);

    mockCollection = mockDeep<Collection>();
    mockCollection.find.mockReturnValue(mockCursor);

    mockDb = mockDeep<Db>();
    mockDb.collection.mockReturnValue(mockCollection);

    mockClient = mockDeep<MongoClient>();
    mockClient.connect.mockResolvedValue(mockClient);
    mockClient.db.mockReturnValue(mockDb);

    (MongoClient as jest.MockedClass<typeof MongoClient>).mockImplementation(() => mockClient);
});

describe('queryDb', () => {
    it('should return data from the database', async () => {
        const mockData = [{ id: 1, name: 'Test' }];
        mockCursor.toArray.mockResolvedValue(mockData);

        const result = await queryDb('test', {});

        expect(result).toEqual({ success: true, result: mockData });
        expect(mockClient.connect).toBeCalledTimes(1);
        expect(mockClient.close).toBeCalledTimes(1);
    });

    it('should return error if query fails', async () => {
        const mockError = new Error('Test error');
        mockCursor.toArray.mockRejectedValue(mockError);

        const result = await queryDb('test', {});

        expect(result).toEqual({ success: false, result: mockError.message });
        expect(mockClient.connect).toBeCalledTimes(1);
        expect(mockClient.close).toBeCalledTimes(1);
    });
});