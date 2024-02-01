import { NextRequest, NextResponse } from "next/server";
import { BUSINESS_COLLECTION_NAME, BUSINESS_PASSWORD_COLLECTION_NAME } from "@/app/constants";
import { randomUUID } from "crypto";
import insertDocument from "@/app/utils/insertDocument";
import updateDocument from "@/app/utils/updateDocument";
import generatePassword from "@/app/utils/generatePassword.js";
import queryCollection from "@/app/utils/queryCollection";
import documentExists from "@/app/utils/documentExists";
import deleteDocument from "@/app/utils/deleteDocument";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {

    // Get business name from query param
    const businessName = request.nextUrl.searchParams.get("name")

    // Get business document
    var response = await queryCollection(
        BUSINESS_COLLECTION_NAME, 
        {
            name: businessName
        }
    )
    return NextResponse.json(response);
}

export async function POST(request: NextRequest) {

    // Set response object to track
    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    // Parse the body of the request
    const body = await request.json()

    // Generate a unique ID for business
    const id = randomUUID();
    body['id'] = id;

    try {

        // Check if the business already exists
        const existingDocument = await documentExists(
            BUSINESS_PASSWORD_COLLECTION_NAME, 
            { name: body['name']}
        )
        if (!existingDocument.success) {
            throw new Error("Unable to verify business name " + body['name'] + " availability.")
        }
        if (existingDocument.result) {
            throw new Error("A business with name " + body['name'] + " already exists. Please try another name.")
        }

        // Create the business

        // Add the business document
        var result = await insertDocument(BUSINESS_COLLECTION_NAME, body)
        if (result.success) {
            // If the document was successfully created, create and add the password
            const password = generatePassword();
            const passwordPayload = {
                id: id,
                name: body['name'],
                password: password
            }
            result = await insertDocument(BUSINESS_PASSWORD_COLLECTION_NAME, passwordPayload)
            response = NextResponse.json({ password: password });
        }
    } catch (e) {
        // Something went wrong
        if (e instanceof Error) {
            response = NextResponse.json({
                message: e.message
            }, {
                status: 400,
            })
        }
    }

    return response
}

export async function PUT(request: NextRequest) {
    // Set response object to track
    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    // Parse the body of the request
    const body = await request.json()

    var result = null
    try {
        // Check if a document with the same name already exists
        const existingDocument = await documentExists(
            BUSINESS_PASSWORD_COLLECTION_NAME, 
            { name: body['name']}
        )
        if (!existingDocument.success) {
            throw new Error("Unable to verify business name " + body['name'] + " availability.")
        }
        if (!existingDocument.result) {
            throw new Error("A business with name " + body['name'] + " does not already exist.")
        }

        // Update the document
        result = await updateDocument(BUSINESS_COLLECTION_NAME, body)
        if (result.success) {
            response = NextResponse.json({});
        }

    } catch (e) {
        // Something went wrong
        if (e instanceof Error) {
            response = NextResponse.json({
                message: e.message
            }, {
                status: 400,
            })
        }
    }

    return response
}

export async function DELETE(request: NextRequest) {
    // Set response object to track
    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    // Get business name from query string
    const businessName = request.nextUrl.searchParams.get("name")

    var result = null
    try {
        // Check if a document with the same name already exists
        const existingDocument = await documentExists(
            BUSINESS_PASSWORD_COLLECTION_NAME, 
            { name: businessName}
        )
        if (!existingDocument.success) {
            throw new Error("Unable to verify business name " + businessName + " availability.")
        }
        if (!existingDocument.result) {
            throw new Error("A business with name " + businessName + " does not already exist.")
        }
        
        // Delete password document first
        result = await deleteDocument(BUSINESS_PASSWORD_COLLECTION_NAME, {name: businessName})
        if (result.success) {
            // If that was successful, delete the business document
            result = await deleteDocument(BUSINESS_COLLECTION_NAME, {name: businessName})
            if (result.success) {
                response = NextResponse.json({});
            } else {
                throw new Error("Failed to delete " + businessName + ".")
            }
        } else {
            throw new Error("Failed to delete " + businessName + ".")
        }

    } catch (e) {
        // Something went wrong
        if (e instanceof Error) {
            response = NextResponse.json({
                message: e.message
            }, {
                status: 400,
            })
        } else {
            response = NextResponse.json({
                message: "An unknown error occurred."
            }, {
                status: 500,
            })
        }
    }

    return response
}