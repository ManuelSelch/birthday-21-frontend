
import cockpit from "@/lib/cockpit";
import { NextResponse } from "next/server";
 
export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    let guest = await cockpit.getItem("guests", id as string);
    
    await cockpit.saveItem("guests", {
        "_id": id,
        "accepted": false
    })

    return NextResponse.json({ success: true });
}