# Aegis Wing Design System & Architecture

## 1. Brand Identity & Positioning

**Aegis Wing** is an elite digital engineering & offensive security firm specializing in:
1. **Full-Stack Web Application Development:** Scalable SaaS platforms, real-time architectures, modern Next.js/React engineering.
2. **High-Performance Website Development:** Ultra-fast, responsive, aesthetic marketing engines and corporate digital experiences.
3. **Native & Cross-Platform Mobile Application Development:** High-fidelity iOS and Android applications with offline synchronization and native performance.
4. **Offensive Security & Penetration Testing (VA/PT):** Web, Mobile, API, Cloud Infrastructure vulnerability assessment and adversarial red team simulations.

> **Official Contact Email:** `contact@aegiswing.com` (displayed across the sticky navbar, hero CTAs, direct contact card, and footer).  
> **Note on Compliance:** Compliance readiness has been decommissioned from our service offerings to focus exclusively on high-performance engineering and offensive security validation.

---

## 2. Framer Visual Design System

### A. Theme & Color Palette
- **Foundational Dark Mode:** Deep midnight blacks (`#080808` page background, `#111111` card surfaces, `#161616` hover surfaces, `#181818` input containers).
- **High-Contrast Typography:** Crisp white text (`#ffffff` headings, `#ededed` titles, `#a1a1aa` lede, `#71717a` captions).
- **Vibrant Accent Elements:** Electric Blue (`#0070f3`) with soft atmospheric glow (`rgba(0, 112, 243, 0.25)`), subtle Crimson (`#ff3344`) for critical security signals.
- **Glassmorphism & Depth:** Backdrop-filtered frosted header (`rgba(8, 8, 8, 0.82)` with `blur(16px)`), hairline borders (`rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.2)`).

### B. Modern Typography
- **Primary Sans-Serif:** `Geist` (Google Fonts via `next/font/google`) — pristine geometric sans-serif delivering the authentic Framer aesthetic with tight letter-spacing (`-0.03em`) and variable weights (400 through 800).
- **Monospace Accent:** `Geist Mono` (Google Fonts via `next/font/google`) — disciplined monospace for terminal outputs, prompt chips, CVE identifiers, and system timestamps.

### C. Innovative Cyber Motion & Line Animations Engine
- **Cyber Grid Mesh:** 64px x 64px masked coordinate background grid with radial falloff.
- **Dynamic Laser Sweep Lines:** Moving horizontal beams (`.moving-laser-h.track-1` and `track-2`) and vertical beams (`.moving-laser-v.track-v1` and `track-v2`) traversing across the viewport.
- **Radar Scanning Beam:** Glowing horizontal bar (`.radar-sweep-bar`) sweeping vertically down the hero section simulating an active vulnerability scan.
- **Rotating Border Beams:** Dynamic glowing gradient boundary (`.border-beam-box`) highlighting prioritized cards.
- **Smooth Viewport Scroll Animations:** Framer Motion `motion.section` with `whileInView`, `viewport: { once: false, amount: 0.15 }`, and graceful fade-in/fade-out transitions as users scroll up and down.

### D. Sticky Navigation Header
- **Left:** Brand logo (`/aegis-logo.png`) rendered at 34px with subtle glow and `AEGIS WING` wordmark (`flex-shrink: 0`).
- **Center:** Main section navigation (`Offensive Security`, `Standards`, `Engineering`, `CISA KEV`, `Contact`).
- **Right:** One-click copyable `contact@aegiswing.com` pill badge + high-contrast white pill action button (`Request Scope →` with `flex-shrink: 0` ensuring zero clipping across all screen sizes).

---

## 3. Core Interactive Features

### A. Offensive Security Target & Threat Surface Configurator
- Replaces generic AI prompt generators with a straightforward, high-signal offensive security configurator.
- Interactive target selection chips:
  - `01 // Web Application VA/PT` (`web_vapt`)
  - `02 // API & Microservices` (`api_vapt`)
  - `03 // Mobile App (iOS / Android)` (`mobile_vapt`)
  - `04 // Cloud Configuration (AWS/Azure/GCP)` (`cloud_infra`)
  - `05 // Red Team Simulation` (`red_team`)
- Live display of technical testing standards (OWASP WSTG, ASVS, MASTG, CIS), simulated attack vectors (BOLA, IDOR, SSRF, IAM escalation), and access models under signed Rules of Engagement (RoE).

