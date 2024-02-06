import { MongoClient } from 'mongodb';

export default async function insertDocument(collectionName: string, json: object): Promise<{ success: boolean; message: string }> {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(collectionName);

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
    } finally {
        await client.close()
    }
}