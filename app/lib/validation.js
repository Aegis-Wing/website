import { COUNTRIES } from "./countries";

export const SERVICE_OPTIONS = [
  { value: "web_app_dev", label: "Web Application Development", category: "Engineering" },
  { value: "website_dev", label: "Website Design & Development", category: "Engineering" },
  { value: "mobile_app_dev", label: "Mobile Application Development", category: "Engineering" },
  { value: "web_vapt", label: "Web Application VA/PT", category: "Security" },
  { value: "mobile_vapt", label: "Mobile Application VA/PT", category: "Security" },
  { value: "api_vapt", label: "API VA/PT", category: "Security" },
  { value: "cloud_infra", label: "Cloud & Infrastructure Security", category: "Security" },
  { value: "red_team", label: "Offensive Security & Red Teaming", category: "Security" },
  { value: "multiple_services", label: "Multiple Services (Development + Security)", category: "Combined" },
];

export const ENVIRONMENT_OPTIONS = [
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging / Pre-production" },
  { value: "development", label: "Development / Test" },
  { value: "new_build", label: "New Project (From Scratch)" },
  { value: "not_decided", label: "Not Yet Decided" },
];

export const ACCESS_MODEL_OPTIONS = [
  { value: "full_code_access", label: "Full Code & Repository Access (White-box / Dev)" },
  { value: "grey_box", label: "Credentials & Staging Access (Grey-box)" },
  { value: "black_box", label: "External / Unauthenticated Only (Black-box)" },
  { value: "need_guidance", label: "Need Architectural Guidance" },
];

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "within_2_4_weeks", label: "Within 2-4 weeks" },
  { value: "within_1_3_months", label: "Within 1-3 months" },
  { value: "planning", label: "Planning / Procurement stage" },
];

export const AUTHENTICATION_OPTIONS = [
  { value: "both", label: "Both (Authenticated & Public / Guest)" },
  { value: "authenticated", label: "Authenticated Members / Admins Only" },
  { value: "unauthenticated", label: "Public Only" },
];

export const NDA_OPTIONS = [
  { value: "yes", label: "Yes, required prior to technical discussion" },
  { value: "no", label: "Not required at this stage" },
  { value: "unsure", label: "Unsure / Need guidance" },
];

const VALID_COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-().]{7,25}$/;

export function validateInquiryPayload(data) {
  const errors = {};

  if (!data || typeof data !== "object") {
    return { isValid: false, errors: { _general: "Invalid submission data format." } };
  }

  // Honeypot check
  if (data.bot_field) {
    return { isValid: false, errors: { _general: "Spam detection triggered." }, isSpam: true };
  }

  const contact = data.contact || {};
  const assessment = data.assessment || {};
  const privacy = data.privacy_acknowledgement || {};

  // Auto-fill sensible defaults for quick scoping submissions so basic fields are enough
  if (!contact.job_title || !contact.job_title.trim()) {
    contact.job_title = "Technical / Scoping Lead";
  }
  if (!contact.country || !contact.country.trim()) {
    contact.country = "IN";
  }
  if (!assessment.service) {
    assessment.service = "web_vapt";
  }
  if (!assessment.environment) {
    assessment.environment = "production";
  }
  if (!assessment.access_model) {
    assessment.access_model = "grey_box";
  }
  if (!assessment.timeline) {
    assessment.timeline = "within_2_4_weeks";
  }

  // Section A: Contact Validation
  const fullName = (contact.full_name || "").trim();
  if (!fullName) {
    errors["contact.full_name"] = "Full name is required.";
  } else if (fullName.length < 2) {
    errors["contact.full_name"] = "Full name must be at least 2 characters.";
  } else if (fullName.length > 120) {
    errors["contact.full_name"] = "Full name cannot exceed 120 characters.";
  }

  const email = (contact.business_email || "").trim();
  if (!email) {
    errors["contact.business_email"] = "Business email is required.";
  } else if (email.length > 254) {
    errors["contact.business_email"] = "Email address cannot exceed 254 characters.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors["contact.business_email"] = "Please enter a valid email address (e.g. name@company.com).";
  }

  const company = (contact.company_name || "").trim();
  if (!company) {
    errors["contact.company_name"] = "Company name is required.";
  } else if (company.length < 2) {
    errors["contact.company_name"] = "Company name must be at least 2 characters.";
  } else if (company.length > 160) {
    errors["contact.company_name"] = "Company name cannot exceed 160 characters.";
  }

  const jobTitle = (contact.job_title || "").trim();
  if (jobTitle && jobTitle.length > 120) {
    errors["contact.job_title"] = "Job title cannot exceed 120 characters.";
  }

  const phone = (contact.phone || "").trim();
  if (phone && !PHONE_REGEX.test(phone)) {
    errors["contact.phone"] = "Please enter a valid international phone format (e.g. +91 98765 43210).";
  }

  const country = (contact.country || "").trim().toUpperCase();
  if (country && !VALID_COUNTRY_CODES.has(country)) {
    // If not matching country list, default to IN rather than failing
    contact.country = "IN";
  }

  // Section B: Assessment / Project Validation
  const validServices = new Set(SERVICE_OPTIONS.map((o) => o.value));
  // Backward compatibility with previous values if any
  validServices.add("web_application");
  validServices.add("mobile_application");
  validServices.add("api");
  validServices.add("infrastructure");
  validServices.add("cloud");
  validServices.add("thick_client");

  if (!assessment.service || !validServices.has(assessment.service)) {
    errors["assessment.service"] = "Please select a service.";
  }

  const validEnvironments = new Set(ENVIRONMENT_OPTIONS.map((o) => o.value));
  validEnvironments.add("production");
  validEnvironments.add("staging");
  validEnvironments.add("development");
  validEnvironments.add("not_decided");

  if (!assessment.environment || !validEnvironments.has(assessment.environment)) {
    errors["assessment.environment"] = "Please select a target environment / stage.";
  }

  const validAccessModels = new Set(ACCESS_MODEL_OPTIONS.map((o) => o.value));
  validAccessModels.add("black_box");
  validAccessModels.add("grey_box");
  validAccessModels.add("white_box");
  validAccessModels.add("need_guidance");

  if (!assessment.access_model || !validAccessModels.has(assessment.access_model)) {
    errors["assessment.access_model"] = "Please select an access or engagement model.";
  }

  const validTimelines = new Set(TIMELINE_OPTIONS.map((o) => o.value));
  if (!assessment.timeline || !validTimelines.has(assessment.timeline)) {
    errors["assessment.timeline"] = "Please select an expected timeline.";
  }

  if (assessment.asset_count && String(assessment.asset_count).length > 120) {
    errors["assessment.asset_count"] = "Asset/Scope description cannot exceed 120 characters.";
  }

  if (assessment.technology && String(assessment.technology).length > 250) {
    errors["assessment.technology"] = "Technology details cannot exceed 250 characters.";
  }

  if (assessment.objectives && String(assessment.objectives).length > 1500) {
    errors["assessment.objectives"] = "Project objectives cannot exceed 1,500 characters.";
  }

  // Section C: Additional Context Validation
  if (data.additional_context && String(data.additional_context).length > 3000) {
    errors["additional_context"] = "Additional context cannot exceed 3,000 characters.";
  }

  // Section 4: Privacy Acknowledgement
  if (!privacy.accepted) {
    errors["privacy_acknowledgement.accepted"] = "You must read and acknowledge the Privacy Policy to proceed.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