### B. Standards & Methodologies Command Matrix on Home Interface
- Directly accessible on the homepage interface without navigating away.
- Category filter toolbar (`All Frameworks`, `Offensive Testing`, `Secure Engineering`, `Cloud Hardening`).
- Displays core frameworks with official specification links and version notes.
- Quick link to the complete dedicated Standards dossier at `/standards`.

### C. Interactive Canvas & Telemetry Preview
- Live interactive dashboard card previewing real-time workspace activity:
  - **Toolbar Controls:** Dynamic mode toggling between `App Builder Canvas`, `VAPT Threat Telemetry`, and `Generated Architecture`.
  - **Live Code & Telemetry Window:** Showing simulated compiler output, active route mapping, or real-time CISA KEV vulnerability scans.

### C. Bento Feature Grid
4-card high-contrast grid highlighting core service verticals:
1. **Web Application Development:** Scalable SaaS, real-time dashboards, microservices, and React/Next.js architectures.
2. **Website Design & Development:** Bespoke, high-conversion visual design, WebGL animations, and Sub-second TTFB.
3. **Mobile Application Development:** React Native, Flutter, Swift, and Kotlin mobile apps with biometric security.
4. **VAPT & Offensive Security:** Authorized black-box and grey-box penetration testing for web, mobile, API, and cloud infrastructure.

---

## 4. Enterprise Scoping & Assessment Portal (`/request-assessment`)

- **Section A (Identity & Contact):** Full name, business email, company name, job title, phone number, and searchable ISO 3166-1 country selector with keyboard navigation.
- **Section B (Scoping & Technical Architecture):** 
  - Dynamic service picker supporting Web App Dev, Website Dev, Mobile App Dev, Web VA/PT, Mobile VA/PT, API VA/PT, Cloud/Infra, and Red Teaming.
  - Contextual asset breakdown metrics (e.g. estimated screens, API endpoints, cloud providers).
  - Multi-category interactive tech stack tag cloud with custom tag creation.
  - Standardized objective templates and custom scope input.
- **Section C (Logistics & NDA Workflow):**
  - Mutual NDA upload dropzone (.pdf / .docx) or Aegis standard NDA request.
  - Calendar date picker, operating timezone, and meeting slot preferences.
- **Section D (Privacy & Verification):** Strict zero-trust confidentiality disclaimer, privacy consent, bot honeypot, and reference dossier generation.

---

## 5. Operations & Admin Intelligence (`/admin`)

- Accessible via passcode authentication (`aegis-intel-2026`).
- Dark-mode analytics dashboard tracking Total Opportunities, Active Pipeline, Conversion Rate, and NDA Ratio.
- Immutable audit log tracking all inquiry submissions, status updates, and RoE dossier generation events.
- Rules of Engagement (RoE) dossier generator (`/api/v1/admin/roe?reference=...`) producing print-ready authorization documents with client signatures and boundary directives.

---

## 6. Standards & Methodologies Architecture (`/standards`)

- **SEO Metadata:** Configured via `app/standards/layout.js` with canonical URL `/standards` and open graph tags.
- **Section 1: Hero:** High-impact header with eyebrow badge, primary value proposition, dual scroll actions, and technical guidance disclaimer.
- **Section 2: Two Business Pillars:** Contrast cards for Offensive Security and Secure Digital Development.
- **Section 3: Standards Mapped to Services:** Desktop table with service tags, primary reference pills (direct external links), and mobile-responsive stacked cards.
- **Section 4: Core Standards & Frameworks:** 15 comprehensive specifications (OWASP WSTG, ASVS, Top 10, API Top 10, MASVS, MASTG, MASWE, CIS Benchmarks, NIST SSDF SP 800-218, NIST SP 800-115, OWASP SAMM, CSA CCM, CWE, CVSS, WCAG 2.2) with live search and category filters.
- **Section 5: Procedural Lifecycle:** 6-stage timeline (Scope, Methodology Selection, Execution, Validation, Reporting, Retesting) featuring the mandatory RoE penetration testing authorization directive.
- **Section 6: Risk Rating & Reporting:** CWE classification, CVSS severity metrics, contextual business impact analysis, and remediation prioritization.
- **Section 7: Scope & Governance Boundaries:** 6 distinct governance cards clarifying reference vs. compliance, independence, ISO 27001, PCI DSS, cloud scoping, and accessibility.
- **Section 8: Interactive FAQ:** 7 accessible, keyboard-friendly accordion panels answering key technical questions.
- **Section 9: Call to Action:** Side-by-side action buttons routing to `/request-assessment?service=web_vapt` and `/request-assessment?service=web_app_dev`.
