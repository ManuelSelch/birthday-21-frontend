
import cockpit from "@/lib/cockpit";
import { NextResponse } from "next/server";
 
export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    await cockpit.saveItem("guests", {
        "_id": id,
        "invited": true
    })

    return NextResponse.json({ success: true });
}