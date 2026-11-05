"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="page-shell">
      {/* Sticky Framer Navbar */}
      <header className="sticky-nav">
        <Link className="brand-wrap" href="/" aria-label="Aegis Wing home">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing Logo" />
          <span className="brand-name">AEGIS WING</span>
        </Link>
        <nav className="nav-links" aria-label="Navigation">
          <Link href="/">Platform</Link>
          <Link href="/#services">Services</Link>
          <Link href="/standards">Standards</Link>
          <Link href="/#canvas">Interactive Canvas</Link>
          <Link href="/request-assessment">Start Project / Audit</Link>
        </nav>
        <div className="nav-actions">
          <a className="nav-direct-mail" href="mailto:contact@aegiswing.com">
            <span>✉</span> contact@aegiswing.com
          </a>
          <Link className="pill-primary-btn" href="/request-assessment">
            Request Scope <span>→</span>
          </Link>
        </div>
      </header>

      <section style={{ maxWidth: "860px", margin: "140px auto 80px", padding: "0 24px" }}>
        <div className="prompt-badge" style={{ marginBottom: "16px" }}>LEGAL & GOVERNANCE</div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "16px 0 20px", color: "#ededed" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#888", fontFamily: "var(--font-mono, monospace)", fontSize: "12px", marginBottom: "40px", letterSpacing: "0.04em" }}>
          POLICY VERSION: 2026-v1.0 · LAST UPDATED: OCTOBER 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "15px", lineHeight: "1.75", color: "#a1a1aa" }}>
          <section className="bento-card" style={{ padding: "28px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#ededed", marginBottom: "12px" }}>1. Information We Collect</h2>
            <p>
              When you submit a project inquiry or assessment request via our website (including <code>/request-assessment</code>), we collect contact information such as your full name, business email address, company name, job title, phone number (if provided), and country/region. We also collect preliminary technical scoping details, such as requested engineering services (Web Applications, Websites, Mobile Apps) or offensive security assessments (Web VA/PT, Mobile VA/PT, API VA/PT, Cloud/Infra, Red Teaming), target environments, access models, and approximate timelines.
            </p>
          </section>

          <section className="bento-card" style={{ padding: "28px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#ededed", marginBottom: "12px" }}>2. Purpose of Processing</h2>
            <p>
              We process this information strictly to evaluate, qualify, and respond to your inquiry, prepare non-disclosure agreements (NDAs), establish rules of engagement, and provide tailored technical proposals. Inquiry submissions do not constitute authorization for penetration testing; all offensive security engagements require mutual written authorization, approved scope, and documented rules of engagement.
            </p>
          </section>

          <section className="bento-card" style={{ padding: "28px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#ededed", marginBottom: "12px" }}>3. Confidentiality and Security</h2>
            <p>
              We enforce strict zero-trust security controls to protect client information. We specifically instruct clients never to submit passwords, production API keys, database credentials, production secrets, or vulnerability evidence via our public web forms. Technical details and environment credentials are only exchanged through mutual encrypted channels following execution of appropriate NDAs.
            </p>
          </section>

          <section className="bento-card" style={{ padding: "28px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#ededed", marginBottom: "12px" }}>4. Data Retention</h2>
            <p>
              Inquiry records are retained in protected storage only for the duration necessary to conduct technical scoping and follow-up discussions, or to meet legitimate legal and audit obligations. Inquiries that do not proceed to engagement are periodically purged.
            </p>
          </section>

          <section className="bento-card" style={{ padding: "28px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#ededed", marginBottom: "12px" }}>5. Contact Information</h2>
            <p>
              If you have any questions regarding our data protection practices or wish to request deletion of your submitted inquiry data, please contact our team directly at:
            </p>
            <p style={{ fontFamily: "var(--font-mono, monospace)", color: "#0070f3", marginTop: "12px", fontSize: "14px", fontWeight: 500 }}>
              <a href="mailto:contact@aegiswing.com" style={{ color: "#0070f3", textDecoration: "underline" }}>contact@aegiswing.com</a> · Aegis Wing Security & Engineering · Chennai, India
            </p>
          </section>
        </div>

        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Link href="/request-assessment" className="pill-primary-btn" style={{ display: "inline-flex" }}>
            Start Project / Request Scope <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="brand-wrap">
          <img className="brand-mark" src="/aegis-logo.png" alt="Aegis Wing Logo" />
          <span className="brand-name">AEGIS WING</span>
        </div>
        <div>Offensive Security & Full-Stack Engineering · Chennai, India</div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="mailto:contact@aegiswing.com" style={{ color: "#fff", fontWeight: 600, textDecoration: "underline" }}>
            contact@aegiswing.com
          </a>
          <Link href="/standards" style={{ color: "#888" }}>Standards</Link>
          <Link href="/" style={{ color: "#888" }}>Back to Home ↑</Link>
        </div>
      </footer>
    </main>
  );
}