import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    value: string
}

export async function POST (request: NextRequest){
    const payload = await request.json() as Payload
    const data = await api.water.createFloatData(payload)
    return NextResponse.json(data);
}