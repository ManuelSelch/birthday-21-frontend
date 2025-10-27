import generateApplePass from "@/lib/generate-apple-wallet";
import cockpit from "@/lib/cockpit";
 
export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const guest = await cockpit.getItem("guests", id as string);
    const buffer = await generateApplePass(guest);
    const uint8Array = new Uint8Array(buffer);

    return new Response(uint8Array, {
        headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename=ticket-${id}.pkpass`,
        },
    });
}