import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    value: string
}

export async function POST (request: NextRequest){
    try {
        // Handle CORS Preflight Requests
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*', // Update with your allowed origin
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        // Parse the payload
        const payload = await request.json() as Payload;

        // Call your API function
        const data = await api.water.createFloatData(payload);

        // Return the response
        return NextResponse.json(data, {
            headers: {
                'Access-Control-Allow-Origin': '*', // Update with your allowed origin
            },
        });

    } catch (error) {
        console.error('Error creating float data:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Failed to create float data', error: "Server error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}