import cockpit from "@/lib/cockpit";
import { NextResponse } from "next/server";
 
export async function POST(request: Request) {
    const body = await request.json();
    const id = body.id;

    if(!id)
        return NextResponse.json({ success: false, error: "no ticket id provided" });

    let guest = await cockpit.getItem("guests", id as string);

    if(!guest)
        return NextResponse.json({ success: false, error: "ticket is invalid" });
    
    if(!guest.accepted)
        return NextResponse.json({ success: false, warning: "guest has not accepted invitation" });

    if(guest.checked_in)
        return NextResponse.json({ success: false, warning: "guest is already checked in" });

    await cockpit.saveItem("guests", {
        "_id": id,
        "checked_in": true
    })

    return NextResponse.json({ success: true });
}