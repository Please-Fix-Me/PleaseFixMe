import deleteDocument from '@/app/utils/deleteDocument';
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

let mockDeleteOne = jest.fn();
(MongoClient as any as jest.Mock).mockReturnValue({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
            deleteOne: mockDeleteOne, // Correctly mock deleteOne method here
        }),
    }),
    close: jest.fn().mockResolvedValue(undefined),
});

describe('deleteDocument', () => {
  it('should delete document and return success message', async () => {
    mockDeleteOne.mockResolvedValue({ acknowledged: true });

    const result = await deleteDocument('collectionName', {});

    expect(mockDeleteOne).toHaveBeenCalledWith({});
    expect(result).toEqual({ success: true, message: 'Document was successfully deleted.' });
  });

  it('should return failure message if document was not deleted', async () => {
    mockDeleteOne.mockResolvedValue({ acknowledged: false });

    const result = await deleteDocument('collectionName', {});

    expect(mockDeleteOne).toHaveBeenCalledWith({});
    expect(result).toEqual({ success: false, message: 'No document was deleted.' });
  });

  it('should return failure message if error occurs', async () => {
    const error = new Error('Mocked error');
    mockDeleteOne.mockRejectedValue(error);

    const result = await deleteDocument('collectionName', {});

    expect(mockDeleteOne).toHaveBeenCalled();
    expect(result).toEqual({ success: false, message: 'Mocked error' });
  });
});

