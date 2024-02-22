import documentExists from '@/app/utils/documentExists';
import queryCollection from '@/app/utils/queryCollection';

jest.mock('../../app/utils/queryCollection');
const mockQueryCollection = queryCollection as jest.MockedFunction<typeof queryCollection>;

it('should return true if the document exists', async () => {
    const collectionName = 'testCollection';
    const query = { name: 'test' };

    mockQueryCollection.mockResolvedValue({ success: true, result: [{ name: 'test' }] });

    const result = await documentExists(collectionName, query);

    expect(result).toEqual({ success: true, result: true });
    expect(queryCollection).toHaveBeenCalledWith(collectionName, query);
});

it('should return false if the document does not exist', async () => {
    const collectionName = 'testCollection';
    const query = { name: 'test' };

    mockQueryCollection.mockResolvedValue({ success: true, result: [] });

    const result = await documentExists(collectionName, query);

    expect(result).toEqual({ success: true, result: false });
    expect(queryCollection).toHaveBeenCalledWith(collectionName, query);
});

it('should handle errors', async () => {
    const collectionName = 'testCollection';
    const query = { name: 'test' };

    mockQueryCollection.mockResolvedValue({ success: false, result: 'An error occurred.' });

    const result = await documentExists(collectionName, query);

    expect(result).toEqual({ success: false, result: 'An error occurred.' });
    expect(queryCollection).toHaveBeenCalledWith(collectionName, query);
});