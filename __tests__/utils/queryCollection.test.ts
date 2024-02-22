import queryCollection from '@/app/utils/queryCollection';
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

let mockToArray = jest.fn();
(MongoClient as any as jest.Mock).mockReturnValue({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
            find: jest.fn().mockReturnValue({
                toArray: mockToArray
            })
        }),
    }),
    close: jest.fn().mockResolvedValue(undefined),
});


it('should return data from the database', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    mockToArray.mockResolvedValue(mockData);

    const result = await queryCollection('test', {});

    expect(result).toEqual({ success: true, result: mockData });
});

it('should return error if query fails', async () => {
    const mockError = new Error('Test error');
    mockToArray.mockRejectedValue(mockError)

    const result = await queryCollection('test', {});

    expect(result).toEqual({ success: false, result: mockError.message });
});
