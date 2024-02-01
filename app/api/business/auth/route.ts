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
    const body = await request.json()

    var response = await queryDb(
        BUSINESS_PASSWORD_COLLECTION_NAME, 
        {
            name:  body['name'],
            password: body['password']
        }
    )

    // Parse response and return the correct result
    if (response.success) {
        if (response.result.length > 0) {
            return NextResponse.json({})
        } else {
            return NextResponse.json({
                message: "Incorrect password."
            }, {
                status: 401,
            })
        }
    } else {
        return NextResponse.json({
            message: response.result
        }, {
            status: 400,
        })
    }
}

