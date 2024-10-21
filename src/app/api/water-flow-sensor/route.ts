
import { db } from "@/server/db";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    value: string
}

export async function POST(request: NextRequest){
    try {
        console.log("trigerr me", request.method)
        const headers = new Headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, { headers });
        }
        const payload  = await request.json() as {value:string}

        const data = await db.waterFlowSensor.create({
            data : { value: Number.isNaN(parseFloat(payload.value)) ? 0 : parseFloat(payload.value) }
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