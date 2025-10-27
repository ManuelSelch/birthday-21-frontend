
import cockpit from "@/lib/cockpit";
import { NextResponse } from "next/server";
 
export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    let guest = await cockpit.getItem("guests", id as string);
    guest.accepted = true;
    await cockpit.saveItem("guests", {
        "_id": id,
        "accepted": true
    })

    return NextResponse.json({ success: true });
}