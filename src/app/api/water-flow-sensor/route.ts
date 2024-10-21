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
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error, },
            { status: 500 },
        );
    }
}