import pullFromDocumentById from "@/app/utils/pullFromDocumentById";
import { MongoClient, ObjectId } from "mongodb";

jest.mock('mongodb');

let mockPullOne = jest.fn();
(MongoClient as any as jest.Mock).mockReturnValue({
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
            updateOne: mockPullOne,
        }),
    }),
    close: jest.fn().mockResolvedValue(undefined),
});

const OBJ_ID = new ObjectId("5e63c3a5e4232e4cd0274ac2")

it('should update document by id and return success message', async () => {
  const mockCollectionName = 'mockCollection';
  const mockJson = { field: 'value' };

  mockPullOne.mockResolvedValue({ acknowledged: true, upsertedId: OBJ_ID });

  const result = await pullFromDocumentById(mockCollectionName, { _id: OBJ_ID, ...mockJson });

  expect(result).toEqual({ success: true, message: 'Document was successfully updated.' });
  expect(mockPullOne).toHaveBeenCalled();
  expect(mockPullOne).toHaveBeenCalledWith({ _id: OBJ_ID }, { $pull: mockJson });
  expect(mockPullOne).toHaveBeenCalled();
});

it('should handle errors and return failure message', async () => {
  const mockCollectionName = 'mockCollection';
  const mockJson = { field: 'value' };
  const mockErrorMessage = 'Error message';

  mockPullOne.mockRejectedValue(new Error(mockErrorMessage));

  const result = await pullFromDocumentById(mockCollectionName, { _id: OBJ_ID, ...mockJson });

  expect(result).toEqual({ success: false, message: mockErrorMessage });
  expect(mockPullOne).toHaveBeenCalled();
  expect(mockPullOne).toHaveBeenCalledWith({ _id: OBJ_ID }, { $pull: mockJson });
  expect(mockPullOne).toHaveBeenCalled();
});

it('should return failure message when no document is updated', async () => {
  const mockCollectionName = 'mockCollection';
  const mockJson = { field: 'value' };

  mockPullOne.mockResolvedValue({ acknowledged: false });

  const result = await pullFromDocumentById(mockCollectionName, { _id: OBJ_ID, ...mockJson });

  expect(result).toEqual({ success: false, message: 'No document was updated.' });
  expect(mockPullOne).toHaveBeenCalled();
  expect(mockPullOne).toHaveBeenCalledWith({ _id: OBJ_ID }, { $pull: mockJson });
  expect(mockPullOne).toHaveBeenCalled();
});