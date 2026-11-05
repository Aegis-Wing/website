import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const NDAS_DIR = path.join(process.cwd(), "data", "ndas");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = new Set([".pdf", ".docx", ".doc"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

function ensureNdaDir() {
  if (!fs.existsSync(NDAS_DIR)) {
    fs.mkdirSync(NDAS_DIR, { recursive: true });
  }
}

export async function POST(request) {
  try {
    ensureNdaDir();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No document file was uploaded." },
        { status: 400 }
      );
    }

    // 1. Size Validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File exceeds 10MB limit. Please upload a smaller document." },
        { status: 413 }
      );
    }

    // 2. Extension & MIME Validation
    const originalName = file.name || "document.pdf";
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only PDF (.pdf) and Word (.docx) documents are accepted." },
        { status: 422 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid MIME type. Document must be a valid PDF or DOCX file." },
        { status: 422 }
      );
    }

    // 3. Generate secure storage identifier
    const fileId = `NDA-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const sanitizedOriginalName = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = path.join(NDAS_DIR, fileId);

    // 4. Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    console.log(`[NDA UPLOAD SUCCESS] Saved ${sanitizedOriginalName} as ${fileId} (${file.size} bytes)`);

    return NextResponse.json(
      {
        success: true,
        file_id: fileId,
        original_name: sanitizedOriginalName,
        size_bytes: file.size,
        message: "NDA document successfully uploaded and attached to inquiry.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[NDA UPLOAD ERROR]:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to upload document. Please try again." },
      { status: 500 }
    );
  }
}
