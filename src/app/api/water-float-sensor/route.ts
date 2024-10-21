
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
export type Payload = {
    value: string
}
export async function OPTIONS(req: NextRequest) {
    const headers = new Headers({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*', // You can replace '*' with your allowed origin
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    return new NextResponse(null, { headers });
}
export async function POST(request: NextRequest) {
    try {
        console.log("trigerr me")
        const headers = new Headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, { headers });
        }
        const payload = await request.json() as { value: string }

        const data = await db.floatSensor.create({
            data: { value: Number.isNaN(parseFloat(payload.value)) ? 0 : parseFloat(payload.value) }
        })

        return new NextResponse(JSON.stringify(data), { headers });

    } catch (error) {
        console.error('Error creating float data:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Failed to create float data', error: "Server error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}