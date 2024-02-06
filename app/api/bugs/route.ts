import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';
import { BUG_COLLECTION_NAME } from "@/app/constants" ;

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const client = new MongoClient(uri);
    var data = []

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(BUG_COLLECTION_NAME);

        // Find all entries in the collection
        data = await collection.find().toArray();

        // NOTE: This is how you filter
        // data = await collection.find({product: "PleaseFixMe"}).toArray();

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

    return NextResponse.json(data);
}