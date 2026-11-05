import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const AUDIT_FILE = path.join(DATA_DIR, "audit_log.json");

function ensureAuditFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export function recordAuditEvent({ event_type, reference, actor = "system", details = {}, ip = "127.0.0.1" }) {
  ensureAuditFile();

  const auditEntry = {
    id: `AUD-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    timestamp: new Date().toISOString(),
    event_type, // INQUIRY_CREATED | STATUS_CHANGED | ASSIGNEE_CHANGED | NOTE_ADDED | ROE_GENERATED | ADMIN_LOGIN
    reference: reference || null,
    actor,
    ip: ip ? ip.replace(/\.\d+$/, ".0") : "internal",
    details,
  };

  try {
    const raw = fs.readFileSync(AUDIT_FILE, "utf8");
    let logs = [];
    try {
      logs = JSON.parse(raw);
      if (!Array.isArray(logs)) logs = [];
    } catch {
      logs = [];
    }

    logs.unshift(auditEntry);

    // Keep last 1,000 audit records
    if (logs.length > 1000) {
      logs = logs.slice(0, 1000);
    }

    const tmpFile = `${AUDIT_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(logs, null, 2), "utf8");
    fs.renameSync(tmpFile, AUDIT_FILE);

    console.log(`[AUDIT LOG] ${auditEntry.timestamp} [${event_type}] Ref: ${reference || "N/A"} by ${actor}`);
    return auditEntry;
  } catch (err) {
    console.error("[AUDIT LOG ERROR]", err.message);
    return null;
  }
}

export function getAuditLogs(filterRef = null, limit = 50) {
  ensureAuditFile();
  try {
    const raw = fs.readFileSync(AUDIT_FILE, "utf8");
    const logs = JSON.parse(raw);
    if (!Array.isArray(logs)) return [];
    if (filterRef) {
      return logs.filter((l) => l.reference === filterRef).slice(0, limit);
    }
    return logs.slice(0, limit);
  } catch {
    return [];
  }
}
