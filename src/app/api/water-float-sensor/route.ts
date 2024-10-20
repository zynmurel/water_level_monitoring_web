import { api } from "@/trpc/server";
import { NextApiResponse, NextApiRequest } from "next";
import {type NextRequest, NextResponse} from "next/server";

export type Payload = {
    value: string
}

export async function POST (request: NextApiRequest, res:NextApiResponse){
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    const payload = await request.body as Payload
    const data = await api.water.createFloatData(payload)
    return NextResponse.json(data);
}