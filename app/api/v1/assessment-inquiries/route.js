import { NextResponse } from "next/server";
import { validateInquiryPayload } from "../../../lib/validation";
import {
  generateReferenceId,
  checkRateLimit,
  checkDuplicate,
  saveInquiry,
  logInternalNotification,
} from "../../../lib/inquiry-store";
import { dispatchToCRM } from "../../../lib/crm";
import { dispatchInquiryEmail } from "../../../lib/mailer";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // 1. Check Content-Type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, message: "Invalid Content-Type. Expected application/json." },
        { status: 400 }
      );
    }

    // 2. Client IP & Rate Limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Rate limit exceeded. Please wait a few minutes before submitting again.",
        },
        { status: 429 }
      );
    }

    // 3. Body Size limit check (max 64KB)
    const rawBody = await request.text();
    if (rawBody.length > 65536) {
      return NextResponse.json(
        { success: false, message: "Payload too large. Maximum allowed size is 64KB." },
        { status: 413 }
      );
    }

    // 4. Parse JSON
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, message: "Malformed JSON payload." },
        { status: 400 }
      );
    }

    // 5. Honeypot & Validation
    const validation = validateInquiryPayload(body);
    if (validation.isSpam) {
      // Quiet rejection for bots without exposing details
      return NextResponse.json(
        { success: true, reference: "INQ-ACK", message: "Inquiry received." },
        { status: 200 }
      );
    }

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please correct the highlighted fields.",
          errors: validation.errors,
        },
        { status: 422 }
      );
    }

    // 6. Duplicate Submission Protection
    if (checkDuplicate(body.contact)) {
      return NextResponse.json(
        {
          success: true,
          reference: "INQ-PREVIOUSLY-RECORDED",
          message: "Your inquiry has already been received. Our team will contact you shortly.",
        },
        { status: 200 }
      );
    }

    // 7. Normalize & Generate Server Reference
    const reference = generateReferenceId();
    const inquiryRecord = {
      reference,
      created_at: new Date().toISOString(),
      client_ip_anonymized: ip.replace(/\.\d+$/, ".0"),
      contact: {
        full_name: body.contact.full_name.trim(),
        business_email: body.contact.business_email.trim().toLowerCase(),
        company_name: body.contact.company_name.trim(),
        job_title: body.contact.job_title.trim(),
        phone: body.contact.phone ? body.contact.phone.trim() : null,
        country: body.contact.country.trim().toUpperCase(),
      },
      assessment: {
        service: body.assessment.service,
        environment: body.assessment.environment,
        access_model: body.assessment.access_model,
        timeline: body.assessment.timeline,
        asset_count: body.assessment.asset_count ? body.assessment.asset_count.trim() : null,
        asset_breakdown: body.assessment.asset_breakdown || null,
        technology: body.assessment.technology ? body.assessment.technology.trim() : null,
        tech_stack: Array.isArray(body.assessment.tech_stack) ? body.assessment.tech_stack : [],
        authentication: body.assessment.authentication || null,
        objectives_selected: Array.isArray(body.assessment.objectives_selected)
          ? body.assessment.objectives_selected
          : [],
        objectives: body.assessment.objectives ? body.assessment.objectives.trim() : null,
        preferred_contact_method: body.assessment.preferred_contact_method || null,
      },
      additional_context: body.additional_context ? body.additional_context.trim() : null,
      preferred_meeting_window: body.preferred_meeting_window ? body.preferred_meeting_window.trim() : null,
      scheduling: body.scheduling || null,
      procurement_requirements: body.procurement_requirements ? body.procurement_requirements.trim() : null,
      nda_required: body.nda_required || null,
      nda_workflow: body.nda_workflow || null,
      privacy_acknowledgement: {
        accepted: true,
        policy_version: "2026-v1.0",
        timestamp: new Date().toISOString(),
      },
      marketing_opt_in: Boolean(body.marketing_opt_in),
      status: "NEW",
    };

    // 8. Persist Submission
    await saveInquiry(inquiryRecord);

    // 9. Internal Notification (Console Logging)
    logInternalNotification(inquiryRecord);

    // 10. Dispatch real-time executive notification to contact@aegiswing.com (Titan Mail)
    const emailResult = await dispatchInquiryEmail(inquiryRecord);
    inquiryRecord.email_delivery = emailResult;

    // 11. Forward to CRM asynchronously
    const crmResult = await dispatchToCRM(inquiryRecord);
    inquiryRecord.crm_sync = crmResult;

    // 12. Durable acceptance response
    return NextResponse.json(
      {
        success: true,
        reference,
        message: "Your inquiry has been received.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[AEGIS API ERROR] /api/v1/assessment-inquiries:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred while processing your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Method Not Allowed. Use POST to submit inquiries." },
    { status: 405 }
  );
}
