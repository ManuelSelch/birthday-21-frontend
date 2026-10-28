import cockpit from "@/lib/cockpit";
import { auth, privateJson, readAdminBody } from "@/features/admin-auth/server";
 
export async function POST(request: Request) {
    const denied = auth.authorize(request);
    if (denied) return denied;

    const body = await readAdminBody(request);
    const id = body?.id;

    if (typeof id !== "string" || !id.trim() || id.length > 128)
        return privateJson({ success: false, error: "no ticket id provided" }, 400);

    const guest = await cockpit.getItem("guests", id);

    if(!guest)
        return privateJson({ success: false, error: "ticket is invalid" });
    
    if(!guest.accepted)
        return privateJson({ success: false, warning: "guest has not accepted invitation" });

    if(guest.checked_in)
        return privateJson({ success: false, warning: "guest is already checked in" });

    await cockpit.saveItem("guests", {
        "_id": id,
        "checked_in": true
    })

    return privateJson({ success: true });
}