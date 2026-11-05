import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const OUTBOX_FILE = path.join(DATA_DIR, "outbox.json");

function ensureOutboxFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(OUTBOX_FILE)) {
    fs.writeFileSync(OUTBOX_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function recordOutboxEmail(entry) {
  try {
    ensureOutboxFile();
    const raw = fs.readFileSync(OUTBOX_FILE, "utf8");
    const records = JSON.parse(raw);
    records.unshift(entry);
    fs.writeFileSync(OUTBOX_FILE, JSON.stringify(records.slice(0, 100), null, 2), "utf8");
  } catch (err) {
    console.error("[MAILER ERROR] Failed to record to outbox.json:", err.message);
  }
}

/**
 * Service name formatter for clean email subject and body
 */
function formatServiceName(serviceCode) {
  const map = {
    web_vapt: "Web Application Penetration Testing (VAPT)",
    api_vapt: "API & Microservices Security Testing",
    mobile_vapt: "Mobile Application VAPT (iOS & Android)",
    cloud_infra: "Cloud Configuration Security (AWS/Azure/GCP)",
    red_team: "Adversarial Red Team Simulation",
    web_app_dev: "Web Application Development",
    website_dev: "High-Performance Website Development",
    mobile_app_dev: "Mobile Application Development",
    multiple_services: "Multiple Services (Development + Security)",
  };
  return map[serviceCode] || serviceCode || "General Scoping Inquiry";
}

/**
 * Generates an executive dark-mode HTML email template for contact@aegiswing.com
 */
function buildExecutiveEmailHtml(inquiry) {
  const contact = inquiry.contact || {};
  const assessment = inquiry.assessment || {};
  const serviceName = formatServiceName(assessment.service);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Inquiry: ${inquiry.reference}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0c0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0c0c0c; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 650px; background-color: #141414; border: 1px solid #262626; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 24px 30px; background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%); border-bottom: 1px solid #2a2a2a;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 10px; background: rgba(255, 51, 68, 0.15); border: 1px solid #ff3344; color: #ff5566; font-size: 11px; font-weight: 700; border-radius: 6px; letter-spacing: 0.08em; text-transform: uppercase;">
                      NEW SCOPING INQUIRY
                    </span>
                    <h1 style="margin: 10px 0 4px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                      ${contact.company_name || "New Client"}
                    </h1>
                    <div style="font-size: 13px; color: #a1a1aa; font-family: 'Courier New', monospace;">
                      Reference ID: <strong style="color: #00e599;">${inquiry.reference}</strong> · ${new Date(inquiry.created_at).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary Details Body -->
          <tr>
            <td style="padding: 28px 30px;">
              
              <!-- Section 1: Contact Dossier -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #0070f3; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-family: monospace;">
                  01. PROSPECT CONTACT DETAILS
                </div>
                <table role="presentation" width="100%" style="border-collapse: collapse; background-color: #1a1a1a; border-radius: 8px; border: 1px solid #282828;">
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px; width: 35%;">Full Name</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #fff; font-size: 13px; font-weight: 600;">${contact.full_name || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Business Email</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #70b4ff; font-size: 13px;">
                      <a href="mailto:${contact.business_email}" style="color: #70b4ff; text-decoration: underline;">${contact.business_email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Company Name</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #fff; font-size: 13px; font-weight: 600;">${contact.company_name || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Job Title</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #ededed; font-size: 13px;">${contact.job_title || "Technical / Scoping Lead"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Phone Number</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #ededed; font-size: 13px;">${contact.phone || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; color: #888; font-size: 12px;">Country / Region</td>
                    <td style="padding: 10px 14px; color: #ededed; font-size: 13px;">${contact.country || "IN"}</td>
                  </tr>
                </table>
              </div>

              <!-- Section 2: Technical Scoping Requirements -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #ff5566; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-family: monospace;">
                  02. TECHNICAL SCOPING REQUIREMENTS
                </div>
                <table role="presentation" width="100%" style="border-collapse: collapse; background-color: #1a1a1a; border-radius: 8px; border: 1px solid #282828;">
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px; width: 35%;">Requested Service</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #fff; font-size: 13px; font-weight: 700;">${serviceName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Target Environment</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #ededed; font-size: 13px; text-transform: capitalize;">${assessment.environment || "Production"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Testing Access Model</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #ededed; font-size: 13px; text-transform: capitalize;">${assessment.access_model || "Grey-box"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Expected Timeline</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #ededed; font-size: 13px;">${assessment.timeline || "Within 2-4 weeks"}</td>
                  </tr>
                  ${assessment.tech_stack?.length ? `
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #888; font-size: 12px;">Technology Stack</td>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #262626; color: #ededed; font-size: 12px;">${assessment.tech_stack.join(", ")}</td>
                  </tr>
                  ` : ""}
                  ${inquiry.nda_required ? `
                  <tr>
                    <td style="padding: 10px 14px; color: #888; font-size: 12px;">NDA Requirement</td>
                    <td style="padding: 10px 14px; color: #ededed; font-size: 13px;">${inquiry.nda_required}</td>
                  </tr>
                  ` : ""}
                </table>
              </div>

              <!-- Section 3: Objectives & Notes -->
              ${assessment.objectives ? `
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #00e599; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-family: monospace;">
                  03. SCOPING OBJECTIVES & DETAILS
                </div>
                <div style="background-color: #1a1a1a; border: 1px solid #282828; border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.6; color: #d4d4d8; white-space: pre-wrap;">${assessment.objectives}</div>
              </div>
              ` : ""}

              <!-- Section 4: Fast Action Links -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #262626;">
                <a href="${siteUrl}/admin" style="display: inline-block; background-color: #ffffff; color: #000000; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-right: 12px;">
                  Open in Ops Console →
                </a>
                <a href="mailto:${contact.business_email}?subject=${encodeURIComponent("Re: Security Scoping Inquiry [" + inquiry.reference + "] - Aegis Wing")}" style="display: inline-block; background-color: #222222; color: #ffffff; font-weight: 600; font-size: 13px; text-decoration: none; padding: 12px 20px; border-radius: 8px; border: 1px solid #333333;">
                  Reply to Client Directly ✉
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 30px; background-color: #0f0f0f; border-top: 1px solid #222222; text-align: center; font-size: 11px; color: #666666;">
              Aegis Wing Automated Dispatch Engine · Secure Telemetry · Chennai, India<br />
              Delivered directly to contact@aegiswing.com
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates plain-text fallback format
 */
function buildExecutiveEmailText(inquiry) {
  const contact = inquiry.contact || {};
  const assessment = inquiry.assessment || {};
  const serviceName = formatServiceName(assessment.service);

  return `
========================================================
[AEGIS WING] NEW ENTERPRISE SCOPING INQUIRY
========================================================

Reference ID:    ${inquiry.reference}
Timestamp:       ${inquiry.created_at}

1. PROSPECT CONTACT DETAILS:
--------------------------------------------------------
Full Name:       ${contact.full_name || "N/A"}
Business Email:  ${contact.business_email || "N/A"}
Company Name:    ${contact.company_name || "N/A"}
Job Title:       ${contact.job_title || "Technical / Scoping Lead"}
Phone Number:    ${contact.phone || "N/A"}
Country:         ${contact.country || "IN"}

2. TECHNICAL SCOPING REQUIREMENTS:
--------------------------------------------------------
Service:         ${serviceName}
Target Env:      ${assessment.environment || "Production"}
Access Model:    ${assessment.access_model || "Grey-box"}
Timeline:        ${assessment.timeline || "Within 2-4 weeks"}
Tech Stack:      ${assessment.tech_stack?.join(", ") || "N/A"}
NDA Required:    ${inquiry.nda_required || "N/A"}

3. OBJECTIVES & SCOPE DETAILS:
--------------------------------------------------------
${assessment.objectives || "No additional scope details provided."}

========================================================
To reply directly to the client, reply to this email.
Aegis Wing Automated Telemetry
  `.trim();
}

/**
 * Dispatches the inquiry email directly to contact@aegiswing.com
 * Supports Titan Mail via SMTP (smtp.titan.email) with safe fallback.
 */
export async function dispatchInquiryEmail(inquiry) {
  const contact = inquiry.contact || {};
  const assessment = inquiry.assessment || {};
  const serviceName = formatServiceName(assessment.service);
  const companyName = contact.company_name || "New Client";

  const host = process.env.TITAN_SMTP_HOST || process.env.SMTP_HOST || "smtp.titan.email";
  const port = Number(process.env.TITAN_SMTP_PORT || process.env.SMTP_PORT || 465);
  const secure = port === 465;
  const user = process.env.TITAN_SMTP_USER || process.env.SMTP_USER || "contact@aegiswing.com";
  const pass = process.env.TITAN_SMTP_PASSWORD || process.env.SMTP_PASS || "";
  const recipient = process.env.NOTIFY_EMAIL || "contact@aegiswing.com";

  const emailSubject = `[NEW SCOPE] ${serviceName} - ${companyName} (${inquiry.reference})`;
  const emailHtml = buildExecutiveEmailHtml(inquiry);
  const emailText = buildExecutiveEmailText(inquiry);

  // If no password configured yet, log safely to outbox.json and console (safe development mode)
  if (!pass) {
    const fallbackEntry = {
      reference: inquiry.reference,
      timestamp: new Date().toISOString(),
      recipient,
      subject: emailSubject,
      status: "LOGGED_LOCAL",
      note: "Titan SMTP password not yet set in environment. Set TITAN_SMTP_PASSWORD in .env.local to activate live SMTP delivery.",
      prospect: {
        name: contact.full_name,
        email: contact.business_email,
        company: contact.company_name,
      },
    };

    recordOutboxEmail(fallbackEntry);

    console.log("\n========================================================");
    console.log(`[MAILER NOTIFICATION - SIMULATED FOR ${recipient}]`);
    console.log(`Subject:    ${emailSubject}`);
    console.log(`To:         ${recipient}`);
    console.log(`Reply-To:   ${contact.business_email}`);
    console.log(`Client:     ${contact.full_name} <${contact.business_email}> (${contact.company_name})`);
    console.log(`Service:    ${serviceName}`);
    console.log(`Status:     Logged to data/outbox.json. Add TITAN_SMTP_PASSWORD in .env.local for live delivery.`);
    console.log("========================================================\n");

    return {
      success: true,
      delivered: false,
      mode: "SIMULATED",
      recipient,
      message: "Logged to outbox (Titan SMTP credentials pending in .env.local)",
    };
  }

  // Live SMTP delivery via Titan Mail
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const info = await transporter.sendMail({
      from: `"Aegis Wing Scoping" <${user}>`,
      to: recipient,
      replyTo: contact.business_email || user,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    const successEntry = {
      reference: inquiry.reference,
      timestamp: new Date().toISOString(),
      recipient,
      subject: emailSubject,
      status: "DELIVERED",
      messageId: info.messageId,
      prospect: {
        name: contact.full_name,
        email: contact.business_email,
        company: contact.company_name,
      },
    };

    recordOutboxEmail(successEntry);
    console.log(`[MAILER SUCCESS] Scoping inquiry ${inquiry.reference} delivered to ${recipient}. MessageId: ${info.messageId}`);

    return {
      success: true,
      delivered: true,
      mode: "LIVE_SMTP",
      recipient,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`[MAILER ERROR] Failed to send email to ${recipient}:`, error.message);

    const errorEntry = {
      reference: inquiry.reference,
      timestamp: new Date().toISOString(),
      recipient,
      subject: emailSubject,
      status: "FAILED",
      error: error.message,
      prospect: {
        name: contact.full_name,
        email: contact.business_email,
        company: contact.company_name,
      },
    };

    recordOutboxEmail(errorEntry);

    // Return non-fatal error status so the client submission still succeeds
    return {
      success: false,
      delivered: false,
      mode: "LIVE_SMTP_FAILED",
      recipient,
      error: error.message,
    };
  }
}
