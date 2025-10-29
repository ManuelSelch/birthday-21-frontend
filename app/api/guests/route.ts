
import cockpit from "@/lib/cockpit";
import { NextResponse } from "next/server";
 
export async function GET(request: Request) {
    const guests = await cockpit.getItems("guests")
    return NextResponse.json(guests);
}