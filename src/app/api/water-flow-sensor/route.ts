import { type NextRequest, NextResponse } from "next/server";
import { db } from '@/server/db';

export type Payload = {
    value: string,
}

export async function POST(request: NextRequest) {
    const payload = await request.json() as Payload
    console.log(payload, "hereeee")
    try {
        const data = await db.waterFlowSensor.create({
            data: {
                value: parseFloat(!Number.isNaN(payload.value) ? payload.value : '0')
            }
        })
        const response =  NextResponse.json(data);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        return response
    } catch (error) {
        return NextResponse.json(
            { error: error, },
            { status: 500 },
        );
    }
}