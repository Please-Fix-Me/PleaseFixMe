import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from 'mongodb';
import {  BUSINESS_PASSWORD_COLLECTION_NAME } from "@/app/constants";
import queryDb from "@/app/utils/queryCollection";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
    var response = await queryDb(
        BUSINESS_PASSWORD_COLLECTION_NAME, 
        {}
    )
    
    // Remove password from the response object
    if (response.success) {
        var data = response.result;
        data = data.map((data: { name: string; }) => data.name)
        response.result = data
    }
    
    return NextResponse.json(response);
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

