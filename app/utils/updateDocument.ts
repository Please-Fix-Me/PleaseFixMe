import { Collection, MongoClient } from 'mongodb';

type FormData = {
    name?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
};


export default async function updateDocument(collectionName: string, json: FormData): Promise<{ success: boolean; message: string }> {

    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const client = new MongoClient(uri);

    const name = json.name;
    delete json.name
    try {
        // Connect to MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(collectionName);

        const result = await collection.updateOne(
            { name: name },
            {
                $set: json,
            }
        );

        if (result.acknowledged) {
            console.log('Document was successfully updated:', result.upsertedId);
            return { success: true, message: 'Document was successfully updated.' };
        } else {
            console.log('No document was updated.');
            return { success: false, message: 'No document was updated.' };
        }
    } catch (error) {
        console.error('An error occurred while updating the document:', error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        } else {
            return { success: false, message: 'An unknown error occurred.' };
        }
    } finally {
        await client.close()
    }
}