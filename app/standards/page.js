"use client";

import { useState } from "react";
import Link from "next/link";
import {
  STANDARDS_SERVICES_MAPPING,
  CORE_FRAMEWORKS,
  METHODOLOGY_STAGES,
  STANDARDS_FAQS,
} from "../lib/standards-data";

export default function StandardsAndMethodologiesPage() {
  const [copiedMail, setCopiedMail] = useState(false);
  const [mappingFilter, setMappingFilter] = useState("ALL");
  const [frameworkCategory, setFrameworkCategory] = useState("ALL");
  const [frameworkSearch, setFrameworkSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const copyEmail = () => {
    navigator.clipboard.writeText("contact@aegiswing.com");
    setCopiedMail(true);
    setTimeout(() => setCopiedMail(false), 2400);
  };

  const filteredMapping = STANDARDS_SERVICES_MAPPING.filter((item) => {
    if (mappingFilter === "OFFENSIVE") return item.category === "Offensive Security";
    if (mappingFilter === "DEVELOPMENT") return item.category === "Secure Digital Development";
    return true;
  });

  const filteredFrameworks = CORE_FRAMEWORKS.filter((fw) => {
    const matchesCategory =
      frameworkCategory === "ALL" ||
      (frameworkCategory === "OFFENSIVE" && fw.category.includes("Offensive")) ||
      (frameworkCategory === "DEVELOPMENT" && fw.category.includes("Development")) ||
      (frameworkCategory === "ARCHITECTURE" && (fw.category.includes("Infrastructure") || fw.category.includes("Scoring") || fw.category.includes("Governance")));

    const query = frameworkSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      fw.name.toLowerCase().includes(query) ||
      fw.abbreviation.toLowerCase().includes(query) ||
      fw.purpose.toLowerCase().includes(query) ||
      fw.applicableServices.some((s) => s.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="standards-page-shell">
      {/* Sticky Framer Navbar */}
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Aegis Wing home">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing Logo" />
          <span className="brand-name">AEGIS WING</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/">Platform</Link>
          <Link href="/#services">Services</Link>
          <Link href="/standards" style={{ color: "#ffffff", fontWeight: 600 }}>
            Standards & Methodologies
          </Link>
          <Link href="/#reports">CISA KEV</Link>
          <Link href="/request-assessment">Scope Project</Link>
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
          <Link className="header-cta" href="/request-assessment">
            Request Scope →
          </Link>
        </div>
      </header>

      {/* =====================================================================
          SECTION 1: HERO
          ===================================================================== */}
      <section className="standards-hero" id="top">
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-pill-badge">
          <span className="hero-pill-dot" />
          <span>STANDARDS & METHODOLOGIES</span>
        </div>

        <h1 className="standards-hero-title">
          Security Built on <br />
          <span className="gradient-text">Recognized Standards.</span>
        </h1>

        <p className="standards-hero-lede">
          Our security assessments and software development practices are informed by recognized industry standards, technical guidance, and established security frameworks. We select the appropriate methodology for each engagement based on the technology, scope, risk profile, and client requirements.
        </p>

        <div className="standards-hero-actions">
          <a href="#standards-mapping" className="pill-primary-btn">
            Explore Security Testing Standards ↓
          </a>
          <a href="#secure-development" className="pill-secondary-btn">
            Explore Secure Development Practices ↓
          </a>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "8px 18px",
            borderRadius: "9999px",
            fontSize: "12px",
            color: "#888888",
            marginTop: "16px",
          }}
        >
          <span>🛡️</span>
          <span>
            Methodology Reference · Technical guidance informs our engagement delivery; formal compliance certification is not claimed without independent accredited audit.
          </span>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: TWO BUSINESS PILLARS
          ===================================================================== */}
      <section className="standards-section" id="pillars">
        <div className="standards-section-header">
          <span className="form-section-tag">CORE ENGAGEMENT DISCIPLINES</span>
          <h2 className="section-title">Two Distinct Pillars of Technical Rigor</h2>
          <p className="section-desc">
            We operate across two complementary domains: validating defenses through rigorous offensive testing, and constructing resilient digital infrastructure through secure-by-design software engineering.
          </p>
        </div>

        <div className="pillars-grid">
          {/* Pillar 1: Offensive Security */}
          <div className="pillar-card">
            <div
              className="pillar-card-icon"
              style={{ background: "rgba(255, 51, 68, 0.1)", color: "#ff3344", borderColor: "rgba(255, 51, 68, 0.25)" }}
            >
              ⚔️
            </div>
            <h3 className="pillar-card-title">Offensive Security</h3>
            <p className="pillar-card-desc">
              Our assessment methodologies help identify, validate, classify, and communicate security weaknesses across web applications, mobile platforms, APIs, cloud configurations, and source code before adversarial threat actors can exploit them.
            </p>
            <ul className="pillar-capabilities-list">
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#ff3344" }} />
                <span>Web Application & API Penetration Testing (OWASP WSTG / ASVS)</span>
              </li>
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#ff3344" }} />
                <span>Mobile iOS & Android Vulnerability Assessment (OWASP MASTG / MASVS)</span>
              </li>
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#ff3344" }} />
                <span>Cloud Architecture & Configuration Reviews (CIS Benchmarks / CSA CCM)</span>
              </li>
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#ff3344" }} />
                <span>Static & Dynamic Secure Source Code Review (CWE / NIST SSDF)</span>
              </li>
            </ul>
            <div style={{ marginTop: "auto" }}>
              <Link href="/request-assessment?service=web_vapt" className="bento-link">
                Request Offensive Assessment <span>→</span>
              </Link>
            </div>
          </div>

          {/* Pillar 2: Secure Digital Development */}
          <div className="pillar-card" id="secure-development">
            <div
              className="pillar-card-icon"
              style={{ background: "rgba(0, 112, 243, 0.1)", color: "#0070f3", borderColor: "rgba(0, 112, 243, 0.25)" }}
            >
              🛡️
            </div>
            <h3 className="pillar-card-title">Secure Digital Development</h3>
            <p className="pillar-card-desc">
              Our development practices incorporate security requirements, secure coding standards, automated verification, and appropriate quality controls throughout every phase of the software development lifecycle (SDLC).
            </p>
            <ul className="pillar-capabilities-list">
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#0070f3" }} />
                <span>Next.js & React Web Application Engineering (OWASP ASVS L2 Baseline)</span>
              </li>
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#0070f3" }} />
                <span>High-Performance Corporate Website Development (WCAG 2.2 Accessibility)</span>
              </li>
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#0070f3" }} />
                <span>Native & Cross-Platform Mobile Development (OWASP MASVS Controls)</span>
              </li>
              <li className="pillar-capability-item">
                <span className="pillar-capability-dot" style={{ background: "#0070f3" }} />
                <span>Software Supply Chain & SDLC Governance (NIST SP 800-218 / SAMM)</span>
              </li>
            </ul>
            <div style={{ marginTop: "auto" }}>
              <Link href="/request-assessment?service=web_app_dev" className="bento-link">
                Discuss a Development Project <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: STANDARDS MAPPED TO SERVICES
          ===================================================================== */}
      <section className="standards-section" id="standards-mapping">
        <div className="standards-section-header">
          <span className="form-section-tag">SERVICE TO FRAMEWORK MATRIX</span>
          <h2 className="section-title">Standards Mapped to Services</h2>
          <p className="section-desc">
            Every technical engagement is structured around established frameworks tailored to the target asset type, testing objective, and governance requirements.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`framework-filter-btn ${mappingFilter === "ALL" ? "active" : ""}`}
            onClick={() => setMappingFilter("ALL")}
          >
            All Services ({STANDARDS_SERVICES_MAPPING.length})
          </button>
          <button
            type="button"
            className={`framework-filter-btn ${mappingFilter === "OFFENSIVE" ? "active" : ""}`}
            onClick={() => setMappingFilter("OFFENSIVE")}
          >
            Offensive Security Only
          </button>
          <button
            type="button"
            className={`framework-filter-btn ${mappingFilter === "DEVELOPMENT" ? "active" : ""}`}
            onClick={() => setMappingFilter("DEVELOPMENT")}
          >
            Secure Development Only
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="mapping-table-wrapper">
          <table className="mapping-table">
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Service Category</th>
                <th style={{ width: "32%" }}>Primary Standards & References</th>
                <th style={{ width: "40%" }}>Purpose & Operational Focus</th>
              </tr>
            </thead>
            <tbody>
              {filteredMapping.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="mapping-service-name">{row.service}</span>
                    <span
                      className="mapping-category-badge"
                      style={{
                        background:
                          row.category === "Offensive Security"
                            ? "rgba(255, 51, 68, 0.1)"
                            : "rgba(0, 112, 243, 0.1)",
                        color:
                          row.category === "Offensive Security" ? "#ff5566" : "#70b4ff",
                        border: `1px solid ${
                          row.category === "Offensive Security"
                            ? "rgba(255, 51, 68, 0.2)"
                            : "rgba(0, 112, 243, 0.2)"
                        }`,
                      }}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td>
                    <div>
                      {row.primaryReferences.map((ref, rIdx) => (
                        <a
                          key={rIdx}
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mapping-ref-pill"
                          title={`View official specification: ${ref.name}`}
                        >
                          <span>{ref.name}</span>
                          <span style={{ fontSize: "10px", opacity: 0.6 }}>↗</span>
                        </a>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: "#a1a1aa" }}>{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (Accessible Fallback) */}
        <div className="mapping-mobile-cards">
          {filteredMapping.map((row, idx) => (
            <div key={idx} className="mapping-mobile-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span className="mapping-service-name" style={{ fontSize: "16px" }}>{row.service}</span>
                <span
                  className="mapping-category-badge"
                  style={{
                    background:
                      row.category === "Offensive Security"
                        ? "rgba(255, 51, 68, 0.1)"
                        : "rgba(0, 112, 243, 0.1)",
                    color: row.category === "Offensive Security" ? "#ff5566" : "#70b4ff",
                  }}
                >
                  {row.category}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "0 0 16px", lineHeight: "1.5" }}>
                {row.purpose}
              </p>
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "#888", display: "block", marginBottom: "6px" }}>
                  PRIMARY REFERENCES:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {row.primaryReferences.map((ref, rIdx) => (
                    <a
                      key={rIdx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mapping-ref-pill"
                    >
                      <span>{ref.name}</span>
                      <span style={{ fontSize: "9px" }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: CORE STANDARDS AND FRAMEWORKS (15 CARDS)
          ===================================================================== */}
      <section className="standards-section" id="frameworks">
        <div className="standards-section-header">
          <span className="form-section-tag">REFERENCE DIRECTORY</span>
          <h2 className="section-title">Core Standards & Frameworks</h2>
          <p className="section-desc">
            Explore the 15 foundational specifications, testing guidelines, and secure engineering models that underpin our assessments and software delivery.
          </p>
        </div>

        {/* Toolbar: Categories + Live Search */}
        <div className="frameworks-toolbar">
          <div className="frameworks-filter-group">
            <button
              type="button"
              className={`framework-filter-btn ${frameworkCategory === "ALL" ? "active" : ""}`}
              onClick={() => setFrameworkCategory("ALL")}
            >
              All Frameworks ({CORE_FRAMEWORKS.length})
            </button>
            <button
              type="button"
              className={`framework-filter-btn ${frameworkCategory === "OFFENSIVE" ? "active" : ""}`}
              onClick={() => setFrameworkCategory("OFFENSIVE")}
            >
              Offensive Testing
            </button>
            <button
              type="button"
              className={`framework-filter-btn ${frameworkCategory === "DEVELOPMENT" ? "active" : ""}`}
              onClick={() => setFrameworkCategory("DEVELOPMENT")}
            >
              Secure Engineering
            </button>
            <button
              type="button"
              className={`framework-filter-btn ${frameworkCategory === "ARCHITECTURE" ? "active" : ""}`}
              onClick={() => setFrameworkCategory("ARCHITECTURE")}
            >
              Cloud & Scoring
            </button>
          </div>

          <input
            type="search"
            className="framework-search-input"
            placeholder="Search standards (e.g. WSTG, ASVS, Cloud)..."
            value={frameworkSearch}
            onChange={(e) => setFrameworkSearch(e.target.value)}
            aria-label="Filter framework cards"
          />
        </div>

        {/* Cards Grid */}
        <div className="frameworks-grid">
          {filteredFrameworks.map((fw) => (
            <div key={fw.id} className="framework-card">
              <div>
                <div className="framework-card-header">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                    <span className="framework-abbr-badge">{fw.abbreviation}</span>
                    <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "#71717a" }}>
                      {fw.category}
                    </span>
                  </div>
                  <h3 className="framework-card-title">{fw.name}</h3>
                  <div className="framework-card-purpose">{fw.purpose}</div>
                </div>

                <p className="framework-card-desc">{fw.description}</p>
              </div>

              <div className="framework-services-wrap">
                <span className="framework-services-label">Applicable Services</span>
                <div>
                  {fw.applicableServices.map((srv, sIdx) => (
                    <span key={sIdx} className="framework-service-tag">
                      {srv}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
                  <span style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "#666" }}>
                    {fw.versionNote}
                  </span>
                  <a
                    href={fw.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="framework-official-link"
                    aria-label={`Official specification for ${fw.name} (opens in new tab)`}
                  >
                    <span>Official Reference</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFrameworks.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#888888" }}>
            <p>No frameworks matched your filter criteria &ldquo;{frameworkSearch}&rdquo;.</p>
            <button
              type="button"
              className="pill-secondary-btn"
              onClick={() => {
                setFrameworkCategory("ALL");
                setFrameworkSearch("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* =====================================================================
          SECTION 5: HOW OUR METHODOLOGIES WORK (6-STAGE TIMELINE)
          ===================================================================== */}
      <section className="standards-section" id="methodology-process">
        <div className="standards-section-header">
          <span className="form-section-tag">PROCEDURAL LIFECYCLE</span>
          <h2 className="section-title">How Our Methodologies Work</h2>
          <p className="section-desc">
            A repeatable, risk-based operational lifecycle guiding technical discovery, verification, and knowledge transfer across six coordinated stages.
          </p>
        </div>

        {/* Mandatory Penetration Testing Authorization Directive */}
        <div
          style={{
            background: "rgba(255, 51, 68, 0.08)",
            border: "1px solid rgba(255, 51, 68, 0.3)",
            borderRadius: "14px",
            padding: "16px 22px",
            marginBottom: "36px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "13px",
            color: "#ff99a4",
            lineHeight: "1.5",
          }}
        >
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <div>
            <strong style={{ color: "#ffffff", display: "block", marginBottom: "2px" }}>
              Operational Boundary Directive for Penetration Testing:
            </strong>
            Offensive penetration testing is conducted strictly after appropriate authorization, signed Rules of Engagement (RoE), and mutual agreement on target boundaries. We never perform intrusive testing without documented permission from verified asset owners.
          </div>
        </div>

        <div className="timeline-stages">
          {METHODOLOGY_STAGES.map((st) => (
            <div key={st.stage} className="timeline-stage-card">
              <div className="stage-number-box">0{st.stage}</div>
              <div>
                <h3 className="stage-content-title">{st.title}</h3>
                <div className="stage-content-summary">{st.summary}</div>
                <p className="stage-content-details">{st.details}</p>

                <div className="stage-deliverables-wrap">
                  <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "#888", marginRight: "4px" }}>
                    KEY OUTPUTS:
                  </span>
                  {st.keyDeliverables.map((del, dIdx) => (
                    <span key={dIdx} className="stage-deliverable-chip">
                      ✓ {del}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: RISK RATING AND REPORTING
          ===================================================================== */}
      <section className="standards-section" id="risk-rating">
        <div className="standards-section-header">
          <span className="form-section-tag">VULNERABILITY CLASSIFICATION & TRIAGE</span>
          <h2 className="section-title">Risk Rating & Technical Reporting</h2>
          <p className="section-desc">
            Effective security assessments require structured classification and actionable business context. We combine technical metrics with operational reality to help engineering teams prioritize fixes efficiently.
          </p>
        </div>

        <div className="risk-reporting-grid">
          <div className="risk-report-card">
            <h3 className="risk-report-card-title">
              <span style={{ color: "#0070f3" }}>01.</span> Standardized Weakness Classification (CWE)
            </h3>
            <p className="risk-report-card-desc">
              We tag every confirmed finding with its corresponding MITRE Common Weakness Enumeration (CWE) identifier. This allows engineering teams to trace flaws back to established root-cause definitions and verify that architectural mitigations address systemic patterns rather than isolated bug symptoms.
            </p>
          </div>

          <div className="risk-report-card">
            <h3 className="risk-report-card-title">
              <span style={{ color: "#0070f3" }}>02.</span> Documented Severity Scoring (CVSS)
            </h3>
            <p className="risk-report-card-desc">
              Where appropriate, vulnerability severity is calculated using documented Common Vulnerability Scoring System (CVSS) metrics. We construct explicit vector strings capturing attack complexity, privileges required, user interaction, and scope change for total scoring transparency.
            </p>
          </div>

          <div className="risk-report-card">
            <h3 className="risk-report-card-title">
              <span style={{ color: "#0070f3" }}>03.</span> Contextual Business Impact & Exploitability
            </h3>
            <p className="risk-report-card-desc">
              Numerical scores never tell the entire story. We evaluate CVSS metrics alongside real-world exploitability, defense-in-depth compensating controls, target exposure, and direct business impact (e.g., potential unauthorized data access, service disruption, or regulatory penalties).
            </p>
          </div>

          <div className="risk-report-card">
            <h3 className="risk-report-card-title">
              <span style={{ color: "#0070f3" }}>04.</span> Prioritized Remediation & Retesting Verification
            </h3>
            <p className="risk-report-card-desc">
              Findings are delivered with step-by-step reproduction instructions, sanitized proof-of-concept evidence, and prioritized remediation guidance tailored to your technical stack. Where retesting is included in the statement of work, we re-verify implemented controls to document closure.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "24px", fontSize: "12px", color: "#71717a", textAlign: "center" }}>
          Specific report formats, retesting windows, and remediation timelines are governed by the executed statement of work and agreed engagement scope.
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: STANDARDS APPLIED ACCORDING TO SCOPE
          ===================================================================== */}
      <section className="standards-section" id="governance-scope">
        <div className="standards-section-header">
          <span className="form-section-tag">ENGAGEMENT GOVERNANCE & BOUNDARIES</span>
          <h2 className="section-title">Standards Applied According to Scope</h2>
          <p className="section-desc">
            Clarity in methodology application ensures realistic expectations, precise threat modeling, and professional compliance transparency.
          </p>
        </div>

        {/* Lead Quote Box */}
        <div className="governance-lead-box">
          <p className="governance-lead-quote">
            &ldquo;Not every framework applies to every engagement. We select relevant standards and controls according to the technology being assessed or developed, the agreed scope, the client&apos;s risk profile, and any applicable contractual or regulatory requirements.&rdquo;
          </p>
        </div>

        {/* Six Distinct Governance Cards */}
        <div className="distinctions-grid">
          <div className="distinction-card">
            <div className="distinction-card-header">
              <span style={{ color: "#ffaa00" }}>ℹ️</span>
              <h3 className="distinction-card-title">Reference vs. Compliance</h3>
            </div>
            <p className="distinction-card-desc">
              Referencing a standard (such as OWASP ASVS or CIS Benchmarks) does not automatically mean full or certified compliance with that framework; it guides our technical verification criteria.
            </p>
          </div>

          <div className="distinction-card">
            <div className="distinction-card-header">
              <span style={{ color: "#0070f3" }}>🏛️</span>
              <h3 className="distinction-card-title">Organizational Independence</h3>
            </div>
            <p className="distinction-card-desc">
              Using guidance from OWASP, NIST, or CIS does not imply that our company is certified, endorsed, or accredited by those organizations, which operate as open-source or standards-setting bodies.
            </p>
          </div>

          <div className="distinction-card">
            <div className="distinction-card-header">
              <span style={{ color: "#ff5566" }}>⚖️</span>
              <h3 className="distinction-card-title">ISO/IEC 27001 Position</h3>
            </div>
            <p className="distinction-card-desc">
              ISO/IEC 27001 or formal attestation certifications are never claimed unless our organization or the specific target estate holds an active, independent accredited certification.
            </p>
          </div>

          <div className="distinction-card">
            <div className="distinction-card-header">
              <span style={{ color: "#00c853" }}>💳</span>
              <h3 className="distinction-card-title">PCI DSS Scope Definition</h3>
            </div>
            <p className="distinction-card-desc">
              Payment Card Industry Data Security Standard (PCI DSS) requirements apply exclusively where payment cardholder environments (CDE) are explicitly identified within the agreed assessment scope.
            </p>
          </div>

          <div className="distinction-card">
            <div className="distinction-card-header">
              <span style={{ color: "#70b4ff" }}>☁️</span>
              <h3 className="distinction-card-title">Cloud Scoping Specifics</h3>
            </div>
            <p className="distinction-card-desc">
              Cloud configuration assessments require explicit upfront identification of the cloud service provider (AWS, Azure, GCP), targeted tenant boundaries, services in scope, and benchmark profiles.
            </p>
          </div>

          <div className="distinction-card">
            <div className="distinction-card-header">
              <span style={{ color: "#e0e0e0" }}>♿</span>
              <h3 className="distinction-card-title">Accessibility Verification</h3>
            </div>
            <p className="distinction-card-desc">
              Web Content Accessibility Guidelines (WCAG 2.2) verification is incorporated into digital development or audit projects only when formally designated as part of the project specification.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8: FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
          ===================================================================== */}
      <section className="standards-section" id="faq">
        <div className="standards-section-header centered">
          <span className="form-section-tag">COMMON QUESTIONS</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Direct, technical answers regarding our standards selection, framework distinctions, and engagement alignment.
          </p>
        </div>

        <div className="faq-accordion-list" role="region" aria-label="Standards and Methodologies Frequently Asked Questions">
          {STANDARDS_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            const contentId = `faq-panel-${index}`;
            const headerId = `faq-header-${index}`;

            return (
              <div key={index} className={`faq-accordion-item ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  id={headerId}
                  className="faq-accordion-trigger"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span>{faq.question}</span>
                  <span className="faq-accordion-chevron" aria-hidden="true">
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div id={contentId} role="region" aria-labelledby={headerId} className="faq-accordion-panel">
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SECTION 9: CALL TO ACTION
          ===================================================================== */}
      <section className="standards-section" style={{ borderBottom: "none" }}>
        <div className="standards-cta-box">
          <div className="hero-pill-badge" style={{ marginBottom: "16px" }}>
            <span>ENGAGE OUR TEAM</span>
          </div>

          <h2 className="standards-cta-title">
            Need a Security Assessment or <br />
            Secure Development Partner?
          </h2>

          <p className="standards-cta-desc">
            Tell us about your application, cloud environment, or development requirements. We can help identify an appropriate assessment or secure development approach for your needs.
          </p>

          <div className="standards-cta-actions">
            <Link
              href="/request-assessment?service=web_vapt"
              className="pill-primary-btn"
              style={{ padding: "14px 28px", fontSize: "13px" }}
            >
              Request a Security Assessment <span>→</span>
            </Link>
            <Link
              href="/request-assessment?service=web_app_dev"
              className="pill-secondary-btn"
              style={{ padding: "14px 28px", fontSize: "13px" }}
            >
              Discuss a Development Project <span>→</span>
            </Link>
          </div>

          <div style={{ marginTop: "24px", fontSize: "12px", color: "#888888" }}>
            Or reach our technical desk directly at{" "}
            <a
              href="mailto:contact@aegiswing.com"
              style={{ color: "#ffffff", fontWeight: 600, textDecoration: "underline" }}
            >
              contact@aegiswing.com
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SITE FOOTER
          ===================================================================== */}
      <footer className="site-footer">
        <div className="brand">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing Logo" />
          <span className="brand-name">AEGIS WING</span>
        </div>
        <span>High-Performance Engineering & Offensive Security · Chennai, India</span>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <a
            href="mailto:contact@aegiswing.com"
            style={{ color: "#fff", fontWeight: 600, textDecoration: "underline" }}
          >
            contact@aegiswing.com
          </a>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/standards">Standards</Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
