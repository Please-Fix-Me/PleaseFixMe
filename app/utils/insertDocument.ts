import { Collection } from 'mongodb';

export default async function insertDocument(collection: Collection, json: object): Promise<{ success: boolean; message: string }> {
    try {
        const result = await collection.insertOne(json);

        if (result.acknowledged) {
            console.log('Document was successfully inserted:', result.insertedId);
            return { success: true, message: 'Document was successfully inserted.' };
        } else {
            console.log('No document was inserted.');
            return { success: false, message: 'No document was inserted.' };
        }
    } catch (error) {
        console.error('An error occurred while inserting the document:', error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: 'An unknown error occurred.' };
        }
    }
}