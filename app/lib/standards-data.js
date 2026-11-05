export const STANDARDS_SERVICES_MAPPING = [
  {
    service: "Website and web application VA/PT",
    category: "Offensive Security",
    primaryReferences: [
      { name: "OWASP WSTG", url: "https://owasp.org/www-project-web-security-testing-guide/" },
      { name: "OWASP ASVS", url: "https://owasp.org/www-project-application-security-verification-standard/" },
      { name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
    ],
    purpose: "Structure testing activities, define verification requirements, and identify common application risks.",
  },
  {
    service: "API security testing",
    category: "Offensive Security",
    primaryReferences: [
      { name: "OWASP API Security Top 10", url: "https://owasp.org/www-project-api-security/" },
      { name: "OWASP WSTG", url: "https://owasp.org/www-project-web-security-testing-guide/" },
      { name: "OWASP ASVS", url: "https://owasp.org/www-project-application-security-verification-standard/" },
    ],
    purpose: "Assess API-specific risks, authorization, authentication, input handling, and other relevant controls.",
  },
  {
    service: "Mobile application VA/PT",
    category: "Offensive Security",
    primaryReferences: [
      { name: "OWASP MASVS", url: "https://mas.owasp.org/MASVS/" },
      { name: "OWASP MASTG", url: "https://mas.owasp.org/MASTG/" },
      { name: "OWASP MASWE", url: "https://mas.owasp.org/MASWE/" },
    ],
    purpose: "Define mobile security controls, guide testing procedures, and classify relevant weaknesses.",
  },
  {
    service: "Cloud configuration assessment",
    category: "Offensive Security",
    primaryReferences: [
      { name: "CIS Benchmarks", url: "https://www.cisecurity.org/cis-benchmarks" },
      { name: "CSA Cloud Controls Matrix", url: "https://cloudsecurityalliance.org/research/cloud-controls-matrix" },
      { name: "Cloud-Provider Guidance", url: "https://www.cisecurity.org/cis-benchmarks" },
    ],
    purpose: "Evaluate configuration hardening, security controls, and cloud-specific risks across target tenant environments.",
  },
  {
    service: "Source code review",
    category: "Offensive Security",
    primaryReferences: [
      { name: "OWASP ASVS", url: "https://owasp.org/www-project-application-security-verification-standard/" },
      { name: "CWE", url: "https://cwe.mitre.org/" },
      { name: "SEI CERT Secure Coding", url: "https://wiki.sei.cmu.edu/confluence/display/seccode" },
      { name: "NIST SSDF (SP 800-218)", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
    ],
    purpose: "Identify code-level weaknesses, logic flaws, and assess adherence to secure coding practices.",
  },
  {
    service: "Website development",
    category: "Secure Digital Development",
    primaryReferences: [
      { name: "OWASP ASVS", url: "https://owasp.org/www-project-application-security-verification-standard/" },
      { name: "NIST SSDF", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
      { name: "WCAG 2.2", url: "https://www.w3.org/TR/WCAG22/" },
    ],
    purpose: "Incorporate application security, secure engineering practices, and accessibility requirements where in scope.",
  },
  {
    service: "Web application development",
    category: "Secure Digital Development",
    primaryReferences: [
      { name: "OWASP ASVS", url: "https://owasp.org/www-project-application-security-verification-standard/" },
      { name: "NIST SSDF", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
      { name: "OWASP SAMM", url: "https://owaspsamm.org/" },
    ],
    purpose: "Define technical security requirements and establish repeatable, resilient secure development practices throughout the SDLC.",
  },
  {
    service: "Mobile application development",
    category: "Secure Digital Development",
    primaryReferences: [
      { name: "OWASP MASVS", url: "https://mas.owasp.org/MASVS/" },
      { name: "OWASP MASTG", url: "https://mas.owasp.org/MASTG/" },
      { name: "NIST SSDF", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
    ],
    purpose: "Incorporate mobile security baseline controls, platform hardening, and proactive verification activities into development.",
  },
  {
    service: "Vulnerability reporting",
    category: "Offensive Security",
    primaryReferences: [
      { name: "CVSS", url: "https://www.first.org/cvss/" },
      { name: "CWE", url: "https://cwe.mitre.org/" },
      { name: "Business Impact Analysis", url: "https://cwe.mitre.org/" },
    ],
    purpose: "Classify weaknesses, support standardized severity assessment, and communicate contextual business risk.",
  },
];

export const CORE_FRAMEWORKS = [
  {
    id: "owasp-wstg",
    name: "OWASP Web Security Testing Guide",
    abbreviation: "WSTG",
    category: "Offensive Security",
    purpose: "Provides guidance for systematically testing web application security.",
    description:
      "A comprehensive technical manual detailing repeatable testing workflows, tools, and procedural checks to evaluate the security posture of web applications and web services across 12 distinct assessment categories.",
    applicableServices: ["Website and web application VA/PT", "API security testing"],
    officialUrl: "https://owasp.org/www-project-web-security-testing-guide/",
    versionNote: "Current stable release v4.2 / continuous v5 roadmap",
  },
  {
    id: "owasp-asvs",
    name: "OWASP Application Security Verification Standard",
    abbreviation: "ASVS",
    category: "Offensive Security & Development",
    purpose: "Provides security requirements and verification criteria for web applications and related application security controls.",
    description:
      "Defines a structured, measurable basis for designing, constructing, and testing technical application security controls across three progressive verification levels (L1 Opportunistic, L2 Standard, L3 Advanced).",
    applicableServices: [
      "Website and web application VA/PT",
      "API security testing",
      "Source code review",
      "Website development",
      "Web application development",
    ],
    officialUrl: "https://owasp.org/www-project-application-security-verification-standard/",
    versionNote: "Current stable version 4.0.3 (v5 in active development)",
  },
  {
    id: "owasp-top-10",
    name: "OWASP Top 10 Most Critical Web Application Security Risks",
    abbreviation: "OWASP Top 10",
    category: "Offensive Security",
    purpose: "Highlights major categories of web application security risks and supports awareness and risk discussions.",
    description:
      "A globally recognized consensus document outlining the most critical web application security risks (such as Broken Access Control, Cryptographic Failures, and Injection). Clarification: It serves as an awareness and risk prioritization benchmark, not an exhaustive or complete testing methodology on its own.",
    applicableServices: ["Website and web application VA/PT", "Risk triage & client discussions"],
    officialUrl: "https://owasp.org/www-project-top-ten/",
    versionNote: "Current baseline OWASP Top 10:2021",
  },
  {
    id: "owasp-api-top-10",
    name: "OWASP API Security Top 10",
    abbreviation: "API Security Top 10",
    category: "Offensive Security",
    purpose: "Helps identify and discuss common API security risks.",
    description:
      "Focuses specifically on the vulnerability classes prevalent in modern API architectures, microservices, and single-page application backends, including Broken Object Level Authorization (BOLA), Broken Object Property Level Authorization, and Unrestricted Resource Consumption.",
    applicableServices: ["API security testing", "Web application development"],
    officialUrl: "https://owasp.org/www-project-api-security/",
    versionNote: "Current baseline OWASP API Security Top 10:2023",
  },
  {
    id: "owasp-masvs",
    name: "OWASP Mobile Application Security Verification Standard",
    abbreviation: "MASVS",
    category: "Offensive Security & Development",
    purpose: "Defines mobile application security controls.",
    description:
      "Establishes a baseline of security requirements and threat models for mobile applications across iOS and Android, covering Data Storage & Privacy, Cryptography, Authentication & Authorization, Network Communication, Platform Interaction, and Code Quality.",
    applicableServices: ["Mobile application VA/PT", "Mobile application development"],
    officialUrl: "https://mas.owasp.org/MASVS/",
    versionNote: "Current stable standard v2.0.0",
  },
  {
    id: "owasp-mastg",
    name: "OWASP Mobile Application Security Testing Guide",
    abbreviation: "MASTG",
    category: "Offensive Security",
    purpose: "Provides mobile application security testing guidance and techniques.",
    description:
      "A comprehensive technical manual describing the practical processes, dynamic instrumentation techniques, static analysis procedures, and reverse engineering steps required to verify the controls listed in the MASVS on iOS and Android devices.",
    applicableServices: ["Mobile application VA/PT", "Mobile application development verification"],
    officialUrl: "https://mas.owasp.org/MASTG/",
    versionNote: "Continuous verification guide maintained by OWASP MAS",
  },
  {
    id: "owasp-maswe",
    name: "OWASP Mobile Application Security Weakness Enumeration",
    abbreviation: "MASWE",
    category: "Offensive Security & Development",
    purpose: "Provides a structured catalogue of mobile application security weaknesses.",
    description:
      "A structured classification schema bridging mobile vulnerability findings directly to architectural root causes and concrete remediation guidance, aligned with MITRE CWE.",
    applicableServices: ["Mobile application VA/PT", "Mobile application development"],
    officialUrl: "https://mas.owasp.org/MASWE/",
    versionNote: "Maintained within the OWASP MAS project ecosystem",
  },
  {
    id: "cis-benchmarks",
    name: "CIS Benchmarks (Center for Internet Security)",
    abbreviation: "CIS Benchmarks",
    category: "Offensive Security & Infrastructure",
    purpose: "Provides technology-specific configuration recommendations for supported platforms, services, and infrastructure.",
    description:
      "Consensus-developed, vendor-agnostic technical configuration guidelines for hardening cloud service platforms (AWS, Azure, GCP), operating systems, containers (Kubernetes, Docker), databases, and network devices against unauthorized access.",
    applicableServices: ["Cloud configuration assessment", "Infrastructure security assessments"],
    officialUrl: "https://www.cisecurity.org/cis-benchmarks",
    versionNote: "Regularly updated across major cloud providers and OS distributions",
  },
  {
    id: "nist-ssdf",
    name: "NIST Secure Software Development Framework (SSDF), SP 800-218",
    abbreviation: "NIST SSDF (SP 800-218)",
    category: "Secure Digital Development",
    purpose: "Provides practices for integrating security into the software development lifecycle.",
    description:
      "A core set of high-level secure software development practices structured into four groups: Prepare the Organization (PO), Protect the Software (PS), Produce Well-Secured Software (PW), and Respond to Vulnerabilities (RV), mitigating software supply chain and application risks.",
    applicableServices: [
      "Website development",
      "Web application development",
      "Mobile application development",
      "Source code review",
    ],
    officialUrl: "https://csrc.nist.gov/pubs/sp/800/218/final",
    versionNote: "NIST Special Publication 800-218 (Final)",
  },
  {
    id: "nist-sp-800-115",
    name: "NIST Technical Guide to Information Security Testing and Assessment, SP 800-115",
    abbreviation: "NIST SP 800-115",
    category: "Offensive Security",
    purpose: "Provides guidance for planning, conducting, and analyzing technical security tests and assessments.",
    description:
      "Provides recommendations for planning, conducting, analyzing, and reporting technical assessments, penetration testing activities, vulnerability scans, and security reviews in enterprise environments.",
    applicableServices: [
      "Website and web application VA/PT",
      "Cloud configuration assessment",
      "Offensive security governance",
    ],
    officialUrl: "https://csrc.nist.gov/pubs/sp/800/115/final",
    versionNote: "NIST Special Publication 800-115",
  },
  {
    id: "owasp-samm",
    name: "OWASP Software Assurance Maturity Model",
    abbreviation: "OWASP SAMM",
    category: "Secure Digital Development",
    purpose: "Helps organizations assess and improve their software security practices.",
    description:
      "An open, measurable maturity model structured across five core business functions (Governance, Design, Implementation, Verification, Operations), enabling engineering teams to evaluate and progressively enhance software security posture.",
    applicableServices: ["Web application development", "Engineering governance"],
    officialUrl: "https://owaspsamm.org/",
    versionNote: "Current stable version SAMM v2.0",
  },
  {
    id: "csa-ccm",
    name: "Cloud Security Alliance Cloud Controls Matrix",
    abbreviation: "CSA CCM",
    category: "Offensive Security",
    purpose: "Provides a cloud-focused security control framework that can support structured cloud risk assessments.",
    description:
      "A cybersecurity control framework covering 17 cloud architecture domains (including IAM, Data Security, Infrastructure Security, and Threat Management) providing baseline evaluation criteria for cloud security configurations.",
    applicableServices: ["Cloud configuration assessment", "Cloud infrastructure review"],
    officialUrl: "https://cloudsecurityalliance.org/research/cloud-controls-matrix",
    versionNote: "Current release CSA CCM v4.0",
  },
  {
    id: "cwe",
    name: "Common Weakness Enumeration",
    abbreviation: "CWE",
    category: "Offensive Security & Development",
    purpose: "Provides a common classification system for software and hardware weaknesses.",
    description:
      "A community-developed taxonomy of software vulnerabilities and flaws maintained by MITRE. CWE provides a unified dictionary and measurement baseline for weakness identification, mitigation verification, and root-cause analysis.",
    applicableServices: ["Source code review", "Vulnerability reporting", "Offensive security assessments"],
    officialUrl: "https://cwe.mitre.org/",
    versionNote: "Community standard maintained by MITRE (Version 4.14+)",
  },
  {
    id: "cvss",
    name: "Common Vulnerability Scoring System",
    abbreviation: "CVSS",
    category: "Offensive Security",
    purpose: "Supports standardized vulnerability severity scoring.",
    description:
      "An open framework maintained by FIRST that produces numerical severity scores reflecting the principal technical characteristics of a vulnerability. Severity scores must always be evaluated in conjunction with exploitability, public exposure, environmental context, and direct business impact.",
    applicableServices: ["Vulnerability reporting", "VA/PT triage"],
    officialUrl: "https://www.first.org/cvss/",
    versionNote: "CVSS v3.1 / CVSS v4.0 specifications",
  },
  {
    id: "wcag",
    name: "Web Content Accessibility Guidelines 2.2",
    abbreviation: "WCAG 2.2",
    category: "Secure Digital Development",
    purpose: "Defines accessibility requirements incorporated into website and application development when in scope.",
    description:
      "Developed by the W3C Web Accessibility Initiative (WAI), WCAG 2.2 defines testable technical criteria organized under four principles (Perceivable, Operable, Understandable, Robust) to ensure digital experiences are accessible to users with disabilities.",
    applicableServices: ["Website development", "Web application development"],
    officialUrl: "https://www.w3.org/TR/WCAG22/",
    versionNote: "W3C Recommendation 05 October 2023 (WCAG 2.2)",
  },
];

export const METHODOLOGY_STAGES = [
  {
    stage: 1,
    title: "Scope and Requirements",
    summary: "Establish objectives, assets, environments, constraints, and applicable requirements.",
    details:
      "We collaborate with your stakeholders to define engagement boundaries, target systems (domains, APIs, mobile builds, cloud tenants, or source repositories), testing exclusions, operational time windows, and communication channels. For offensive testing, signed Rules of Engagement (RoE) and written testing authorization are mandatory prerequisites before any technical activity commences.",
    keyDeliverables: ["Approved Rules of Engagement (RoE)", "Asset Inventory & Scope Dossier", "Emergency Contact Protocol"],
  },
  {
    stage: 2,
    title: "Methodology Selection",
    summary: "Select relevant standards and testing or development practices based on the engagement.",
    details:
      "Based on the technology estate, operational environment, and agreed scope, we determine the optimal testing guidance (e.g., OWASP WSTG for web, MASTG for mobile, CIS Benchmarks for cloud) or secure development standards (e.g., OWASP ASVS, NIST SSDF). We configure tailored test suites and verification checklists rather than applying arbitrary or irrelevant test cases.",
    keyDeliverables: ["Tailored Assessment Plan", "Standard Verification Checklist", "Testing Profile & Tooling Configuration"],
  },
  {
    stage: 3,
    title: "Assessment or Implementation",
    summary: "Perform authorized testing or apply secure engineering practices within the agreed scope.",
    details:
      "Depending on the service track, our specialists execute authorized penetration testing (combining thorough manual exploitation with structured automated scans) or implement secure application code, architectural hardening, and defensive controls. All testing strictly respects system stability directives, production boundaries, and rate limits.",
    keyDeliverables: ["Executed Manual & Automated Test Cycles", "Immediate Critical Vulnerability Alerts", "Hardened Code Commits / Builds"],
  },
  {
    stage: 4,
    title: "Validation and Analysis",
    summary: "Validate findings, review relevant evidence, and assess technical and business impact.",
    details:
      "Every identified anomaly or potential finding is manually investigated, triaged, and validated to eliminate false positives. We correlate technical indicators, demonstrate practical exploitability where authorized, assess contextual business risk, and assign standardized CWE identifiers and CVSS scores.",
    keyDeliverables: ["Validated Vulnerability Callset", "False-Positive Elimination Log", "Contextual Threat Vector Analysis"],
  },
  {
    stage: 5,
    title: "Reporting and Delivery",
    summary: "Document findings, severity, evidence, limitations, and prioritized recommendations.",
    details:
      "We produce an exhaustive, publication-grade assessment report tailored for both executive leadership and technical engineering teams. Deliverables document methodology references, executive risk posture, technical narrative with step-by-step reproduction steps, proof-of-concept evidence, root-cause categorization, and actionable remediation guidance.",
    keyDeliverables: ["Executive Summary Presentation", "Technical Assessment Dossier", "Remediation Guidance & Code Examples"],
  },
  {
    stage: 6,
    title: "Remediation and Retesting",
    summary: "Where included in the engagement, verify fixes and document residual risks.",
    details:
      "Once client engineering teams implement corrective measures, our team re-evaluates the targeted components where retesting is part of the agreed scope. We verify that remediations successfully neutralize the identified vulnerability without introducing functional regressions or secondary flaws, delivering an updated validation addendum.",
    keyDeliverables: ["Remediation Verification Addendum", "Residual Risk Statement", "Final Engagement Sign-off"],
  },
];

export const STANDARDS_FAQS = [
  {
    question: "What standards do you follow for web application penetration testing?",
    answer:
      "Our web application security testing is structured primarily around the OWASP Web Security Testing Guide (WSTG v4.2) for procedural testing methodologies and the OWASP Application Security Verification Standard (ASVS v4.0.3) for control verification baselines. We test against recognized risk classifications including the OWASP Top 10, combining manual security research with automated analysis in accordance with NIST SP 800-115 testing principles.",
  },
  {
    question: "Which frameworks are relevant to mobile application security?",
    answer:
      "For mobile application assessments and engineering on iOS and Android platforms, we utilize the OWASP Mobile Application Security (MAS) framework. Specifically, the Mobile Application Security Verification Standard (MASVS) establishes our baseline control requirements, the Mobile Application Security Testing Guide (MASTG) provides our technical testing procedures, and the Mobile Application Security Weakness Enumeration (MASWE) categorizes identified weaknesses.",
  },
  {
    question: "How do you assess cloud configurations?",
    answer:
      "Cloud configuration assessments are conducted against Center for Internet Security (CIS) Benchmarks specific to the target cloud service provider (Amazon Web Services, Microsoft Azure, Google Cloud Platform) and the Cloud Security Alliance Cloud Controls Matrix (CSA CCM). Assessments evaluate identity and access management (IAM), storage bucket permissions, network security group rules, logging, encryption at rest/in transit, and infrastructure-as-code hardening.",
  },
  {
    question: "What standards guide your source code reviews?",
    answer:
      "Static source code reviews and architectural analysis are informed by OWASP ASVS verification criteria, MITRE Common Weakness Enumeration (CWE), SEI CERT Secure Coding guidelines for relevant programming languages (e.g., C/C++, Java, Python, TypeScript), and the NIST Secure Software Development Framework (SSDF, SP 800-218). This multi-layered approach identifies insecure dependency usage, logic flaws, input deserialization issues, and cryptographic misimplementations.",
  },
  {
    question: "Do you guarantee compliance with every framework listed?",
    answer:
      "No. Referencing or aligning our methodologies with established industry standards does not constitute formal compliance certification or guarantee complete accreditation. Industry frameworks serve as rigorous technical references that guide our testing procedures and engineering controls. Formal compliance certifications (such as ISO/IEC 27001 or SOC 2) require independent external audits by accredited conformity assessment bodies.",
  },
  {
    question: "What is the difference between a security standard and a testing methodology?",
    answer:
      "A security standard (such as OWASP ASVS, MASVS, or CIS Benchmarks) defines 'what' controls, configurations, and defensive requirements should be present within a system. A testing methodology (such as OWASP WSTG, MASTG, or NIST SP 800-115) defines 'how' assessors systematically plan, conduct, evaluate, and exploit systems to discover whether those required controls exist and operate effectively.",
  },
  {
    question: "Can you align an engagement with our internal security requirements?",
    answer:
      "Yes. During our initial scoping and methodology selection stage, we routinely integrate client-specific security policies, architectural standards, regulatory drivers, or proprietary testing checklists into the engagement scope, ensuring our verification directly addresses your organization's specific threat model.",
  },
];
