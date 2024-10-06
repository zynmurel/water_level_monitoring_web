import { api } from "@/trpc/server";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    id: any | null,
    value: any | number,
}

export async function POST (request: NextRequest){
    const payload = await request.json() as any
    const data = await api.water.createFlowData(payload)
    return NextResponse.json(data);
}
