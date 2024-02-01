import { NextRequest, NextResponse } from "next/server";
import {  BUSINESS_PASSWORD_COLLECTION_NAME } from "@/app/constants";
import queryCollection from "@/app/utils/queryCollection";
import documentExists from "@/app/utils/documentExists";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {

    // Query for all businesses
    var response = await queryCollection(
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

    // Parse the request body
    const body = await request.json()

    // Check if the business name and password combination exists in the database
    var response = await documentExists(
        BUSINESS_PASSWORD_COLLECTION_NAME, 
        {
            name:  body['name'],
            password: body['password']
        }
    )

    // Parse response and return the correct result
    if (response.success) {
        if (response.result) {
            // Document was found - ok
            return NextResponse.json({})
        } else {
            // Document was not found - incorrect password
            return NextResponse.json({
                message: "Incorrect password."
            }, {
                status: 401,
            })
        }
    } else {
        // Something went wrong
        return NextResponse.json({
            message: response.result
        }, {
            status: 400,
        })
    }
}

