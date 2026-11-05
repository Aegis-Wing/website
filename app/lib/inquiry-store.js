import fs from "fs";
import path from "path";
import crypto from "crypto";
import { recordAuditEvent } from "./audit";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

// In-memory sliding window rate-limiter: ip -> array of timestamps
const rateLimitMap = new Map();
// In-memory duplicate submission hash -> timestamp
const duplicateMap = new Map();

export const ALLOWED_STATUSES = ["NEW", "CONTACTED", "SCOPING", "ENGAGED", "CLOSED"];
export const TEAM_MEMBERS = [
  { id: "anandha_k", name: "Anandha K.", role: "Principal Penetration Tester" },
  { id: "vikram_s", name: "Vikram S.", role: "Red Team & Exploit Lead" },
  { id: "priya_m", name: "Priya M.", role: "Cloud Security Architect" },
  { id: "karthik_r", name: "Karthik R.", role: "Application Security Specialist" },
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export function generateReferenceId() {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `INQ-${year}-${randomPart}`;
}

export function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10; // 10 per 15 minutes per IP

  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export function checkDuplicate(contact) {
  const now = Date.now();
  const dedupWindowMs = 10 * 60 * 1000; // 10 minutes
  const key = `${contact.business_email?.toLowerCase() || ""}|${contact.company_name?.toLowerCase() || ""}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");

  const lastSeen = duplicateMap.get(hash);
  if (lastSeen && now - lastSeen < dedupWindowMs) {
    return true; // Duplicate detected
  }

  duplicateMap.set(hash, now);
  return false;
}

export function getAllInquiries() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, "utf8");
    const records = JSON.parse(raw);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function getInquiryByReference(reference) {
  const all = getAllInquiries();
  return all.find((item) => item.reference === reference) || null;
}

export async function saveInquiry(inquiryRecord) {
  ensureDataFile();

  const records = getAllInquiries();
  records.unshift(inquiryRecord);

  // Write atomically via tmp file
  const tmpFile = `${INQUIRIES_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(records, null, 2), "utf8");
  fs.renameSync(tmpFile, INQUIRIES_FILE);

  recordAuditEvent({
    event_type: "INQUIRY_CREATED",
    reference: inquiryRecord.reference,
    actor: "prospect",
    ip: inquiryRecord.client_ip_anonymized,
    details: {
      company: inquiryRecord.contact?.company_name,
      service: inquiryRecord.assessment?.service,
      environment: inquiryRecord.assessment?.environment,
    },
  });

  return inquiryRecord;
}

export async function updateInquiry(reference, updates, actor = "admin", ip = "internal") {
  ensureDataFile();
  const records = getAllInquiries();
  const index = records.findIndex((r) => r.reference === reference);
  if (index === -1) return null;

  const current = records[index];
  const auditDetails = {};

  if (updates.status && updates.status !== current.status) {
    auditDetails.status_transition = { from: current.status, to: updates.status };
    current.status = updates.status;
  }

  if (updates.assignee !== undefined && updates.assignee !== current.assignee) {
    auditDetails.assignee_change = { from: current.assignee || "Unassigned", to: updates.assignee };
    current.assignee = updates.assignee;
  }

  if (updates.internal_notes !== undefined) {
    if (!current.notes) current.notes = [];
    current.notes.push({
      timestamp: new Date().toISOString(),
      author: actor,
      text: updates.internal_notes,
    });
    auditDetails.note_added = true;
  }

  current.updated_at = new Date().toISOString();
  records[index] = current;

  const tmpFile = `${INQUIRIES_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(records, null, 2), "utf8");
  fs.renameSync(tmpFile, INQUIRIES_FILE);

  recordAuditEvent({
    event_type: "INQUIRY_UPDATED",
    reference,
    actor,
    ip,
    details: auditDetails,
  });

  return current;
}

export function computePipelineAnalytics() {
  const inquiries = getAllInquiries();
  const total = inquiries.length;

  const byStatus = {
    NEW: 0,
    CONTACTED: 0,
    SCOPING: 0,
    ENGAGED: 0,
    CLOSED: 0,
  };

  const byService = {};
  let ndaCount = 0;

  inquiries.forEach((inq) => {
    const s = inq.status || "NEW";
    byStatus[s] = (byStatus[s] || 0) + 1;

    const srv = inq.assessment?.service || "unspecified";
    byService[srv] = (byService[srv] || 0) + 1;

    if (inq.nda_required === "yes") {
      ndaCount += 1;
    }
  });

  const activePipeline = byStatus.NEW + byStatus.CONTACTED + byStatus.SCOPING;
  const conversionRate = total > 0 ? ((byStatus.ENGAGED / total) * 100).toFixed(1) : "0.0";

  return {
    total,
    activePipeline,
    conversionRate: `${conversionRate}%`,
    byStatus,
    byService,
    ndaRatio: total > 0 ? `${((ndaCount / total) * 100).toFixed(0)}%` : "0%",
  };
}

export function logInternalNotification(inquiry) {
  console.log("\n========================================================");
  console.log(`[AEGIS WING] NEW ENTERPRISE VA/PT INQUIRY ACCEPTED`);
  console.log(`Reference:    ${inquiry.reference}`);
  console.log(`Timestamp:    ${inquiry.created_at}`);
  console.log(`Company:      ${inquiry.contact?.company_name}`);
  console.log(`Contact:      ${inquiry.contact?.full_name} (${inquiry.contact?.job_title})`);
  console.log(`Email:        ${inquiry.contact?.business_email}`);
  console.log(`Country:      ${inquiry.contact?.country}`);
  console.log(`Service:      ${inquiry.assessment?.service}`);
  console.log(`Environment:  ${inquiry.assessment?.environment}`);
  console.log(`Access Model: ${inquiry.assessment?.access_model}`);
  console.log(`Timeline:     ${inquiry.assessment?.timeline}`);
  console.log(`Marketing:    ${inquiry.marketing_opt_in ? "Opted In" : "No"}`);
  console.log("========================================================\n");
}
