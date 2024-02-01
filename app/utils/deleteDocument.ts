import { Collection, MongoClient } from 'mongodb';

export default async function deleteDocument(collectionName: string, json: object): Promise<{ success: boolean; message: string }> {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(collectionName);

        const result = await collection.deleteOne(json);

        if (result.acknowledged) {
            console.log('Document was successfully deleted:', result.acknowledged);
            return { success: true, message: 'Document was successfully deleted.' };
        } else {
            console.log('No document was deleted.');
            return { success: false, message: 'No document was deleted.' };
        }
    } catch (error) {
        console.error('An error occurred while deleting the document:', error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: 'An unknown error occurred.' };
        }
    } finally {
        await client.close()
    }
}