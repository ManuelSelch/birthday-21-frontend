
import cockpit from "@/lib/cockpit";
import { NextResponse } from "next/server";
 
export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const companion = url.searchParams.get("companion") == "1";
    
    await cockpit.saveItem("guests", {
        "_id": id,
        "companion": companion
    })

    return NextResponse.json({ success: true });
}