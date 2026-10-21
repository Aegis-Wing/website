"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const navItems = [
  ["Services", "services"],
  ["Method", "method"],
  ["Reports", "reports"],
  ["Contact", "contact"],
];

const services = [
  {
    number: "01",
    name: "VAPT",
    description: "Find and validate security weaknesses across your digital estate.",
    scope: "Web · Mobile · API · Network",
  },
  {
    number: "02",
    name: "Offensive Security & Red Teaming",
    description: "Test how people, processes, and technology hold up against scoped adversary scenarios.",
    scope: "Attack simulation · Control validation · Authorized scope",
  },
  {
    number: "03",
    name: "Compliance Readiness",
    description: "Understand technical security gaps before your next compliance review.",
    scope: "ISO 27001 · SOC 2 · PCI-DSS",
  },
  {
    number: "04",
    name: "Cloud Security Review",
    description: "Review identity permissions, exposed services, storage access, and configuration risks.",
    scope: "Cloud configuration · IAM · Exposure review",
  },
];

const steps = [
  ["Discover and scope", "Understand objectives, assets, constraints, and authorization."],
  ["Plan the work", "Agree boundaries, techniques, testing windows, and points of contact."],
  ["Test securely", "Perform authorized manual and automated assessment."],
  ["Validate findings", "Confirm impact and remove false positives."],
  ["Report clearly", "Share evidence and practical remediation guidance."],
  ["Retest and improve", "Verify fixes when retesting is part of the engagement."],
];

