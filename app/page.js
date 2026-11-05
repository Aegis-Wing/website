"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CORE_FRAMEWORKS } from "./lib/standards-data";

const threatTargets = [
  {
    id: "web_vapt",
    title: "01. Web Application Penetration Testing",
    label: "Web Application VAPT",
    standards: "OWASP WSTG v4.2 · OWASP ASVS L2 · OWASP Top 10",
    vectors: "BOLA, IDOR, SSRF, Broken Auth, SQLi, Business Logic",
    accessModel: "Grey-box Credentials or Black-box External Perimeter",
    serviceCode: "web_vapt",
    summary:
      "Systematic penetration testing evaluating all authentication boundaries, business logic, session controls, and input handling.",
  },
  {
    id: "api_vapt",
    title: "02. API & Microservices",
    label: "API & Microservices Security",
    standards: "OWASP API Security Top 10:2023 · OWASP WSTG",
    vectors: "Broken Object Level Auth, Unrestricted Resource Consumption, Mass Assignment",
    accessModel: "REST, GraphQL, gRPC Schema & Token Access",
    serviceCode: "api_vapt",
    summary:
      "Deep-tier API security assessments probing object authorization, rate limiting, token forgery, and tenant boundary leakage.",
  },
  {
    id: "mobile_vapt",
    title: "03. Mobile App (iOS & Android)",
    label: "Mobile Application VAPT",
    standards: "OWASP MASVS v2.0 · OWASP MASTG · MASWE",
    vectors: "Insecure Local Storage, Cryptography Weaknesses, Reverse Engineering, IPC Flaws",
    accessModel: "IPA & APK Binary Testing, MitM Interception",
    serviceCode: "mobile_vapt",
    summary:
      "Static binary reverse engineering and dynamic run-time instrumentation to identify mobile privacy, keychain, and transport flaws.",
  },
  {
    id: "cloud_infra",
    title: "04. Cloud Configuration (AWS, Azure, GCP)",
    label: "Cloud Architecture & Tenant Hardening",
    standards: "CIS Benchmarks Level 1 and 2 · CSA Cloud Controls Matrix",
    vectors: "IAM Privilege Escalation, S3 Bucket ACLs, Insecure Security Groups, Metadata SSRF",
    accessModel: "Audited Read-Only Tenant IAM Role",
    serviceCode: "cloud_infra",
    summary:
      "Hardening cloud perimeter configurations, IAM least-privilege policies, secret management, and network exposure.",
  },
  {
    id: "red_team",
    title: "05. Red Team Simulation",
    label: "Adversarial Red Team Simulation",
    standards: "MITRE ATT&CK Framework · NIST SP 800-115",
    vectors: "External Perimeter Breach, EDR Bypass, Lateral Movement, Active Directory Pivot",
    accessModel: "Scenario-based Black-box with Signed Rules of Engagement",
    serviceCode: "red_team",
    summary:
      "Full-scope objective-driven adversarial simulation testing incident response detection and defensive perimeter resilience.",
  },
];

