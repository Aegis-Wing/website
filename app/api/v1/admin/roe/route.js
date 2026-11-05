import { NextResponse } from "next/server";
import { getInquiryByReference } from "../../../../lib/inquiry-store";
import { recordAuditEvent } from "../../../../lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return new NextResponse("Reference parameter required", { status: 400 });
  }

  const inquiry = getInquiryByReference(reference);
  if (!inquiry) {
    return new NextResponse("Inquiry not found", { status: 404 });
  }

  recordAuditEvent({
    event_type: "ROE_GENERATED",
    reference,
    actor: "admin",
    details: { timestamp: new Date().toISOString() },
  });

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Rules of Engagement (RoE) - ${inquiry.reference} - Aegis Wing</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #05182b; padding: 40px; margin: 0; line-height: 1.6; }
    .header { border-bottom: 2px solid #05182b; padding-bottom: 20px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .ref-badge { font-family: monospace; font-size: 13px; font-weight: bold; background: #f2eee6; padding: 4px 10px; border: 1px solid #05182b; }
    h2 { font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 6px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.05em; color: #d90b0b; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 13px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f8f6f0; font-weight: 600; width: 30%; }
    .critical-notice { background: #fff5f5; border-left: 4px solid #d90b0b; padding: 14px; font-size: 12px; margin: 18px 0; }
    .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
    .sig-box { border-top: 1px solid #05182b; padding-top: 10px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #d90b0b; color: #fff; border: none; cursor: pointer; font-weight: bold;">
      Print / Save as PDF 🖨️
    </button>
  </div>

  <div class="header">
    <div>
      <div style="font-size: 11px; font-weight: bold; color: #d90b0b; letter-spacing: 0.1em; text-transform: uppercase;">Aegis Wing Offensive Security Operations</div>
      <h1 class="title">Rules of Engagement & Authorization Dossier</h1>
    </div>
    <div class="ref-badge">REF: ${inquiry.reference}</div>
  </div>

  <p><strong>ENGAGEMENT DATE:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

  <h2>1. Engagement Parties</h2>
  <table>
    <tr><th>Client Entity</th><td>${inquiry.contact?.company_name}</td></tr>
    <tr><th>Authorized Contact</th><td>${inquiry.contact?.full_name} (${inquiry.contact?.job_title})</td></tr>
    <tr><th>Official Contact Email</th><td>${inquiry.contact?.business_email}</td></tr>
    <tr><th>Country of Operation</th><td>${inquiry.contact?.country}</td></tr>
    <tr><th>Aegis Desk Contact</th><td>contact@aegiswing.com</td></tr>
    <tr><th>Assigned Assessor</th><td>${inquiry.assignee || "Aegis Wing Senior Assessment Lead"}</td></tr>
  </table>

  <h2>2. Scoped Assessment Parameters</h2>
  <table>
    <tr><th>Requested Service</th><td>${(inquiry.assessment?.service || "").replace("_", " ").toUpperCase()}</td></tr>
    <tr><th>Target Environment</th><td>${(inquiry.assessment?.environment || "").toUpperCase()}</td></tr>
    <tr><th>Access Model</th><td>${(inquiry.assessment?.access_model || "").replace("_", " ").toUpperCase()}</td></tr>
    <tr><th>Target Timeline</th><td>${inquiry.assessment?.timeline || "Standard enterprise window"}</td></tr>
    <tr><th>Tech Stack</th><td>${inquiry.assessment?.tech_stack?.join(", ") || "Standard web/cloud stack"}</td></tr>
    <tr><th>Target Objectives</th><td>${inquiry.assessment?.objectives_selected?.join("; ") || inquiry.assessment?.objectives || "Comprehensive security validation"}</td></tr>
  </table>

  <h2>3. Logistics & Testing Windows</h2>
  <table>
    <tr><th>Preferred Date</th><td>${inquiry.scheduling?.preferred_date || "Agreed upon execution"}</td></tr>
    <tr><th>Operating Timezone</th><td>${inquiry.scheduling?.timezone || "Asia/Kolkata (IST)"}</td></tr>
    <tr><th>Operational Window</th><td>${inquiry.scheduling?.preferred_slot || "Off-peak hours"}</td></tr>
  </table>

  <div class="critical-notice">
    <strong>OPERATIONAL SAFETY & BOUNDARY DIRECTIVE:</strong>
    Testing shall strictly target the verified systems within the agreed scope. No distributed denial-of-service (DDoS), ransomware, unauthorized physical access, or deliberate permanent data destruction is permitted. If critical vulnerabilities or severe data compromise indicators are detected, testing against that specific component is paused immediately and the client contact is notified.
  </div>

  <h2>4. Mutual Authorization & Signatures</h2>
  <p style="font-size: 12px; color: #555;">By signing below, the Client represents they are the authorized owner or have written authority over the targeted systems, and Aegis Wing agrees to adhere strictly to the rules of engagement.</p>

  <div class="signature-grid">
    <div class="sig-box">
      <p style="margin: 0; font-weight: bold;">For ${inquiry.contact?.company_name}</p>
      <p style="margin: 40px 0 0 0; font-size: 13px;">Name: ${inquiry.contact?.full_name}</p>
      <p style="margin: 6px 0 0 0; font-size: 13px;">Title: ${inquiry.contact?.job_title}</p>
      <p style="margin: 6px 0 0 0; font-size: 13px;">Date: ________________________</p>
    </div>
    <div class="sig-box">
      <p style="margin: 0; font-weight: bold;">For Aegis Wing Operations</p>
      <p style="margin: 40px 0 0 0; font-size: 13px;">Name: ${inquiry.assignee || "Authorized Lead Assessor"}</p>
      <p style="margin: 6px 0 0 0; font-size: 13px;">Title: Principal Assessor</p>
      <p style="margin: 6px 0 0 0; font-size: 13px;">Date: ________________________</p>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
