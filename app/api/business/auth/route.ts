import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD_DB_KEY, BUSINESS_PASSWORD_COLLECTION_NAME } from "@/app/constants";
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

        // Remove ADMIN_KEY entry
        data = data.filter((data: { name: string; }) => data.name !== ADMIN_PASSWORD_DB_KEY)

        // Remove passwords from the data - just the names
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

    var adminResponse = await documentExists(
        BUSINESS_PASSWORD_COLLECTION_NAME,
        {
            name: ADMIN_PASSWORD_DB_KEY,
            password: body['password']
        }
    )

    // Parse response and return the correct result
    if (response.success || adminResponse.success) {
        if (response.result || adminResponse.result) {
            // Document was found - ok
            return NextResponse.json({
                message: adminResponse.result ? 'admin' : 'business'
            }, {
                status: 200
            })
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
            message: response.success ? adminResponse.result : response.result
        }, {
            status: 400,
        })
    }
}