export default function Home() {
  const [navVisible, setNavVisible] = useState(true);
  const [entries, setEntries] = useState([]);
  const [reportState, setReportState] = useState("Loading CISA KEV catalog…");
  const [refreshing, setRefreshing] = useState(false);
  const [reportRequest, setReportRequest] = useState(0);
  const [formStatus, setFormStatus] = useState({ type: "", text: "", ref: "" });
  const [sending, setSending] = useState(false);
  const [query, setQuery] = useState("");
  const [copiedMail, setCopiedMail] = useState(false);

  // Offensive Security Target Configurator State
  const [selectedTarget, setSelectedTarget] = useState(threatTargets[0]);

  // Canvas and Telemetry Viewport State
  const [activeCanvasTab, setActiveCanvasTab] = useState("vapt_scanner");

  // Homepage Standards Matrix Filter
  const [standardsFilter, setStandardsFilter] = useState("ALL");

  // Quick Scoping Form State
  const [quickForm, setQuickForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "web_vapt",
    message: "",
    consent: false,
    bot_field: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submittedRef, setSubmittedRef] = useState(null);
  const [submittedDetails, setSubmittedDetails] = useState(null);

  const previousY = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 36 || y < previousY.current - 5) setNavVisible(true);
      else if (y > previousY.current + 5) setNavVisible(false);
      previousY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    const loadReports = async () => {
      setRefreshing(true);
      setReportState("Loading CISA KEV catalog…");
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json",
          { cache: "no-store" }
        );
        if (!response.ok) throw new Error("CISA catalog unavailable");
        const catalog = await response.json();
        if (!Array.isArray(catalog.vulnerabilities)) throw new Error("Format changed");
        const latest = catalog.vulnerabilities
          .filter((entry) => entry?.cveID && entry?.dateAdded)
          .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)))
          .slice(0, 10);
        if (alive) {
          setEntries(latest);
          setReportState(`CISA live feed · ${catalog.dateReleased || "current"}`);
        }
      } catch {
        if (alive) {
          setEntries([]);
          setReportState("CISA catalog temporarily unavailable via direct feed.");
        }
      } finally {
        if (alive) setRefreshing(false);
      }
    };
    loadReports();
    return () => {
      alive = false;
    };
  }, [reportRequest]);

  const filteredEntries = entries
    .filter((entry) =>
      [entry.cveID, entry.vendorProject, entry.product, entry.vulnerabilityName].some((val) =>
        String(val || "").toLowerCase().includes(query.trim().toLowerCase())
      )
    )
    .slice(0, 4);

  const copyEmail = () => {
    navigator.clipboard.writeText("contact@aegiswing.com");
    setCopiedMail(true);
    setTimeout(() => setCopiedMail(false), 2400);
  };

  const handleTargetChange = (target) => {
    setSelectedTarget(target);
    setQuickForm((prev) => ({ ...prev, service: target.serviceCode }));
  };

  const handleInputChange = (field, value) => {
    setQuickForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (formStatus.text) {
      setFormStatus({ type: "", text: "", ref: "" });
    }
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();

    // Client-side validation: these basic fields are enough to work!
    const errors = {};
    const trimmedName = (quickForm.name || "").trim();
    const trimmedEmail = (quickForm.email || "").trim();
    const trimmedCompany = (quickForm.company || "").trim();

    if (!trimmedName) {
      errors.name = "Full name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      errors.email = "Business email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@company.com).";
    }

    if (!trimmedCompany) {
      errors.company = "Company name is required.";
    }

    if (!quickForm.consent) {
      errors.consent = "Please acknowledge the Privacy Policy to proceed.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormStatus({
        type: "error",
        text: "Please correct the highlighted fields above.",
      });
      return;
    }

    setSending(true);
    setFormStatus({ type: "loading", text: "Recording security inquiry…" });

    const payload = {
      contact: {
        full_name: trimmedName,
        business_email: trimmedEmail.toLowerCase(),
        company_name: trimmedCompany,
        job_title: "Technical / Scoping Lead",
        country: "IN",
      },
      assessment: {
        service: quickForm.service,
        environment: "production",
        access_model: "grey_box",
        timeline: "within_2_4_weeks",
        objectives: (quickForm.message || "").trim(),
        tech_stack: ["Next.js", "React", "Node.js", "AWS", "PostgreSQL"],
      },
      privacy_acknowledgement: {
        accepted: quickForm.consent,
      },
      bot_field: quickForm.bot_field,
    };

    try {
      const res = await fetch("/api/v1/assessment-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.errors) {
          const serverErrors = {};
          if (data.errors["contact.full_name"]) serverErrors.name = data.errors["contact.full_name"];
          if (data.errors["contact.business_email"]) serverErrors.email = data.errors["contact.business_email"];
          if (data.errors["contact.company_name"]) serverErrors.company = data.errors["contact.company_name"];
          if (data.errors["privacy_acknowledgement.accepted"]) serverErrors.consent = data.errors["privacy_acknowledgement.accepted"];
          setFieldErrors(serverErrors);
        }
        throw new Error(data.message || "Failed to submit inquiry.");
      }

      setSubmittedRef(data.reference);
      setSubmittedDetails({
        name: trimmedName,
        email: trimmedEmail,
        company: trimmedCompany,
        service: quickForm.service,
      });
      setFormStatus({
        type: "success",
        text: `Inquiry registered successfully. Reference ID: ${data.reference}`,
        ref: data.reference,
      });
    } catch (err) {
      setFormStatus({
        type: "error",
        text: err.message || "Failed to submit. Please reach out to contact@aegiswing.com directly.",
      });
    } finally {
      setSending(false);
    }
  };

  const displayedFrameworks = CORE_FRAMEWORKS.filter((fw) => {
    if (standardsFilter === "OFFENSIVE") return fw.category.includes("Offensive");
    if (standardsFilter === "DEVELOPMENT") return fw.category.includes("Development");
    if (standardsFilter === "CLOUD") return fw.category.includes("Infrastructure") || fw.category.includes("Governance");
    return true;
  }).slice(0, 8);

  return (
    <main className="page-shell">
      {/* Sticky Framer Navbar with Zero Alignment Overflow */}
      <motion.header
        className="site-header"
        initial={false}
        animate={{ y: navVisible ? 0 : -80 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link className="brand" href="/" aria-label="Aegis Wing home">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing Logo" />
          <span className="brand-name">AEGIS WING</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#vapt" style={{ color: "#ffffff", fontWeight: 600 }}>
            Offensive Security
          </a>
          <a href="#standards-matrix">Standards</a>
          <a href="#capabilities">Engineering</a>
          <a href="#reports">CISA KEV</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-mail-link"
            onClick={copyEmail}
            title="Click to copy email address"
          >
            <span>✉</span>
            <span>{copiedMail ? "Copied!" : "contact@aegiswing.com"}</span>
          </button>
          <Link className="header-cta" href="/request-assessment?service=web_vapt">
            Request Scope →
          </Link>
        </div>
      </motion.header>

      {/* =====================================================================
          HERO SECTION (OFFENSIVE SECURITY PRIORITY + MOVING CYBER BEAMS)
          ===================================================================== */}
      <motion.section
        className="hero"
        id="top"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Innovative Cyber Lines & Radar Scan Animations */}
        <div className="cyber-lines-overlay" aria-hidden="true">
          <div className="cyber-grid-mesh" />
          <div className="moving-laser-h track-1" />
          <div className="moving-laser-h track-2" />
          <div className="moving-laser-v track-v1" />
          <div className="moving-laser-v track-v2" />
          <div className="radar-sweep-bar" />
        </div>

        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-pill-badge" style={{ borderColor: "rgba(255, 51, 68, 0.3)" }}>
          <span className="hero-pill-dot" style={{ background: "#ff3344", boxShadow: "0 0 10px #ff3344" }} />
          <span>OFFENSIVE SECURITY & THREAT MITIGATION · CHENNAI, INDIA</span>
        </div>

        <h1 className="hero-title">
          <span>Offensive Security &amp;</span>
          <br />
          <span className="accent-red">Penetration Testing.</span>
        </h1>

        <p className="hero-subtitle">
          We uncover and neutralize critical vulnerabilities before adversaries exploit them. Authorized adversary simulations, Web, Mobile, API, and Cloud infrastructure penetration testing - informed by OWASP, NIST, and CIS standards and backed by full-stack engineering.
        </p>

        <div className="hero-cta-group">
          <Link
            className="pill-primary-btn"
            href="/request-assessment?service=web_vapt"
            style={{ padding: "14px 30px", fontSize: "14px" }}
          >
            Book an Assessment →
          </Link>
          <a
            className="pill-secondary-btn"
            href="#standards-matrix"
            style={{ padding: "14px 26px", fontSize: "14px" }}
          >
            Explore Standards & Frameworks ↓
          </a>
        </div>

        {/* ===================================================================
            STRAIGHTFORWARD OFFENSIVE SECURITY TARGET CONFIGURATOR
            (REPLACING THE AI PROMPT BAR FLUFF)
            =================================================================== */}
        <div className="threat-config-wrapper" id="vapt">
          <div className="threat-config-card border-beam-box">
            <div className="threat-config-header">
              <span className="threat-config-title">
                <span>⚡</span> ACTIVE ATTACK SURFACE CONFIGURATOR
              </span>
              <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
                SELECT TARGET ESTATE TO INSPECT METHODOLOGY
              </span>
            </div>

            {/* Target Selectors */}
            <div className="threat-selector-chips">
              {threatTargets.map((target) => (
                <button
                  type="button"
                  key={target.id}
                  className={`threat-chip-btn ${selectedTarget.id === target.id ? "active" : ""}`}
                  onClick={() => handleTargetChange(target)}
                >
                  <span>{target.title}</span>
                </button>
              ))}
            </div>

            {/* Live Technical Parameters Display */}
            <div className="threat-details-grid">
              <div className="threat-detail-col">
                <span className="threat-detail-label">STANDARDS & GUIDANCE</span>
                <span className="threat-detail-val" style={{ color: "#70b4ff" }}>
                  {selectedTarget.standards}
                </span>
                <span className="threat-detail-sub">Rigorous procedural testing criteria</span>
              </div>

              <div className="threat-detail-col">
                <span className="threat-detail-label">SIMULATED ATTACK VECTORS</span>
                <span className="threat-detail-val" style={{ color: "#ff8892" }}>
                  {selectedTarget.vectors}
                </span>
                <span className="threat-detail-sub">Real-world adversary exploitation</span>
              </div>

              <div className="threat-detail-col">
                <span className="threat-detail-label">AUTHORIZATION & ACCESS MODEL</span>
                <span className="threat-detail-val" style={{ color: "#ffffff" }}>
                  {selectedTarget.accessModel}
                </span>
                <span className="threat-detail-sub">Signed Rules of Engagement (RoE)</span>
              </div>
            </div>

            <div className="threat-config-footer">
              <p style={{ margin: 0, fontSize: "13px", color: "#a1a1aa", textAlign: "left", maxWidth: "620px" }}>
                {selectedTarget.summary}
              </p>
              <Link
                href={`/request-assessment?service=${selectedTarget.serviceCode}`}
                className="pill-primary-btn"
                style={{ padding: "10px 20px", fontSize: "12px", background: "#ff3344", color: "#ffffff", borderColor: "#ff3344" }}
              >
                Scope This Engagement →
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================================
            INTERACTIVE SECURITY TELEMETRY CANVAS & STANDARDS INSPECTOR
            =================================================================== */}
        <div className="canvas-preview-wrapper">
          <div className="canvas-preview-card">
            <div className="canvas-toolbar">
              <div className="canvas-window-dots">
                <span className="canvas-dot red" />
                <span className="canvas-dot yellow" />
                <span className="canvas-dot green" />
              </div>

              <div className="canvas-tabs">
                <button
                  type="button"
                  className={`canvas-tab-btn ${activeCanvasTab === "vapt_scanner" ? "active" : ""}`}
                  onClick={() => setActiveCanvasTab("vapt_scanner")}
                >
                  VAPT &amp; Threat Telemetry
                </button>
                <button
                  type="button"
                  className={`canvas-tab-btn ${activeCanvasTab === "standards_compliance" ? "active" : ""}`}
                  onClick={() => setActiveCanvasTab("standards_compliance")}
                >
                  Standards Compliance Inspector
                </button>
                <button
                  type="button"
                  className={`canvas-tab-btn ${activeCanvasTab === "code" ? "active" : ""}`}
                  onClick={() => setActiveCanvasTab("code")}
                >
                  Hardened Code &amp; Architecture
                </button>
              </div>

              <div className="canvas-toolbar-actions">
                <span className="canvas-status-tag" style={{ color: "#ff5566", background: "rgba(255, 51, 68, 0.12)" }}>
                  ● OFFENSIVE OPS ACTIVE
                </span>
              </div>
            </div>

            <div className="canvas-main-viewport">
              {activeCanvasTab === "vapt_scanner" && (
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", minHeight: "380px", textAlign: "left" }}>
                  <div style={{ background: "#141414", border: "1px solid var(--border-strong)", borderRadius: "14px", padding: "24px" }}>
                    <div style={{ font: "700 12px var(--mono)", color: "var(--accent-red)", marginBottom: "14px" }}>
                      OFFENSIVE ATTACK SURFACE TELEMETRY · RECENT RUN
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                      <div style={{ padding: "12px 14px", background: "#181818", borderLeft: "3px solid #00e599", borderRadius: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>OWASP WSTG-ATHN-02: Authentication Bypass</strong>
                          <span style={{ font: "10px var(--mono)", color: "#00e599" }}>PASSED</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Rigorous session replay, brute-force limits, and 2FA token boundaries verified.
                        </div>
                      </div>

                      <div style={{ padding: "12px 14px", background: "#181818", borderLeft: "3px solid #00e599", borderRadius: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>OWASP API1:2023 Broken Object Level Auth (BOLA)</strong>
                          <span style={{ font: "10px var(--mono)", color: "#00e599" }}>PASSED</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Multi-tenant tenant_id isolation enforced across all JSON-RPC &amp; REST routes.
                        </div>
                      </div>

                      <div style={{ padding: "12px 14px", background: "#181818", borderLeft: "3px solid var(--accent-red)", borderRadius: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>CIS Benchmark 2.1.5: S3 Bucket Public Access</strong>
                          <span style={{ font: "10px var(--mono)", color: "var(--accent-red)" }}>REMEDIATED</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--accent-red)", marginTop: "2px" }}>
                          Overly permissive IAM policy detected and restricted via least-privilege ACL.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#141414", border: "1px solid var(--border-strong)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ font: "700 12px var(--mono)", color: "#0070f3", marginBottom: "14px" }}>
                        SECURITY POSTURE VERIFICATION
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ background: "#181818", padding: "14px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "10px", font: "10px var(--mono)", color: "var(--text-muted)" }}>TESTED ENDPOINTS</span>
                          <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>52 / 52</div>
                        </div>
                        <div style={{ background: "#181818", padding: "14px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "10px", font: "10px var(--mono)", color: "var(--text-muted)" }}>POSTURE GRADE</span>
                          <div style={{ fontSize: "24px", fontWeight: 800, color: "#00e599", marginTop: "4px" }}>GRADE A+</div>
                        </div>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                        All testing conducted under explicit authorization with comprehensive CWE classification and CVSS vector scoring.
                      </p>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <Link
                        href="/request-assessment?service=web_vapt"
                        className="pill-primary-btn"
                        style={{ width: "100%", justifyContent: "center", padding: "12px 18px" }}
                      >
                        Request Penetration Testing Scope →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeCanvasTab === "standards_compliance" && (
                <div style={{ background: "#111111", border: "1px solid var(--border-strong)", borderRadius: "14px", padding: "24px", textAlign: "left", minHeight: "380px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <div style={{ font: "700 13px var(--mono)", color: "#0070f3" }}>
                      ACTIVE STANDARDS CHECKLIST &amp; VERIFICATION MATRIX
                    </div>
                    <Link href="/standards" style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "#fff", textDecoration: "underline" }}>
                      View Full Standards Page ↗
                    </Link>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                    <div style={{ background: "#161616", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                      <span style={{ font: "700 12px var(--mono)", color: "#ff5566" }}>OWASP WSTG v4.2</span>
                      <h4 style={{ margin: "4px 0 6px", fontSize: "14px", color: "#fff" }}>Web Security Testing Guide</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Comprehensive testing for web applications, logic flaws, and input handling.</p>
                    </div>
                    <div style={{ background: "#161616", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                      <span style={{ font: "700 12px var(--mono)", color: "#00e599" }}>OWASP ASVS L2</span>
                      <h4 style={{ margin: "4px 0 6px", fontSize: "14px", color: "#fff" }}>Application Security Verification</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Rigorous technical application security controls for high-assurance services.</p>
                    </div>
                    <div style={{ background: "#161616", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                      <span style={{ font: "700 12px var(--mono)", color: "#70b4ff" }}>CIS BENCHMARKS</span>
                      <h4 style={{ margin: "4px 0 6px", fontSize: "14px", color: "#fff" }}>Cloud &amp; Platform Hardening</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Configuration baselines for AWS, Azure, GCP, and Kubernetes clusters.</p>
                    </div>
                    <div style={{ background: "#161616", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                      <span style={{ font: "700 12px var(--mono)", color: "#d2a8ff" }}>NIST SP 800-218</span>
                      <h4 style={{ margin: "4px 0 6px", fontSize: "14px", color: "#fff" }}>Secure Software Development</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Integrating secure architecture and supply chain defense throughout the SDLC.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeCanvasTab === "code" && (
                <div style={{ background: "#111", border: "1px solid var(--border-strong)", borderRadius: "14px", padding: "24px", textAlign: "left", font: "12px/1.7 var(--mono)", color: "#949494", minHeight: "380px", overflowY: "auto" }}>
                  <div style={{ color: "#555" }}>/* Aegis Wing Hardened Architecture &amp; Zero-Trust Authorization Model */</div>
                  <div><span style={{ color: "#ff7b72" }}>export default async function</span> <span style={{ color: "#d2a8ff" }}>EnterpriseHandler</span>(req, res) &#123;</div>
                  <div style={{ paddingLeft: "20px" }}>
                    <span style={{ color: "#79c0ff" }}>const</span> authContext = <span style={{ color: "#ff7b72" }}>await</span> <span style={{ color: "#d2a8ff" }}>verifyCryptographicToken</span>(req.headers.authorization);
                  </div>
                  <div style={{ paddingLeft: "20px" }}>
                    <span style={{ color: "#ff7b72" }}>if</span> (!authContext.isValid || authContext.scope !== <span style={{ color: "#a5d6ff" }}>"tenant:write"</span>) &#123;
                  </div>
                  <div style={{ paddingLeft: "40px" }}>
                    <span style={{ color: "#ff7b72" }}>throw new</span> <span style={{ color: "#d2a8ff" }}>BoundaryEnforcementError</span>(<span style={{ color: "#a5d6ff" }}>"OWASP-ASVS-AUTHN-VIOLATION"</span>);
                  </div>
                  <div style={{ paddingLeft: "20px" }}>&#125;</div>
                  <div style={{ paddingLeft: "20px" }}>
                    <span style={{ color: "#79c0ff" }}>const</span> safeData = <span style={{ color: "#ff7b72" }}>await</span> db.query(<span style={{ color: "#a5d6ff" }}>"SELECT id, hash, status FROM accounts WHERE tenant_id = $1"</span>, [authContext.tenantId]);
                  </div>
                  <div style={{ paddingLeft: "20px" }}>
                    <span style={{ color: "#ff7b72" }}>return</span> res.json(&#123; status: <span style={{ color: "#7ee787" }}>200</span>, payload: safeData &#125;);
                  </div>
                  <div>&#125;</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* =====================================================================
          SECTION: RECOGNIZED STANDARDS & METHODOLOGIES (ON APPLICATION INTERFACE)
          ===================================================================== */}
      <motion.section
        className="standards-section"
        id="standards-matrix"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        viewport={{ once: false, amount: 0.15, margin: "-40px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="standards-section-header">
          <span className="form-section-tag">GLOBAL FRAMEWORKS DIRECTORY</span>
          <h2 className="section-title">Standards &amp; Methodologies</h2>
          <p className="section-desc">
            Our offensive assessments and engineering services are strictly informed by recognized global security standards. We select the appropriate methodology based on the client&apos;s risk profile and environment.
          </p>
        </div>

        {/* Filter Toolbar on Home Interface */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className={`framework-filter-btn ${standardsFilter === "ALL" ? "active" : ""}`}
              onClick={() => setStandardsFilter("ALL")}
            >
              All Frameworks
            </button>
            <button
              type="button"
              className={`framework-filter-btn ${standardsFilter === "OFFENSIVE" ? "active" : ""}`}
              onClick={() => setStandardsFilter("OFFENSIVE")}
            >
              Offensive Testing (OWASP/NIST)
            </button>
            <button
              type="button"
              className={`framework-filter-btn ${standardsFilter === "DEVELOPMENT" ? "active" : ""}`}
              onClick={() => setStandardsFilter("DEVELOPMENT")}
            >
              Secure Engineering (ASVS/SSDF)
            </button>
            <button
              type="button"
              className={`framework-filter-btn ${standardsFilter === "CLOUD" ? "active" : ""}`}
              onClick={() => setStandardsFilter("CLOUD")}
            >
              Cloud Hardening (CIS/CSA)
            </button>
          </div>

          <Link href="/standards" className="bento-link" style={{ color: "#0070f3" }}>
            View Complete Standards Dossier (15 Standards) →
          </Link>
        </div>

        {/* Framework Cards Grid */}
        <div className="frameworks-grid">
          {displayedFrameworks.map((fw) => (
            <div key={fw.id} className="framework-card" style={{ padding: "24px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span className="framework-abbr-badge">{fw.abbreviation}</span>
                  <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "#71717a" }}>{fw.category}</span>
                </div>
                <h3 className="framework-card-title" style={{ fontSize: "17px", margin: "0 0 6px" }}>{fw.name}</h3>
                <p style={{ fontSize: "13px", color: "#a1a1aa", lineHeight: 1.5, margin: "0 0 16px" }}>{fw.purpose}</p>
              </div>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#666", fontFamily: "var(--mono)" }}>{fw.versionNote}</span>
                <a
                  href={fw.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="framework-official-link"
                  style={{ marginTop: 0 }}
                >
                  <span>Spec</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* =====================================================================
          SECTION: CORE SERVICE CAPABILITIES (OFFENSIVE SECURITY LEADING)
          ===================================================================== */}
      <motion.section
        className="feature-grid-section"
        id="capabilities"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        viewport={{ once: false, amount: 0.15, margin: "-40px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="section-header-centered">
          <span className="section-pill-tag">Core Disciplines</span>
          <h2 className="section-title">Offensive Security &amp; Full-Stack Engineering</h2>
          <p className="section-desc">
            We operate across two coordinated disciplines: hunting vulnerabilities through ruthless adversary simulation, and engineering hardened digital applications built to endure.
          </p>
        </div>

        <div className="bento-grid">
          {/* Bento Card 1: VAPT & Offensive Security (PRIORITIZED #1) */}
          <div className="bento-card border-beam-box">
            <div>
              <div className="bento-visual-preview" style={{ background: "rgba(255, 51, 68, 0.05)", borderColor: "rgba(255, 51, 68, 0.2)" }}>
                <div style={{ font: "700 12px var(--mono)", color: "var(--accent-red)", marginBottom: "8px" }}>
                  01 · OFFENSIVE SECURITY &amp; VAPT
                </div>
                <div style={{ fontSize: "18px", color: "#fff", fontWeight: 700, margin: "0 0 6px" }}>
                  Web · Mobile · API · Cloud · Red Teaming
                </div>
                <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
                  Informed by OWASP WSTG, ASVS, MASTG, and CIS Benchmarks under strict Rules of Engagement.
                </div>
              </div>
              <h3 className="bento-card-title">VAPT &amp; Penetration Testing</h3>
              <p className="bento-card-desc">
                Authorized black-box and grey-box security testing. We simulate real-world attack techniques to discover business logic flaws, privilege escalations, and sensitive data leakage before malicious actors strike.
              </p>
            </div>
            <Link className="bento-link" href="/request-assessment?service=web_vapt" style={{ color: "#ff5566" }}>
              Scope Offensive Assessment →
            </Link>
          </div>

          {/* Bento Card 2: Full-Stack Web Application Development */}
          <div className="bento-card">
            <div>
              <div className="bento-visual-preview">
                <div style={{ font: "700 12px var(--mono)", color: "#0070f3", marginBottom: "8px" }}>
                  02 · SECURE WEB APPLICATIONS
                </div>
                <div style={{ fontSize: "18px", color: "#fff", fontWeight: 700, margin: "0 0 6px" }}>
                  Next.js · React · Node.js · Cloud
                </div>
                <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
                  Multi-tenant SaaS architectures, hardened APIs, and sub-millisecond edge database routing.
                </div>
              </div>
              <h3 className="bento-card-title">Web Application Development</h3>
              <p className="bento-card-desc">
                From initial architecture to high-scale production. We build performant, modular web platforms with clean TypeScript, robust state management, and hardened authorization boundaries.
              </p>
            </div>
            <Link className="bento-link" href="/request-assessment?service=web_app_dev">
              Scope Web App Project →
            </Link>
          </div>

          {/* Bento Card 3: Mobile Application Development */}
          <div className="bento-card">
            <div>
              <div className="bento-visual-preview">
                <div style={{ font: "700 12px var(--mono)", color: "#d2a8ff", marginBottom: "8px" }}>
                  03 · MOBILE ENGINEERING
                </div>
                <div style={{ fontSize: "18px", color: "#fff", fontWeight: 700, margin: "0 0 6px" }}>
                  iOS · Android · React Native · Flutter
                </div>
                <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
                  Engineered with OWASP MASVS baseline controls, biometric authentication, and encrypted storage.
                </div>
              </div>
              <h3 className="bento-card-title">Mobile Application Development</h3>
              <p className="bento-card-desc">
                Native and cross-platform mobile apps for iOS and Android. Engineered with smooth 60fps animations, intuitive gesture navigation, encrypted local keychains, and certified App Store readiness.
              </p>
            </div>
            <Link className="bento-link" href="/request-assessment?service=mobile_app_dev">
              Build Mobile App →
            </Link>
          </div>

          {/* Bento Card 4: Website Design & Development */}
          <div className="bento-card">
            <div>
              <div className="bento-visual-preview">
                <div style={{ font: "700 12px var(--mono)", color: "#00e599", marginBottom: "8px" }}>
                  04 · HIGH-PERFORMANCE WEBSITES
                </div>
                <div style={{ fontSize: "18px", color: "#fff", fontWeight: 700, margin: "0 0 6px" }}>
                  Ultra-Fast · Fluid Motion · WCAG 2.2
                </div>
                <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
                  Commanding first impressions, responsive typography, and sub-second Time to First Byte.
                </div>
              </div>
              <h3 className="bento-card-title">Website Design &amp; Development</h3>
              <p className="bento-card-desc">
                High-converting websites engineered to elevate brand authority. Fluid interactive elements, headless CMS architecture, zero bloat, and precision responsive layouts across all viewports.
              </p>
            </div>
            <Link className="bento-link" href="/request-assessment?service=website_dev">
              Launch Brand Website →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* =====================================================================
          SECTION: SECURITY DESK & CISA LIVE KEV FEED
          ===================================================================== */}
      <motion.section
        className="feature-grid-section"
        id="reports"
        style={{ paddingTop: "0" }}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        viewport={{ once: false, amount: 0.15, margin: "-40px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="cisa-dark-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "20px", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ font: "600 11px var(--mono)", color: "var(--accent-red)", letterSpacing: "0.1em" }}>
                SECURITY DESK · CISA KEV INTEL
              </span>
              <h3 style={{ margin: "4px 0 0", font: "700 22px var(--sans)", color: "#fff" }}>
                Known Exploited Vulnerabilities Watch
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>{reportState}</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="search"
                placeholder="Filter by vendor, product, CVE..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ background: "#181818", border: "1px solid var(--border-strong)", borderRadius: "8px", padding: "8px 14px", color: "#fff", font: "12px var(--sans)", width: "240px" }}
              />
              <button
                type="button"
                className="refresh-button"
                onClick={() => setReportRequest((c) => c + 1)}
                disabled={refreshing}
                style={{ background: "#222", color: "#fff", borderColor: "var(--border-strong)", borderRadius: "8px" }}
              >
                {refreshing ? "Refreshing…" : "Refresh ↻"}
              </button>
            </div>
          </div>

          <div>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <div key={entry.cveID} className="cisa-item-dark">
                  <div style={{ display: "flex", justifyContent: "space-between", font: "11px var(--mono)", marginBottom: "4px" }}>
                    <a
                      href={`https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(entry.cveID)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent-red)", fontWeight: 700 }}
                    >
                      {entry.cveID} ↗
                    </a>
                    <span style={{ color: "var(--text-muted)" }}>Added {entry.dateAdded}</span>
                  </div>
                  <div style={{ font: "600 14px var(--sans)", color: "#fff", marginBottom: "4px" }}>
                    {[entry.vendorProject, entry.product].filter(Boolean).join(" · ") || entry.vulnerabilityName}
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {entry.shortDescription || "See CISA catalog for technical details."}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>No CVE entries match current filter.</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* =====================================================================
          SECTION: DIRECT CONTACT & QUICK ENGAGEMENT
          ===================================================================== */}
      <motion.section
        className="contact-section-dark"
        id="contact"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        viewport={{ once: false, amount: 0.15, margin: "-40px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <span style={{ font: "600 11px var(--mono)", color: "var(--accent-red)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Direct Engagement &amp; Scoping
          </span>
          <h2 style={{ font: "800 clamp(36px, 4.5vw, 56px)/1.08 var(--sans)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0 18px" }}>
            Let&apos;s scope your security assessment.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 24px" }}>
            Whether you need comprehensive Web, Mobile, and API security testing, cloud configuration hardening, or secure software engineering, our technical leads in Chennai are ready to scope your engagement.
          </p>

          <div className="direct-mail-box">
            <span style={{ font: "600 11px var(--mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Direct Technical Contact
            </span>
            <div className="direct-mail-address">
              <a href="mailto:contact@aegiswing.com" style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "4px" }}>
                contact@aegiswing.com
              </a>
            </div>
            <p style={{ margin: "4px 0 14px", fontSize: "12px", color: "var(--text-muted)" }}>
              Direct inbox for technical inquiries, scoping briefs, and mutual non-disclosure requests.
            </p>
            <button
              type="button"
              className="pill-secondary-btn"
              onClick={copyEmail}
              style={{ padding: "8px 16px", fontSize: "11px" }}
            >
              {copiedMail ? "✓ Copied to clipboard" : "Copy email address"}
            </button>
          </div>

          <div style={{ marginTop: "32px" }}>
            <Link href="/request-assessment" className="bento-link" style={{ fontSize: "13px", color: "var(--accent-red)" }}>
              Open Full Multi-Section Enterprise Scoping Portal →
            </Link>
          </div>
        </div>

        {/* Quick Project / Scoping Form */}
        <div className="dark-form-card">
          {submittedRef ? (
            <div className="quick-scoping-success-view">
              <div className="success-badge-circle">✓</div>
              <h3 style={{ font: "700 22px var(--sans)", color: "#fff", margin: "16px 0 8px" }}>
                Engagement Scoping Inquiry Received
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 16px" }}>
                Thank you, <strong style={{ color: "#fff" }}>{submittedDetails?.name}</strong>. Your scoping inquiry for <strong style={{ color: "#fff" }}>{submittedDetails?.company}</strong> has been logged.
              </p>
              <div className="reference-pill-code">
                {submittedRef}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, margin: "16px 0 24px" }}>
                Our offensive security team will review your objectives and contact you at <strong style={{ color: "#fff" }}>{submittedDetails?.email}</strong> within 24 hours with testing parameters and preliminary Rules of Engagement.
              </p>
              <button
                type="button"
                className="pill-secondary-btn"
                onClick={() => {
                  setSubmittedRef(null);
                  setQuickForm({
                    name: "",
                    email: "",
                    company: "",
                    service: "web_vapt",
                    message: "",
                    consent: false,
                    bot_field: "",
                  });
                  setFieldErrors({});
                  setFormStatus({ type: "", text: "", ref: "" });
                }}
                style={{ padding: "10px 22px", fontSize: "13px" }}
              >
                Submit Another Scoping Inquiry ↺
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ font: "700 20px var(--sans)", color: "#fff", margin: "0 0 6px" }}>Quick Engagement Scoping</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 24px" }}>
                Share your requirements for an immediate scoping estimate.
              </p>

              <form onSubmit={submitEnquiry} noValidate>
                <div className="honeypot-field" aria-hidden="true">
                  <label>
                    Leave empty
                    <input
                      name="bot_field"
                      tabIndex={-1}
                      autoComplete="off"
                      value={quickForm.bot_field}
                      onChange={(e) => handleInputChange("bot_field", e.target.value)}
                    />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px" }}>Your Name *</label>
                    <input
                      className={`dark-input ${fieldErrors.name ? "input-error" : ""}`}
                      required
                      placeholder="e.g. Anandha Krishnan"
                      value={quickForm.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                    {fieldErrors.name && (
                      <span className="field-error-msg">⚠ {fieldErrors.name}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px" }}>Business Email *</label>
                    <input
                      type="email"
                      className={`dark-input ${fieldErrors.email ? "input-error" : ""}`}
                      required
                      placeholder="name@company.com"
                      value={quickForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    {fieldErrors.email && (
                      <span className="field-error-msg">⚠ {fieldErrors.email}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px" }}>Company Name *</label>
                    <input
                      className={`dark-input ${fieldErrors.company ? "input-error" : ""}`}
                      required
                      placeholder="e.g. Acme Corp"
                      value={quickForm.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                    {fieldErrors.company && (
                      <span className="field-error-msg">⚠ {fieldErrors.company}</span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px" }}>Requested Service</label>
                    <select
                      className="dark-select"
                      value={quickForm.service}
                      onChange={(e) => handleInputChange("service", e.target.value)}
                    >
                      <option value="web_vapt">Web Application Penetration Testing (VAPT)</option>
                      <option value="mobile_vapt">Mobile Application VAPT (iOS &amp; Android)</option>
                      <option value="api_vapt">API Penetration Testing</option>
                      <option value="cloud_infra">Cloud Configuration Security (AWS, Azure, GCP)</option>
                      <option value="red_team">Adversarial Red Team Simulation</option>
                      <option value="web_app_dev">Web Application Development</option>
                      <option value="website_dev">Website Design &amp; Development</option>
                      <option value="mobile_app_dev">Mobile Application Development</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px" }}>Target Objectives / Scope Details</label>
                  <textarea
                    className="dark-textarea"
                    rows={3}
                    placeholder="Briefly describe your application endpoints, cloud environment, or testing timeline..."
                    value={quickForm.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <input
                      type="checkbox"
                      id="consent"
                      checked={quickForm.consent}
                      onChange={(e) => handleInputChange("consent", e.target.checked)}
                      style={{ marginTop: "3px", accentColor: "#0070f3" }}
                    />
                    <label htmlFor="consent" style={{ fontSize: "12px", color: "#888", lineHeight: 1.5 }}>
                      I acknowledge the <Link href="/privacy" style={{ color: "#fff", textDecoration: "underline" }}>Privacy Policy</Link> and understand that testing requires authorized scope and rules of engagement.
                    </label>
                  </div>
                  {fieldErrors.consent && (
                    <span className="field-error-msg" style={{ marginLeft: "24px" }}>⚠ {fieldErrors.consent}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="pill-primary-btn"
                  disabled={sending}
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "14px", background: "#ffffff", color: "#000" }}
                >
                  {sending ? "Submitting Inquiry…" : "Submit Scoping Inquiry →"}
                </button>

                {formStatus.text && !submittedRef && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      background: formStatus.type === "error" ? "rgba(255, 51, 68, 0.15)" : "rgba(0, 229, 153, 0.15)",
                      color: formStatus.type === "error" ? "#ff5566" : "#00e599",
                      border: `1px solid ${formStatus.type === "error" ? "rgba(255, 51, 68, 0.3)" : "rgba(0, 229, 153, 0.3)"}`,
                    }}
                  >
                    {formStatus.text}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </motion.section>

      {/* =====================================================================
          SITE FOOTER
          ===================================================================== */}
      <footer className="site-footer">
        <Link className="brand" href="/" aria-label="Aegis Wing home">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing" />
          <span className="brand-name" style={{ fontSize: "16px" }}>AEGIS WING</span>
        </Link>

        <div>
          <span>Direct Contact: </span>
          <a href="mailto:contact@aegiswing.com" style={{ color: "#fff", fontWeight: 600, textDecoration: "underline" }}>
            contact@aegiswing.com
          </a>
          <span> · Chennai, India</span>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/standards">Standards &amp; Methodologies</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/request-assessment">Assessment Portal</Link>
          <Link href="/admin">Ops Console</Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
