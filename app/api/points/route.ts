
import cockpit from "@/lib/cockpit";
import { NextResponse } from "next/server";
 
export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const points = Number(url.searchParams.get("points"));

    await cockpit.saveItem("guests", {
        "_id": id,
        "points": points
    })

    return NextResponse.json({ success: true });
}