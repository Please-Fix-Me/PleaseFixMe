import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';
import {  BUSINESS_PASSWORD_COLLECTION_NAME } from "@/app/constants";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const client = new MongoClient(uri);
    var businessNames = []

    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(BUSINESS_PASSWORD_COLLECTION_NAME);

        // Find all entries in the collection
        var data = await collection.find().toArray();

        businessNames = data.map(data => data.name)
        response = NextResponse.json(businessNames ?? {})
    } catch (e) {
        if (e instanceof Error) {
            response = NextResponse.json({
                message: e.message
            }, {
                status: 400,
            })
        }
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

    return response;
}

export async function POST(request:NextRequest) {
    const uri = process.env.DB_CONNECTION_STRING!
    const db = process.env.DB_NAME!

    const body = await request.json()

    const client = new MongoClient(uri);
    var isAuth = false;

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db(db);
        const collection = database.collection(BUSINESS_PASSWORD_COLLECTION_NAME);

        // Find all entries in the collection
        var data = await collection.find({name: body['name'], password: body['password']}).toArray();
        if (data.length > 0) {
            isAuth = true;
        }

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

    // console.log(businessNames)
    if (isAuth) {
        return NextResponse.json({})
    } else {
        return NextResponse.json({
            message: "Incorrect password."
        }, {
            status: 401,
        })
    }
}

