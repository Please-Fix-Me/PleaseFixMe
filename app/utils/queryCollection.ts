import { MongoClient } from 'mongodb';

export default async function queryCollection(collectionName: string, query: object): Promise<{ success: boolean; result: any }> {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const client = new MongoClient(uri);
    var response;

    try {
        // Connect to MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(collectionName);

        // Find all entries in the collection
        var data = await collection.find(query).toArray();
        response = {
            success: true,
            result: data
        }
    }
    catch (e) {
        if (e instanceof Error) {
            response = {
                result: e.message,
                success: false
            }
        } else {
            response = {
                result: "An unknown error occurred",
                success: false
            }
        }
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
    return response
}