import { NextResponse } from "next/server";
import { getInquiryByReference, updateInquiry, ALLOWED_STATUSES } from "../../../../../lib/inquiry-store";
import { getAuditLogs } from "../../../../../lib/audit";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  try {
    const { reference } = await context.params;
    const inquiry = getInquiryByReference(reference);

    if (!inquiry) {
      return NextResponse.json({ success: false, message: "Inquiry not found." }, { status: 404 });
    }

    const auditTrail = getAuditLogs(reference, 20);

    return NextResponse.json({
      success: true,
      inquiry,
      auditTrail,
    });
  } catch (error) {
    console.error("[ADMIN INQUIRY GET ERROR]:", error.message);
    return NextResponse.json({ success: false, message: "Failed to fetch inquiry." }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    const { reference } = await context.params;
    const body = await request.json();
    const { status, assignee, internal_notes, actor = "admin" } = body;

    const existing = getInquiryByReference(reference);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Inquiry not found." }, { status: 404 });
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 422 }
      );
    }

    const updated = await updateInquiry(
      reference,
      { status, assignee, internal_notes },
      actor
    );

    return NextResponse.json({
      success: true,
      message: `Inquiry ${reference} updated successfully.`,
      inquiry: updated,
    });
  } catch (error) {
    console.error("[ADMIN INQUIRY PATCH ERROR]:", error.message);
    return NextResponse.json({ success: false, message: "Failed to update inquiry." }, { status: 500 });
  }
}
