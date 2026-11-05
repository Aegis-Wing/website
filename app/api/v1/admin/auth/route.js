import { NextResponse } from "next/server";
import { recordAuditEvent } from "../../../../lib/audit";

const ADMIN_PASSCODE = process.env.ADMIN_ACCESS_KEY || "aegis-intel-2026";

export async function POST(request) {
  try {
    const { passcode, actor = "admin" } = await request.json();

    if (!passcode || passcode !== ADMIN_PASSCODE) {
      recordAuditEvent({
        event_type: "ADMIN_LOGIN_FAILED",
        actor,
        details: { reason: "Invalid passcode" },
      });
      return NextResponse.json(
        { success: false, message: "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    recordAuditEvent({
      event_type: "ADMIN_LOGIN_SUCCESS",
      actor,
      details: { timestamp: new Date().toISOString() },
    });

    const response = NextResponse.json({
      success: true,
      message: "Administrative session authenticated.",
      actor,
    });

    // Set secure cookie for session
    response.cookies.set("aegis_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, message: "Authentication failed." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Session terminated." });
  response.cookies.delete("aegis_admin_session");
  return response;
}
