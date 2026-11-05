import { NextResponse } from "next/server";
import { getAllInquiries, computePipelineAnalytics } from "../../../../lib/inquiry-store";
import { getAuditLogs } from "../../../../lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const serviceFilter = searchParams.get("service");

    let inquiries = getAllInquiries();

    if (statusFilter && statusFilter !== "ALL") {
      inquiries = inquiries.filter((i) => i.status === statusFilter);
    }

    if (serviceFilter && serviceFilter !== "ALL") {
      inquiries = inquiries.filter((i) => i.assessment?.service === serviceFilter);
    }

    const analytics = computePipelineAnalytics();
    const recentAuditLogs = getAuditLogs(null, 25);

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      analytics,
      inquiries,
      recentAuditLogs,
    });
  } catch (error) {
    console.error("[ADMIN API ERROR]:", error.message);
    return NextResponse.json({ success: false, message: "Could not retrieve inquiries." }, { status: 500 });
  }
}
