import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    value: string,
}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    console.log(payload, "hereeee")
    const data = await api.water.createFlowData({
        value:!Number.isNaN(payload.value)? payload.value : '0'
    })
    return NextResponse.json(data);
}
