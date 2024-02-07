import { NextRequest, NextResponse } from "next/server";
import { OFFERING_COLLECTION_NAME } from "@/app/constants";
import { randomUUID } from "crypto";
import insertDocument from "@/app/utils/insertDocument";
import updateDocument from "@/app/utils/updateDocument";
import queryCollection from "@/app/utils/queryCollection";
import documentExists from "@/app/utils/documentExists";
import deleteDocument from "@/app/utils/deleteDocument";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {

    // Get business name from query param
    const businessName = request.nextUrl.searchParams.get("businessName")
    const offeringName = request.nextUrl.searchParams.get("name")

    // Get business document
    var response = await queryCollection(
        OFFERING_COLLECTION_NAME, 
        offeringName ? { 
            businessName: businessName,
            name: offeringName
        } : {
            businessName: businessName
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
            OFFERING_COLLECTION_NAME, 
            { 
                businessName: body['businessName'],
                name: body['name']
            }
        )
        if (!existingDocument.success) {
            throw new Error("Unable to verify offering name " + body['name'] + " availability.")
        }
        if (existingDocument.result) {
            throw new Error("A offering with name " + body['name'] + " already exists. Please try another name.")
        }

        // Create the offering

        // Add the business document
        var result = await insertDocument(OFFERING_COLLECTION_NAME, body)
        if (result.success) {
            response = NextResponse.json({});
        } else {
            throw new Error("Failed to edit " + body['name'] + ".")
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
            OFFERING_COLLECTION_NAME, 
            { 
                businessName: body['businessName'],
                name: body['name']
            }
        )
        if (!existingDocument.success) {
            throw new Error("Unable to verify offering name " + body['name'] + " availability.")
        }
        if (!existingDocument.result) {
            throw new Error("A offering with name " + body['name'] + " does not already exist.")
        }

        // Update the document
        result = await updateDocument(OFFERING_COLLECTION_NAME, body)
        if (result.success) {
            response = NextResponse.json({});
        } else {
            throw new Error("Failed to edit " + body['name'] + ".")
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
    const businessName = request.nextUrl.searchParams.get("businessName")
    const offeringName = request.nextUrl.searchParams.get("name")

    var result = null
    try {
        // Check if a document with the same name already exists
        const existingDocument = await documentExists(
            OFFERING_COLLECTION_NAME, 
            { 
                businessName: businessName,
                name: offeringName
            }
        )
        if (!existingDocument.success) {
            throw new Error("Unable to verify offering name " + offeringName + " availability.")
        }
        if (!existingDocument.result) {
            throw new Error("A offering with name " + offeringName + " does not already exist.")
        }
        
        // Delete password document first
        result = await deleteDocument(OFFERING_COLLECTION_NAME, {
            businessName: businessName,
            name: offeringName
        })
        if (result.success) {
            response = NextResponse.json({});
        } else {
            throw new Error("Failed to delete " + offeringName + ".")
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