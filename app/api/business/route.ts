import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';
import { BUSINESS_COLLECTION_NAME, BUSINESS_PASSWORD_COLLECTION_NAME } from "@/app/constants";
import { randomUUID } from "crypto";
import insertDocument from "@/app/utils/insertDocument";
import updateDocument from "@/app/utils/updateDocument";
import generatePassword from "@/app/utils/generatePassword.js";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const client = new MongoClient(uri);
    const businessName = request.nextUrl.searchParams.get("name")
    var data;

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(BUSINESS_COLLECTION_NAME);

        // Find all entries in the collection
        data = await collection.find({name: businessName}).toArray();

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    // Set response object to track
    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    const body = await request.json()

    const id = randomUUID();
    body['id'] = id;

    const client = new MongoClient(uri);
    var result = null
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(BUSINESS_COLLECTION_NAME);
        const passwordCollection = database.collection(BUSINESS_PASSWORD_COLLECTION_NAME);

        // Check if a document with the same name already exists
        const existingDocument = await passwordCollection.findOne({ name: body['name'] });
        if (existingDocument) {
            throw new Error("A document with name " + body['name'] + " already exists. Please try another name.")
        }

        result = await insertDocument(collection, body)
        if (result.success) {
            const password = generatePassword();
            console.log(password)
            const passwordPayload = {
                id: id,
                name: body['name'],
                password: password
            }
            result = await insertDocument(passwordCollection, passwordPayload)
            response = NextResponse.json({ password: password });
        }

    } catch (e) {
        if (e instanceof Error) {
            response = NextResponse.json({
                message: e.message
            }, {
                status: 400,
            })
        }
    }
    finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

    return response
}

export async function PUT(request: NextRequest) {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    // Set response object to track
    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    const body = await request.json()

    const client = new MongoClient(uri);
    var result = null
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(BUSINESS_COLLECTION_NAME);
        const passwordCollection = database.collection(BUSINESS_PASSWORD_COLLECTION_NAME);

        // Check if a document with the same name already exists
        const existingDocument = await passwordCollection.findOne({ name: body['name'] });
        if (!existingDocument) {
            throw new Error("A document with name " + body['name'] + " does not already exist.")
        }

        result = await updateDocument(collection, body)
        if (result.success) {
            response = NextResponse.json({});
        }

    } catch (e) {
        if (e instanceof Error) {
            response = NextResponse.json({
                message: e.message
            }, {
                status: 400,
            })
        }
    }
    finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

    return response
}

export async function DELETE(request: NextRequest) {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    // Set response object to track
    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    const client = new MongoClient(uri);
    const businessName = request.nextUrl.searchParams.get("name")

    var result = null
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(BUSINESS_COLLECTION_NAME);
        const passwordCollection = database.collection(BUSINESS_PASSWORD_COLLECTION_NAME);

        // Check if a document with the same name already exists
        const existingDocument = await passwordCollection.findOne({ name: businessName });
        if (!existingDocument) {
            throw new Error("A document with name " + businessName + " does  not already exist.")
        }
        
        result = await passwordCollection.deleteOne({name: businessName})
        result = await collection.deleteOne({name: businessName})
        response = NextResponse.json({});

    } catch (e) {
        if (e instanceof Error) {
            response = NextResponse.json({
                message: e.message
            }, {
                status: 400,
            })
        }
    }
    finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

    return response
}