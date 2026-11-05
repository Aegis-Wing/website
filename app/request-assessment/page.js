"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SearchableCountrySelect from "../components/SearchableCountrySelect";
import {
  SERVICE_OPTIONS,
  ENVIRONMENT_OPTIONS,
  ACCESS_MODEL_OPTIONS,
  TIMELINE_OPTIONS,
  AUTHENTICATION_OPTIONS,
  NDA_OPTIONS,
  validateInquiryPayload,
} from "../lib/validation";
import {
  TECH_STACK_CATEGORIES,
  SERVICE_OBJECTIVE_TEMPLATES,
  SERVICE_ASSET_FIELDS,
  TIMEZONES,
  MEETING_SLOTS,
  CALL_DURATIONS,
} from "../lib/qualification-data";

function RequestAssessmentForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "web_vapt";
  const initialPrompt = searchParams.get("prompt") || "";

  const [formData, setFormData] = useState({
    contact: {
      full_name: "",
      business_email: "",
      company_name: "",
      job_title: "",
      phone: "",
      country: "IN",
    },
    assessment: {
      service: initialService,
      environment: "production",
      access_model: "grey_box",
      timeline: "within_2_4_weeks",
      asset_count: "",
      asset_breakdown: {},
      technology: "",
      tech_stack: ["Next.js", "React", "Node.js", "AWS", "PostgreSQL"],
      authentication: "both",
      objectives_selected: [],
      objectives: "",
      preferred_contact_method: "email",
    },
    additional_context: initialPrompt,
    preferred_meeting_window: "",
    scheduling: {
      preferred_date: "",
      timezone: "Asia/Kolkata",
      preferred_slot: "afternoon",
      call_duration: "30_min",
    },
    procurement_requirements: "",
    nda_required: "unsure",
    nda_workflow: {
      type: "none", // 'upload' | 'request_aegis_nda' | 'none'
      file_id: null,
      file_name: null,
      signatory_name: "",
      signatory_title: "",
      signatory_email: "",
    },
    privacy_acknowledgement: {
      accepted: false,
    },
    marketing_opt_in: false,
    bot_field: "", // honeypot
  });

  const [customTechInput, setCustomTechInput] = useState("");
  const [uploadingNDA, setUploadingNDA] = useState(false);
  const [ndaUploadError, setNdaUploadError] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Set min date to tomorrow
  const [minDateString, setMinDateString] = useState("");
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDateString(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
    if (errors[`contact.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`contact.${field}`];
        return next;
      });
    }
  };

  const handleAssessmentChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      assessment: { ...prev.assessment, [field]: value },
    }));
    if (errors[`assessment.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`assessment.${field}`];
        return next;
      });
    }
  };

  const handleAssetBreakdownChange = (fieldId, val) => {
    setFormData((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        asset_breakdown: {
          ...prev.assessment.asset_breakdown,
          [fieldId]: val,
        },
      },
    }));
  };

  const toggleTechTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.assessment.tech_stack.includes(tag);
      const newStack = exists
        ? prev.assessment.tech_stack.filter((t) => t !== tag)
        : [...prev.assessment.tech_stack, tag];
      return {
        ...prev,
        assessment: { ...prev.assessment, tech_stack: newStack },
      };
    });
  };

  const handleAddCustomTech = (e) => {
    e?.preventDefault();
    const tag = customTechInput.trim();
    if (!tag) return;
    if (!formData.assessment.tech_stack.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        assessment: {
          ...prev.assessment,
          tech_stack: [...prev.assessment.tech_stack, tag],
        },
      }));
    }
    setCustomTechInput("");
  };

  const toggleObjectiveTemplate = (template) => {
    setFormData((prev) => {
      const exists = prev.assessment.objectives_selected.includes(template);
      const newSelected = exists
        ? prev.assessment.objectives_selected.filter((item) => item !== template)
        : [...prev.assessment.objectives_selected, template];
      return {
        ...prev,
        assessment: { ...prev.assessment, objectives_selected: newSelected },
      };
    });
  };

  const handleNDAFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNdaUploadError("");
    setUploadingNDA(true);

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/v1/nda-upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload document");
      }

      setFormData((prev) => ({
        ...prev,
        nda_workflow: {
          ...prev.nda_workflow,
          type: "upload",
          file_id: data.file_id,
          file_name: data.original_name,
        },
      }));
    } catch (err) {
      setNdaUploadError(err.message || "Upload failed. Please ensure file is PDF/DOCX under 10MB.");
    } finally {
      setUploadingNDA(false);
    }
  };

  const removeAttachedNDA = () => {
    setFormData((prev) => ({
      ...prev,
      nda_workflow: {
        ...prev.nda_workflow,
        file_id: null,
        file_name: null,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Client-side validation
    const validation = validateInquiryPayload(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/v1/assessment-inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 422 && data.errors) {
          setErrors(data.errors);
          setServerError("Please correct the highlighted fields and resubmit.");
          window.scrollTo({ top: 120, behavior: "smooth" });
        } else {
          setServerError(
            data.message ||
              "We could not submit your inquiry at this time. Please try again shortly or contact us directly."
          );
        }
        return;
      }

      // Success
      setSubmissionSuccess({
        reference: data.reference,
        message: data.message,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError(
        "We could not submit your inquiry at this time. Please try again shortly or contact us using the details on our Contact page."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentAssetFields = SERVICE_ASSET_FIELDS[formData.assessment.service] || [];
  const currentObjectiveTemplates =
    SERVICE_OBJECTIVE_TEMPLATES[formData.assessment.service] || [];

  return (
    <main className="page-shell">
      {/* Site Header */}
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Aegis Wing home">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing Logo" />
          <span className="brand-name">AEGIS WING</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/">Platform</Link>
          <Link href="/#services">Services</Link>
          <Link href="/standards">Standards</Link>
          <Link href="/#canvas">Interactive Canvas</Link>
          <Link href="/request-assessment" style={{ color: "#ffffff", fontWeight: 600 }}>
            Scope Engagement
          </Link>
        </nav>
        <div className="header-actions">
          <a className="header-mail-link" href="mailto:contact@aegiswing.com">
            <span>✉</span> contact@aegiswing.com
          </a>
          <Link className="header-cta" href="/#contact">
            Direct Contact <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      <div className="assessment-shell">
        {submissionSuccess ? (
          <div className="success-screen" role="region" aria-live="polite">
            <span className="success-badge">CONFIRMATION · INQUIRY QUALIFIED</span>
            <h2>Engagement Scope Received</h2>
            <p>
              Thank you for contacting us. Your inquiry and qualification parameters have been accepted. Our engineering and security leads will review your scope and follow up promptly.
            </p>

            <div className="reference-card">
              <div className="reference-card-label">Server Reference ID</div>
              <div className="reference-card-value">{submissionSuccess.reference}</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}>
                Keep this reference for any correspondence regarding this inquiry.
              </div>
            </div>

            <div className="success-actions">
              <Link href="/" className="pill-primary-btn">
                Return to Overview <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                className="pill-secondary-btn"
                onClick={() => {
                  setSubmissionSuccess(null);
                  setFormData((prev) => ({
                    ...prev,
                    additional_context: "",
                    privacy_acknowledgement: { accepted: false },
                  }));
                }}
              >
                Submit another inquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot anti-spam field */}
            <div className="honeypot-field" aria-hidden="true">
              <label>
                Leave this field empty
                <input
                  name="bot_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.bot_field}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bot_field: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="assessment-intro">
              <span className="form-section-tag">PROJECT & ASSESSMENT SCOPING</span>
              <h1>
                Start a Project or <span>Request Scope.</span>
              </h1>
              <p className="lede">
                Initiate a scoped software engineering engagement (Web Applications, Websites, Mobile Apps) or offensive security assessment (VA/PT, Cloud, Red Team). All details submitted are strictly protected under confidentiality and least-privilege protocols.
              </p>
              <div className="assessment-disclaimer">
                <span>🛡️</span>
                <span>
                  Inquiry & qualification only. Offensive testing requires signed rules of engagement and verified scope before commencement.
                </span>
              </div>
            </div>

            {/* Error Summary Banner */}
            {(Object.keys(errors).length > 0 || serverError) && (
              <div className="form-error-summary" role="alert">
                <h3>
                  <span>⚠️</span>
                  {serverError || "Please correct the following errors before submitting:"}
                </h3>
                {Object.keys(errors).length > 0 && (
                  <ul>
                    {Object.entries(errors).map(([field, msg]) => (
                      <li key={field}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION A - CONTACT INFORMATION */}
            {/* ============================================================== */}
            <section className="form-section" aria-labelledby="section-a-title">
              <div className="form-section-header">
                <span className="form-section-tag">Section A · Identity &amp; Contact</span>
                <h2 className="form-section-title" id="section-a-title">
                  Contact Information
                </h2>
                <p className="form-section-desc">
                  Provide your business contact details so our assessment leads can communicate regarding scope and authorizations.
                </p>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="full_name">
                    <span>Full name</span>
                    <span className="form-label-required">* (required)</span>
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    className={`form-control ${errors["contact.full_name"] ? "has-error" : ""}`}
                    placeholder="e.g. Anandha Krishnan"
                    autoComplete="name"
                    value={formData.contact.full_name}
                    onChange={(e) => handleContactChange("full_name", e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errors["contact.full_name"])}
                    aria-describedby={errors["contact.full_name"] ? "full_name-error" : undefined}
                  />
                  {errors["contact.full_name"] && (
                    <span id="full_name-error" className="form-field-error" role="alert">
                      {errors["contact.full_name"]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="business_email">
                    <span>Business email</span>
                    <span className="form-label-required">* (required)</span>
                  </label>
                  <input
                    id="business_email"
                    type="email"
                    className={`form-control ${errors["contact.business_email"] ? "has-error" : ""}`}
                    placeholder="name@company.com"
                    autoComplete="email"
                    value={formData.contact.business_email}
                    onChange={(e) => handleContactChange("business_email", e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errors["contact.business_email"])}
                    aria-describedby={errors["contact.business_email"] ? "business_email-error" : undefined}
                  />
                  {errors["contact.business_email"] && (
                    <span id="business_email-error" className="form-field-error" role="alert">
                      {errors["contact.business_email"]}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="company_name">
                    <span>Company name</span>
                    <span className="form-label-required">* (required)</span>
                  </label>
                  <input
                    id="company_name"
                    type="text"
                    className={`form-control ${errors["contact.company_name"] ? "has-error" : ""}`}
                    placeholder="e.g. Acme Financial Technologies"
                    autoComplete="organization"
                    value={formData.contact.company_name}
                    onChange={(e) => handleContactChange("company_name", e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errors["contact.company_name"])}
                    aria-describedby={errors["contact.company_name"] ? "company_name-error" : undefined}
                  />
                  {errors["contact.company_name"] && (
                    <span id="company_name-error" className="form-field-error" role="alert">
                      {errors["contact.company_name"]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="job_title">
                    <span>Job title</span>
                    <span className="form-label-required">* (required)</span>
                  </label>
                  <input
                    id="job_title"
                    type="text"
                    className={`form-control ${errors["contact.job_title"] ? "has-error" : ""}`}
                    placeholder="e.g. VP Engineering / CISO / Security Lead"
                    autoComplete="organization-title"
                    value={formData.contact.job_title}
                    onChange={(e) => handleContactChange("job_title", e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errors["contact.job_title"])}
                    aria-describedby={errors["contact.job_title"] ? "job_title-error" : undefined}
                  />
                  {errors["contact.job_title"] && (
                    <span id="job_title-error" className="form-field-error" role="alert">
                      {errors["contact.job_title"]}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    <span>Phone number</span>
                    <span className="form-label-optional">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-control ${errors["contact.phone"] ? "has-error" : ""}`}
                    placeholder="e.g. +91 98765 43210"
                    autoComplete="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    aria-describedby={errors["contact.phone"] ? "phone-error" : undefined}
                  />
                  {errors["contact.phone"] && (
                    <span id="phone-error" className="form-field-error" role="alert">
                      {errors["contact.phone"]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="country">
                    <span>Country or region</span>
                    <span className="form-label-required">* (required)</span>
                  </label>
                  <SearchableCountrySelect
                    id="country"
                    value={formData.contact.country}
                    onChange={(code) => handleContactChange("country", code)}
                    error={Boolean(errors["contact.country"])}
                  />
                  {errors["contact.country"] && (
                    <span id="country-error" className="form-field-error" role="alert">
                      {errors["contact.country"]}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* SECTION B - ASSESSMENT REQUIREMENTS & ASSET BREAKDOWN */}
            {/* ============================================================== */}
            <section className="form-section" aria-labelledby="section-b-title">
              <div className="form-section-header">
                <span className="form-section-tag">Section B · Scoping &amp; Technical Architecture</span>
                <h2 className="form-section-title" id="section-b-title">
                  Assessment Requirements
                </h2>
                <p className="form-section-desc">
                  Select your service parameters, environment, and preliminary asset architecture.
                </p>
              </div>

              {/* Assessment Service */}
              <div className="form-group" style={{ marginBottom: "26px" }}>
                <label className="form-label">
                  <span>Assessment service</span>
                  <span className="form-label-required">* (required)</span>
                </label>
                <div className="radio-cards">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`radio-card ${
                        formData.assessment.service === opt.value ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="assessment_service"
                        value={opt.value}
                        checked={formData.assessment.service === opt.value}
                        onChange={() => handleAssessmentChange("service", opt.value)}
                      />
                      <div className="radio-card-title">
                        <span>{opt.label}</span>
                        <span className="radio-card-indicator" />
                      </div>
                    </label>
                  ))}
                </div>
                {errors["assessment.service"] && (
                  <span className="form-field-error" role="alert">
                    {errors["assessment.service"]}
                  </span>
                )}
              </div>

              {/* Structured Asset Breakdown based on active service (Phase 2 Qualification) */}
              <div className="asset-breakdown-box">
                <div className="asset-breakdown-box-header">
                  <span>Structured Asset Breakdown · {formData.assessment.service.replace("_", " ")}</span>
                  <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "none" }}>
                    No sensitive targets or live URLs needed
                  </span>
                </div>
                <div className="form-row-2">
                  {currentAssetFields.map((field) => (
                    <div className="form-group" key={field.id}>
                      <label className="form-label" htmlFor={`asset_${field.id}`}>
                        <span>{field.label}</span>
                        <span className="form-label-optional">(approximate)</span>
                      </label>
                      <input
                        id={`asset_${field.id}`}
                        type="text"
                        className="form-control"
                        placeholder={field.placeholder}
                        value={formData.assessment.asset_breakdown?.[field.id] || ""}
                        onChange={(e) => handleAssetBreakdownChange(field.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Environment */}
              <div className="form-group" style={{ marginBottom: "26px" }}>
                <label className="form-label">
                  <span>Target environment</span>
                  <span className="form-label-required">* (required)</span>
                </label>
                <div className="radio-cards">
                  {ENVIRONMENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`radio-card ${
                        formData.assessment.environment === opt.value ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="target_environment"
                        value={opt.value}
                        checked={formData.assessment.environment === opt.value}
                        onChange={() => handleAssessmentChange("environment", opt.value)}
                      />
                      <div className="radio-card-title">
                        <span>{opt.label}</span>
                        <span className="radio-card-indicator" />
                      </div>
                    </label>
                  ))}
                </div>
                {errors["assessment.environment"] && (
                  <span className="form-field-error" role="alert">
                    {errors["assessment.environment"]}
                  </span>
                )}

                {/* Production Notice */}
                {formData.assessment.environment === "production" && (
                  <div className="production-notice" role="note">
                    <span style={{ fontSize: "16px" }}>⚠️</span>
                    <div>
                      <strong>Production Safety Protocol</strong>
                      Production assessments require an agreed scope, written authorization, and rules of engagement. Testing will not begin until these requirements have been completed.
                    </div>
                  </div>
                )}
              </div>

              {/* Testing Access Model & Expected Timeline */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Testing access model</span>
                    <span className="form-label-required">* (required)</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.assessment.access_model}
                    onChange={(e) => handleAssessmentChange("access_model", e.target.value)}
                  >
                    {ACCESS_MODEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Expected timeline</span>
                    <span className="form-label-required">* (required)</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.assessment.timeline}
                    onChange={(e) => handleAssessmentChange("timeline", e.target.value)}
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Technology Stack Selector (Phase 2 Qualification) */}
              <div className="form-group" style={{ margin: "22px 0" }}>
                <label className="form-label">
                  <span>Application Technology & Infrastructure Stack</span>
                  <span className="form-label-optional">(Select all that apply)</span>
                </label>

                {TECH_STACK_CATEGORIES.map((cat) => (
                  <div key={cat.category} className="tech-category-group">
                    <span className="tech-category-label">{cat.category}</span>
                    <div className="tech-tag-cloud">
                      {cat.items.map((tech) => {
                        const isSelected = formData.assessment.tech_stack.includes(tech);
                        return (
                          <button
                            type="button"
                            key={tech}
                            className={`tech-tag-chip ${isSelected ? "active" : ""}`}
                            onClick={() => toggleTechTag(tech)}
                            aria-pressed={isSelected}
                          >
                            <span className="chip-icon">{isSelected ? "✓" : "+"}</span>
                            <span>{tech}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Custom Tech Tag Adder */}
                <div className="tech-custom-add-row">
                  <input
                    type="text"
                    className="tech-custom-input"
                    placeholder="Other technology / custom framework..."
                    value={customTechInput}
                    onChange={(e) => setCustomTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTech();
                      }
                    }}
                  />
                  <button type="button" className="tech-add-btn" onClick={handleAddCustomTech}>
                    Add Tech Tag
                  </button>
                </div>

                {/* Selected Stack Summary */}
                {formData.assessment.tech_stack.length > 0 && (
                  <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--muted)" }}>
                    Selected Technologies:{" "}
                    <strong style={{ color: "var(--navy)" }}>
                      {formData.assessment.tech_stack.join(", ")}
                    </strong>
                  </div>
                )}
              </div>

              {/* Objectives Templates (Phase 2 Qualification) */}
              <div className="form-group" style={{ margin: "24px 0" }}>
                <label className="form-label">
                  <span>Assessment Objectives Templates</span>
                  <span className="form-label-optional">(Select common drivers or add custom below)</span>
                </label>
                <div className="objectives-template-list">
                  {currentObjectiveTemplates.map((tmpl) => {
                    const isChecked = formData.assessment.objectives_selected.includes(tmpl);
                    return (
                      <label
                        key={tmpl}
                        className={`objective-template-item ${isChecked ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleObjectiveTemplate(tmpl)}
                        />
                        <span>{tmpl}</span>
                      </label>
                    );
                  })}
                </div>

                <label className="form-label" htmlFor="custom_objectives" style={{ marginTop: "12px" }}>
                  <span>Custom Objectives & Scoping Details</span>
                  <span className="form-label-optional">(optional)</span>
                </label>
                <textarea
                  id="custom_objectives"
                  rows={3}
                  className="form-control"
                  placeholder="Detail specific deliverables, tech architecture, critical endpoints, user journeys, or security scope..."
                  value={formData.assessment.objectives}
                  onChange={(e) => handleAssessmentChange("objectives", e.target.value)}
                />
              </div>

              {/* Authentication & Preferred Contact Method */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Authentication requirements</span>
                    <span className="form-label-optional">(optional)</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.assessment.authentication}
                    onChange={(e) => handleAssessmentChange("authentication", e.target.value)}
                  >
                    {AUTHENTICATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Preferred contact method</span>
                    <span className="form-label-optional">(optional)</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.assessment.preferred_contact_method}
                    onChange={(e) => handleAssessmentChange("preferred_contact_method", e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* SECTION C - ADDITIONAL CONTEXT, NDA & SCHEDULING */}
            {/* ============================================================== */}
            <section className="form-section" aria-labelledby="section-c-title">
              <div className="form-section-header">
                <span className="form-section-tag">Section C · NDA &amp; Scheduling</span>
                <h2 className="form-section-title" id="section-c-title">
                  Additional Context & Engagement Logistics
                </h2>
                <p className="form-section-desc">
                  Specify scheduling availability, non-disclosure requirements, and engagement constraints.
                </p>
              </div>

              {/* Mandatory Confidentiality Notice */}
              <div className="confidentiality-warning" role="note">
                <strong>Important Security & Confidentiality Notice</strong>
                Please do not include passwords, API keys, access tokens, production secrets, sensitive personal information, or detailed vulnerability evidence. We will arrange a suitable secure channel if further technical information is required.
              </div>

              {/* Additional Context Field */}
              <div className="form-group" style={{ marginBottom: "26px" }}>
                <label className="form-label" htmlFor="additional_context">
                  <span>Additional context</span>
                  <span className="form-label-optional">(optional, max 3,000 characters)</span>
                </label>
                <textarea
                  id="additional_context"
                  rows={4}
                  maxLength={3000}
                  className={`form-control ${errors["additional_context"] ? "has-error" : ""}`}
                  placeholder="Add any specific boundaries, constraints, or considerations for the assessment team..."
                  value={formData.additional_context}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, additional_context: e.target.value }))
                  }
                />
                <div className="char-count">
                  {formData.additional_context.length} / 3000 characters
                </div>
                {errors["additional_context"] && (
                  <span className="form-field-error" role="alert">
                    {errors["additional_context"]}
                  </span>
                )}
              </div>

              {/* NDA Workflow (Phase 2 Qualification) */}
              <div className="form-group" style={{ marginBottom: "30px" }}>
                <label className="form-label">
                  <span>Non-Disclosure Agreement (NDA) Requirement</span>
                </label>
                <select
                  className="form-control"
                  value={formData.nda_required}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      nda_required: val,
                      nda_workflow: {
                        ...prev.nda_workflow,
                        type: val === "yes" ? "upload" : "none",
                      },
                    }));
                  }}
                >
                  {NDA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {formData.nda_required === "yes" && (
                  <div style={{ marginTop: "16px" }}>
                    <div className="nda-workflow-selector">
                      <div
                        className={`nda-option-card ${
                          formData.nda_workflow.type === "upload" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            nda_workflow: { ...prev.nda_workflow, type: "upload" },
                          }))
                        }
                      >
                        <strong style={{ fontSize: "13px" }}>Upload Company NDA</strong>
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                          Upload your organization’s standard mutual NDA (.pdf or .docx)
                        </span>
                      </div>

                      <div
                        className={`nda-option-card ${
                          formData.nda_workflow.type === "request_aegis_nda" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            nda_workflow: { ...prev.nda_workflow, type: "request_aegis_nda" },
                          }))
                        }
                      >
                        <strong style={{ fontSize: "13px" }}>Request Aegis Wing Mutual NDA</strong>
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                          We will generate and issue an Aegis standard mutual NDA for signature
                        </span>
                      </div>
                    </div>

                    {formData.nda_workflow.type === "upload" && (
                      <div>
                        {formData.nda_workflow.file_name ? (
                          <div className="nda-file-attached">
                            <div className="nda-file-attached-info">
                              <span>📄</span>
                              <div>
                                <strong>{formData.nda_workflow.file_name}</strong>
                                <span>Attached successfully</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="nda-remove-btn"
                              onClick={removeAttachedNDA}
                            >
                              Remove ✕
                            </button>
                          </div>
                        ) : (
                          <div className="nda-dropzone">
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc"
                              onChange={handleNDAFileUpload}
                              disabled={uploadingNDA}
                            />
                            <div style={{ pointerEvents: "none" }}>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: "13px" }}>
                                {uploadingNDA ? "Uploading document…" : "Drop your NDA file here or click to browse"}
                              </p>
                              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--muted)" }}>
                                Supports PDF and DOCX up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                        {ndaUploadError && (
                          <span className="form-field-error" style={{ marginTop: "6px", display: "block" }}>
                            {ndaUploadError}
                          </span>
                        )}
                      </div>
                    )}

                    {formData.nda_workflow.type === "request_aegis_nda" && (
                      <div className="form-row-2" style={{ marginTop: "14px" }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="signatory_name">
                            <span>Authorized Signatory Full Name</span>
                          </label>
                          <input
                            id="signatory_name"
                            type="text"
                            className="form-control"
                            placeholder="e.g. Anandha Krishnan"
                            value={formData.nda_workflow.signatory_name || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                nda_workflow: {
                                  ...prev.nda_workflow,
                                  signatory_name: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="signatory_email">
                            <span>Signatory Email for DocuSign / E-Sign</span>
                          </label>
                          <input
                            id="signatory_email"
                            type="email"
                            className="form-control"
                            placeholder="signatory@company.com"
                            value={formData.nda_workflow.signatory_email || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                nda_workflow: {
                                  ...prev.nda_workflow,
                                  signatory_email: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Scheduling Preferences (Phase 2 Qualification) */}
              <div className="form-group">
                <label className="form-label">
                  <span>Scoping Call & Meeting Scheduling</span>
                  <span className="form-label-optional">(Optional - reserve preferred time)</span>
                </label>

                <div className="scheduling-container">
                  <div>
                    <label className="form-label" htmlFor="sched_date" style={{ marginBottom: "6px" }}>
                      <span>Preferred Date</span>
                    </label>
                    <input
                      id="sched_date"
                      type="date"
                      min={minDateString}
                      className="form-control"
                      value={formData.scheduling.preferred_date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          scheduling: {
                            ...prev.scheduling,
                            preferred_date: e.target.value,
                          },
                        }))
                      }
                    />

                    <label className="form-label" htmlFor="sched_tz" style={{ marginTop: "14px", marginBottom: "6px" }}>
                      <span>Timezone</span>
                    </label>
                    <select
                      id="sched_tz"
                      className="form-control"
                      value={formData.scheduling.timezone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          scheduling: {
                            ...prev.scheduling,
                            timezone: e.target.value,
                          },
                        }))
                      }
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>

                    <label className="form-label" style={{ marginTop: "14px", marginBottom: "6px" }}>
                      <span>Preferred Discussion Format</span>
                    </label>
                    <div className="duration-pills">
                      {CALL_DURATIONS.map((dur) => (
                        <div
                          key={dur.id}
                          className={`duration-pill ${
                            formData.scheduling.call_duration === dur.id ? "selected" : ""
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              scheduling: {
                                ...prev.scheduling,
                                call_duration: dur.id,
                              },
                            }))
                          }
                        >
                          <strong>{dur.label}</strong>
                          <small>{dur.desc}</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ marginBottom: "6px" }}>
                      <span>Preferred Time Window</span>
                    </label>
                    <div className="time-slot-pills">
                      {MEETING_SLOTS.map((slot) => (
                        <div
                          key={slot.id}
                          className={`time-slot-pill ${
                            formData.scheduling.preferred_slot === slot.id ? "selected" : ""
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              scheduling: {
                                ...prev.scheduling,
                                preferred_slot: slot.id,
                              },
                            }))
                          }
                        >
                          <strong>{slot.label}</strong>
                          <span>{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* SECTION 4 - PRIVACY ACKNOWLEDGEMENT & MARKETING */}
            {/* ============================================================== */}
            <div className="consent-block">
              <label className="consent-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.privacy_acknowledgement.accepted}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      privacy_acknowledgement: { accepted: checked },
                    }));
                    if (checked && errors["privacy_acknowledgement.accepted"]) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next["privacy_acknowledgement.accepted"];
                        return next;
                      });
                    }
                  }}
                  aria-required="true"
                />
                <span>
                  I have read the <Link href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link> and understand that my information will be processed to respond to my assessment inquiry. <strong style={{ color: "var(--red)" }}>*</strong>
                </span>
              </label>
              {errors["privacy_acknowledgement.accepted"] && (
                <span className="form-field-error" role="alert" style={{ marginLeft: "28px" }}>
                  {errors["privacy_acknowledgement.accepted"]}
                </span>
              )}

              <label className="consent-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.marketing_opt_in}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, marketing_opt_in: e.target.checked }))
                  }
                />
                <span>
                  I would like to receive security research, technical insights, and company updates by email.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="form-submit-row">
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <span>Processing Request…</span>
                    <span aria-hidden="true">⏳</span>
                  </>
                ) : (
                  <>
                    <span>Request an Assessment</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <div style={{ color: "var(--muted)", fontSize: "11px", font: "11px var(--mono)" }}>
                PROTECTED UNDER MUTUAL CONFIDENTIALITY PROTOCOLS
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="brand">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing Logo" />
          <span className="brand-name">AEGIS WING</span>
        </div>
        <span>High-Performance Engineering & Offensive Security · Chennai, India</span>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="mailto:contact@aegiswing.com" style={{ color: "#fff", fontWeight: 600, textDecoration: "underline" }}>
            contact@aegiswing.com
          </a>
          <Link href="/standards">Standards</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/">Back to top ↑</Link>
        </div>
      </footer>
    </main>
  );
}

export default function RequestAssessmentPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#080808",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--sans)",
          }}
        >
          Loading Scoping Portal…
        </div>
      }
    >
      <RequestAssessmentForm />
    </Suspense>
  );
}
