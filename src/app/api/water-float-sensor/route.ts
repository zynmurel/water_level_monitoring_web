
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    value: string
}

export async function POST (request: NextRequest){
    try {
        const headers = new Headers({
            'Access-Control-Allow-Origin': '*', // Allow all origins or replace '*' with your frontend's URL
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        if (request.method === 'OPTIONS') {
            // Preflight response for CORS
            return new NextResponse(null, { headers });
        }
        const payload  = await request.json() as {value:string}

        // Example database interaction
        const data = { value: parseFloat(payload.value) };

        return new NextResponse(JSON.stringify(data), { headers });

    } catch (error) {
        console.error('Error creating float data:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Failed to create float data', error: "Server error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}