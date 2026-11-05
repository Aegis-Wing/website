/**
 * CRM Integration Handler (Phase 2 - Qualification)
 * Supports environment-configured webhooks (HubSpot, Salesforce, Zoho, Slack, Zapier)
 */

export async function dispatchToCRM(inquiry) {
  const webhookUrl = process.env.CRM_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

  const leadPayload = {
    event: "enterprise_lead.created",
    timestamp: new Date().toISOString(),
    reference: inquiry.reference,
    prospect: {
      name: inquiry.contact?.full_name,
      email: inquiry.contact?.business_email,
      company: inquiry.contact?.company_name,
      title: inquiry.contact?.job_title,
      phone: inquiry.contact?.phone,
      country: inquiry.contact?.country,
    },
    qualification: {
      service: inquiry.assessment?.service,
      environment: inquiry.assessment?.environment,
      access_model: inquiry.assessment?.access_model,
      timeline: inquiry.assessment?.timeline,
      asset_breakdown: inquiry.assessment?.asset_breakdown || null,
      tech_stack: inquiry.assessment?.tech_stack || [],
      objectives: inquiry.assessment?.objectives_selected || [],
      custom_objectives: inquiry.assessment?.objectives || null,
    },
    nda_workflow: inquiry.nda_workflow || null,
    scheduling: inquiry.scheduling || null,
    additional_notes: inquiry.additional_context || null,
    marketing_consent: inquiry.marketing_opt_in,
  };

  if (!webhookUrl) {
    console.log("[CRM DISPATCH - SIMULATED]");
    console.log(`Lead Reference:   ${inquiry.reference}`);
    console.log(`Company / Lead:   ${inquiry.contact?.company_name} · ${inquiry.contact?.full_name}`);
    console.log(`Service / Target: ${inquiry.assessment?.service} [${inquiry.assessment?.environment}]`);
    if (inquiry.assessment?.tech_stack?.length) {
      console.log(`Tech Stack:       ${inquiry.assessment.tech_stack.join(", ")}`);
    }
    if (inquiry.scheduling?.preferred_date) {
      console.log(`Requested Call:   ${inquiry.scheduling.preferred_date} (${inquiry.scheduling.preferred_slot}) [${inquiry.scheduling.timezone}]`);
    }
    if (inquiry.nda_workflow?.type) {
      console.log(`NDA Preference:   ${inquiry.nda_workflow.type}`);
    }
    console.log("Status:           No CRM_WEBHOOK_URL configured in env; logged to console.");
    return { status: "LOGGED_LOCAL", note: "Environment variable CRM_WEBHOOK_URL not configured." };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Aegis-Source": "Aegis-Wing-Assessment-Portal",
      },
      body: JSON.stringify(leadPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[CRM DISPATCH WARNING] Webhook returned HTTP ${res.status}`);
      return { status: "DISPATCH_FAILED", code: res.status };
    }

    console.log(`[CRM DISPATCH SUCCESS] Lead ${inquiry.reference} forwarded to CRM webhook.`);
    return { status: "FORWARDED" };
  } catch (error) {
    console.error(`[CRM DISPATCH ERROR] Could not forward lead ${inquiry.reference}:`, error.message);
    return { status: "RETRY_QUEUED", error: error.message };
  }
}
