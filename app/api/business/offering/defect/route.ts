import { NextRequest, NextResponse } from "next/server";
import { DEFECT_COLLECTION_NAME, ALLOWED_DEFECT_UPDATE_FIELDS } from "@/app/constants";
import { randomUUID } from "crypto";
import insertDocument from "@/app/utils/insertDocument";
import updateDocumentById from "@/app/utils/updateDocumentById";
import queryCollection from "@/app/utils/queryCollection";
import documentExists from "@/app/utils/documentExists";
import deleteDocument from "@/app/utils/deleteDocument";
import filterObject from "@/app/utils/filterObject";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {

    // Get business name from query param
    const businessName = request.nextUrl.searchParams.get("businessName")
    const offeringName = request.nextUrl.searchParams.get("offeringName")
    const defectId = request.nextUrl.searchParams.get("id")

    // Get business document
    var response = await queryCollection(
        DEFECT_COLLECTION_NAME, 
        defectId ? { 
            businessName: businessName,
            offeringName: offeringName,
            _id: new ObjectId(defectId)
        } : {
            businessName: businessName,
            offeringName: offeringName
        }
        
    )

    console.log(response)
    return NextResponse.json(response);
}

export async function PATCH(request: NextRequest) {
    // Set response object to track
    var response: NextResponse<any> = NextResponse.json({ status: 500 })

    // Parse the body of the request
    let body = await request.json()

    var result = null
    try {
        // Check if a document with the same name already exists
        const existingDocument = await documentExists(
            DEFECT_COLLECTION_NAME, 
            { 
                businessName: body['businessName'],
                offeringName: body['offeringName'],
                _id: new ObjectId(body['_id'])
            }
        )
        if (!existingDocument.success) {
            throw new Error("Unable to verify defect name " + body['name'] + " availability.")
        }
        if (!existingDocument.result) {
            throw new Error("A defect with name " + body['name'] + " does not already exist.")
        }

        var statusChanges = body.statusChanges
        if (!statusChanges) {
            statusChanges = [{
                status: "Open",
                reason: "Defect opened by user"
            }]
        }
        statusChanges.push({
            status: body['status'],
            reason: body['statusChangeReason']
        })
        body.statusChanges = statusChanges
        body._id = new ObjectId(body['_id'])

        // Clean input, in case of security vulnerability
        body = filterObject(body, ALLOWED_DEFECT_UPDATE_FIELDS)

        // Update the document
        result = await updateDocumentById(DEFECT_COLLECTION_NAME, body)
        if (result.success) {
            response = NextResponse.json({});
        } else {
            throw new Error("Failed to update status for " + body['name'] + ".")
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