export default function Home() {
  const [navVisible, setNavVisible] = useState(true);
  const [entries, setEntries] = useState([]);
  const [reportState, setReportState] = useState("Loading the latest CISA entries…");
  const [refreshing, setRefreshing] = useState(false);
  const [reportRequest, setReportRequest] = useState(0);
  const [formStatus, setFormStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [query, setQuery] = useState("");
  const previousY = useRef(0);
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const eagleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 40]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 36 || y < previousY.current - 5) setNavVisible(true);
      else if (y > previousY.current + 5) setNavVisible(false);
      previousY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reportRequest]);

  useEffect(() => {
    let alive = true;
    const loadReports = async () => {
      setRefreshing(true);
      setReportState("Loading the latest CISA entries…");
      try {
        const response = await fetch("https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json", { cache: "no-store" });
        if (!response.ok) throw new Error("CISA catalog is unavailable");
        const catalog = await response.json();
        if (!Array.isArray(catalog.vulnerabilities)) throw new Error("CISA catalog format changed");
        const latest = catalog.vulnerabilities
          .filter((entry) => entry?.cveID && entry?.dateAdded)
          .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)))
          .slice(0, 12);
        if (alive) {
          setEntries(latest);
          setReportState(`CISA catalog · released ${catalog.dateReleased || "date unavailable"}`);
        }
      } catch {
        if (alive) {
          setEntries([]);
          setReportState("The live CISA catalog is temporarily unavailable. Open CISA’s catalog to view current entries.");
        }
      } finally {
        if (alive) setRefreshing(false);
      }
    };
    loadReports();
    return () => { alive = false; };
  }, []);

  const filteredEntries = entries.filter((entry) =>
    [entry.cveID, entry.vendorProject, entry.product, entry.vulnerabilityName]
      .some((value) => String(value || "").toLowerCase().includes(query.trim().toLowerCase())),
  ).slice(0, 5);

  const submitEnquiry = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setSending(true);
    setFormStatus("Sending your enquiry…");
    try {
      const formData = new FormData(form);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      if (!response.ok) throw new Error("Enquiry was not accepted");
      form.reset();
      setFormStatus("Your enquiry was sent. The Aegis Wing team can review it in the Netlify Forms inbox.");
    } catch {
      setFormStatus("We couldn’t send your enquiry. Please try again later or contact the site owner.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="page-shell">
      <motion.header
        className="site-header"
        initial={false}
        animate={{ y: navVisible ? 0 : -120 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <a className="brand" href="#top" aria-label="Aegis Wing home">
          <img className="brand-mark" src="/brand-mark.png" alt="" />
          <span className="brand-name">AEGIS WING</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(([label, target]) => <a href={`#${target}`} key={target}>{label}</a>)}
        </nav>
        <a className="header-cta" href="#contact">
          Book a Security Audit <span aria-hidden="true">→</span>
        </a>
      </motion.header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-grid" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
        </div>
        <motion.div className="shield-shape" aria-hidden="true" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 0.96, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.15 }} />
        <motion.img className="hero-eagle" src="/hero-eagle.png" alt="" aria-hidden="true" style={{ y: eagleY }} initial={{ x: 30 }} animate={{ x: 0 }} transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }} />

        <div className="hero-copy">
          <p className="eyebrow"><span /> Independent offensive security · Chennai, India</p>
          <h1 aria-label="We break in so they can’t.">
            <span className="headline-line">We <em>break</em> in</span>
            <span className="headline-line">so they</span>
            <span className="headline-line">can’t.</span>
          </h1>
          <p className="hero-description">Penetration testing, offensive security and compliance readiness for companies that would rather find the holes themselves.</p>
          <div className="hero-actions">
            <a className="primary-action" href="#contact">Request an assessment <span aria-hidden="true">→</span></a>
            <a className="text-action" href="#method">See our method <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className="hero-caption"><span className="status-dot" /> VAPT · RED TEAM · COMPLIANCE</div>
        <div className="hero-facts" aria-label="Assessment coverage and location">
          <span>WEB · MOBILE · API · NETWORK</span>
          <span>AUTHORIZED TESTING</span>
          <span>CHENNAI, IN</span>
        </div>
      </section>

      <section className="content-section services-section" id="services" aria-labelledby="services-title">
        <div className="section-heading">
          <p className="section-kicker">What we assess</p>
          <h2 id="services-title">Find the way in.<br /><span>Close it first.</span></h2>
          <p>Four focused security services for growing companies, from web and network testing to cloud review and compliance readiness.</p>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <a className="service-row" href="#contact" key={service.number} aria-label={`Ask about ${service.name}`}>
              <span className="service-number">{service.number}</span>
              <span className="service-main"><strong>{service.name}</strong><span>{service.description}</span><small>{service.scope}</small></span>
              <span className="service-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="content-section method-section" id="method" aria-labelledby="method-title">
        <div className="section-heading">
          <p className="section-kicker">How an assessment works</p>
          <h2 id="method-title">A measured path from<br /><span>scope to stronger security.</span></h2>
          <p>Every engagement begins with explicit authorization and a shared understanding of boundaries, communications, and goals.</p>
        </div>
        <ol className="method-list">
          {steps.map(([title, description], index) => (
            <li key={title}><span className="method-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>
          ))}
        </ol>
        <a className="text-action section-action" href="#contact">Discuss an assessment <span aria-hidden="true">→</span></a>
      </section>

      <section className="content-section reports-section" id="reports" aria-labelledby="reports-title">
        <div className="reports-intro">
          <p className="section-kicker">Security desk · CISA KEV</p>
          <h2 id="reports-title">Exploitation<br /><span>watch.</span></h2>
          <p>A live view of vulnerabilities CISA has confirmed are being exploited in the wild. This is an external catalog, not a feed of activity observed by Aegis Wing.</p>
          <a className="text-action" href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noopener noreferrer">Open CISA’s full catalog <span aria-hidden="true">↗</span></a>
        </div>
        <div className="reports-panel">
          <div className="reports-toolbar">
            <div><span className="report-status-dot" /><div><strong>Known exploited vulnerabilities</strong><p aria-live="polite">{reportState}</p></div></div>
            <button className="refresh-button" type="button" onClick={() => setReportRequest((current) => current + 1)} disabled={refreshing}>{refreshing ? "Refreshing…" : "Refresh ↻"}</button>
          </div>
          <label className="report-search-label" htmlFor="report-search">Filter by vendor, product, or CVE</label>
          <input className="report-search" id="report-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try a product name or CVE ID" />
          <div className="report-list" aria-live="polite" aria-busy={refreshing}>
            {filteredEntries.length ? filteredEntries.map((entry) => (
              <article className="report-item" key={entry.cveID}>
                <div className="report-meta"><a href={`https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(entry.cveID)}`} target="_blank" rel="noopener noreferrer">{entry.cveID}</a><time dateTime={entry.dateAdded}>Added {entry.dateAdded}</time></div>
                <h3>{[entry.vendorProject, entry.product].filter(Boolean).join(" · ") || entry.vulnerabilityName || entry.cveID}</h3>
                <p>{entry.shortDescription || entry.vulnerabilityName || "See the CISA catalog for vulnerability details."}</p>
              </article>
            )) : <p className="report-empty">{entries.length ? "No entries match that search." : reportState}</p>}
          </div>
          <p className="reports-source">Source: CISA Known Exploited Vulnerabilities catalog · updated by CISA</p>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div>
          <p className="section-kicker">Start with scope</p>
          <h2 id="contact-title">Let’s scope your<br /><span>next assessment.</span></h2>
          <p>Share what you are looking to assess. The right scope starts with your goals, environment, and constraints.</p>
        </div>
        <form className="enquiry-form" name="assessment-enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submitEnquiry}>
          <input type="hidden" name="form-name" value="assessment-enquiry" />
          <p className="honeypot-field" aria-hidden="true"><label>Leave this field empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
          <div className="enquiry-fields">
            <label>Full name<input name="name" autoComplete="name" minLength={2} required /></label>
            <label>Business email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Company<input name="company" autoComplete="organization" required /></label>
            <label>Service
              <select name="service" required defaultValue="">
                <option value="" disabled>Select an assessment</option>
                <option>VAPT</option>
                <option>Offensive security & red teaming</option>
                <option>Compliance readiness</option>
                <option>Cloud security review</option>
                <option>Not sure yet</option>
              </select>
            </label>
            <label className="enquiry-message">What would you like assessed?<textarea name="message" rows={4} minLength={12} required /></label>
          </div>
          <label className="enquiry-consent"><input name="consent" type="checkbox" required /><span>I agree to be contacted about this assessment request. This form is handled by Netlify Forms.</span></label>
          <button className="primary-action enquiry-submit" type="submit" disabled={sending}>{sending ? "Sending…" : "Send assessment enquiry"}<span aria-hidden="true">→</span></button>
          <p className="form-status" role="status" aria-live="polite">{formStatus}</p>
          <p className="form-privacy">Include only information needed to discuss the assessment. Do not submit credentials, secrets, or sensitive production data.</p>
        </form>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Aegis Wing home"><img className="brand-mark" src="/brand-mark.png" alt="" /><span className="brand-name">AEGIS WING</span></a>
        <span>Authorized testing · Chennai, India</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
