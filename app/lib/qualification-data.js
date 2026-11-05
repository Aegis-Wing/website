// Pre-defined qualification metadata, templates, and schemas for Engineering & Offensive Security

export const TECH_STACK_CATEGORIES = [
  {
    category: "Frontend & Web",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vue.js",
      "Nuxt",
      "Svelte / SvelteKit",
      "Astro",
      "HTML5 / Canvas",
    ],
  },
  {
    category: "Mobile & Cross-Platform",
    items: [
      "React Native",
      "Flutter",
      "iOS (Swift)",
      "Android (Kotlin)",
      "Expo",
      "Capacitor",
      "PWA",
    ],
  },
  {
    category: "Backend, APIs & Databases",
    items: [
      "Node.js",
      "Python / FastAPI",
      "Django",
      "Go (Golang)",
      "Java / Spring Boot",
      "GraphQL",
      "RESTful APIs",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Supabase",
      "Prisma ORM",
    ],
  },
  {
    category: "Cloud, DevOps & Security",
    items: [
      "AWS",
      "Vercel",
      "Google Cloud (GCP)",
      "Microsoft Azure",
      "Cloudflare",
      "Docker",
      "Kubernetes",
      "OAuth 2.0 / OIDC",
      "Auth0 / Clerk",
      "CI/CD Pipelines",
    ],
  },
];

export const SERVICE_OBJECTIVE_TEMPLATES = {
  web_app_dev: [
    "Full-stack SaaS application development from scratch",
    "Modernization of legacy architecture into high-performance Next.js",
    "Real-time collaborative features & WebSocket integration",
    "Complex dashboard, charts, analytics & workflow automation",
    "High-scalability backend API & database architecture",
  ],
  website_dev: [
    "High-converting brand website with Framer-grade fluid animations",
    "Performance-focused landing page (99+ Google Lighthouse score)",
    "Headless CMS integration (Sanity, Contentful, Strapi)",
    "Interactive 3D / Canvas hero experiences & micro-interactions",
    "Technical SEO & global responsive optimization",
  ],
  mobile_app_dev: [
    "Cross-platform iOS and Android mobile app (React Native / Flutter)",
    "Native mobile experience with offline sync & push notifications",
    "App Store & Google Play launch readiness & publishing",
    "In-app purchases, Stripe payment integration & biometric auth",
    "Hardened local storage, keychain encryption & SSL pinning",
  ],
  web_vapt: [
    "Pre-release / Pre-launch deep penetration testing",
    "OWASP Top 10 & business logic vulnerability assessment",
    "Broken Object Level Authorization (BOLA) and multi-tenancy verification",
    "Customer / Enterprise vendor diligence security validation",
    "Authentication bypass & privilege escalation discovery",
  ],
  mobile_vapt: [
    "MASVS / OWASP Mobile Top 10 comprehensive security assessment",
    "Insecure data storage, keychain inspection & binary tampering",
    "API backend communication & SSL certificate validation",
    "Client-side reverse engineering resistance verification",
  ],
  api_vapt: [
    "OWASP API Security Top 10 deep audit",
    "Authorization flaws (BOLA, BFLA) and privilege escalation",
    "Rate limiting, unauthenticated endpoint discovery & inventory audit",
    "Third-party webhook & partner integration penetration testing",
  ],
  cloud_infra: [
    "Cloud infrastructure penetration testing (AWS, Azure, GCP)",
    "IAM permissions, over-privileged roles & policy drift review",
    "Public storage bucket & exposed perimeter assets discovery",
    "Kubernetes cluster configuration & container isolation audit",
  ],
  red_team: [
    "Full-scope adversary simulation across people, systems, and controls",
    "Phishing, credential harvesting & external perimeter intrusion",
    "Internal lateral movement & domain compromise testing",
    "Detection & incident response validation",
  ],
  multiple_services: [
    "End-to-end development + offensive security validation bundle",
    "Complete product design, engineering, and penetration testing",
    "Full-stack application development with ongoing security audits",
  ],
};

export const SERVICE_ASSET_FIELDS = {
  web_app_dev: [
    { id: "core_features", label: "Core Features / Key Workflows", placeholder: "e.g. User auth, dashboard, billing, CRM integration" },
    { id: "user_roles", label: "User Roles & Permissions", placeholder: "e.g. Admin, Manager, Standard User, Customer" },
    { id: "integrations", label: "Third-party Integrations Required", placeholder: "e.g. Stripe, OpenAI, SendGrid, Salesforce" },
  ],
  website_dev: [
    { id: "page_count", label: "Estimated Page Count", placeholder: "e.g. 5-8 pages (Home, Features, Pricing, About, Blog)" },
    { id: "design_assets", label: "Design Status", placeholder: "e.g. Have Figma designs ready / Need complete design & dev" },
    { id: "cms_needs", label: "CMS / Content Updating", placeholder: "e.g. Need blog/case studies CMS or static" },
  ],
  mobile_app_dev: [
    { id: "platforms", label: "Target Platforms", placeholder: "e.g. iOS & Android (Cross-platform)" },
    { id: "app_screens", label: "Estimated Screen / Flow Count", placeholder: "e.g. ~15-20 screens" },
    { id: "hardware_apis", label: "Device Hardware Features", placeholder: "e.g. Camera, Push Notifications, Biometrics, Geolocation" },
  ],
  web_vapt: [
    { id: "spas", label: "Web Applications / SPAs", placeholder: "e.g. 2 apps (Customer Portal + Admin Dashboard)" },
    { id: "api_endpoints", label: "Estimated API Endpoints", placeholder: "e.g. ~35 endpoints" },
    { id: "user_roles", label: "Distinct User Roles to Test", placeholder: "e.g. SuperAdmin, Tenant Admin, Auditor, Guest" },
  ],
  mobile_vapt: [
    { id: "platforms", label: "Mobile Apps to Audit", placeholder: "e.g. 1 iOS app, 1 Android app" },
    { id: "app_screens", label: "Key Flows to Assess", placeholder: "e.g. Login, Payment Checkout, Profile" },
    { id: "backend_apis", label: "Connected Backend APIs", placeholder: "e.g. 1 REST API, 1 GraphQL" },
  ],
  api_vapt: [
    { id: "endpoints_count", label: "Total Target Endpoints", placeholder: "e.g. 45 REST endpoints, 12 GraphQL queries" },
    { id: "spec_format", label: "API Documentation Available", placeholder: "e.g. Swagger / OpenAPI 3.0 / Postman" },
    { id: "auth_methods", label: "API Auth Mechanisms", placeholder: "e.g. Bearer JWT, mTLS, API Keys" },
  ],
  cloud_infra: [
    { id: "cloud_providers", label: "Cloud Providers & Scope", placeholder: "e.g. AWS (3 accounts) + Cloudflare" },
    { id: "account_count", label: "Accounts / Subscriptions", placeholder: "e.g. Production + Staging" },
    { id: "k8s_clusters", label: "Kubernetes / Container Clusters", placeholder: "e.g. 2 EKS clusters" },
  ],
  red_team: [
    { id: "simulation_scope", label: "Simulation Scenarios", placeholder: "e.g. External perimeter breach + credential access" },
    { id: "target_domains", label: "Primary Domains & Assets", placeholder: "e.g. Corporate headquarters network + cloud identity" },
  ],
  multiple_services: [
    { id: "summary_count", label: "Scope Summary & Priorities", placeholder: "e.g. Build Next.js Web App + VAPT audit prior to launch" },
  ],
};

export const TIMEZONES = [
  { value: "Asia/Kolkata", label: "IST (India Standard Time - UTC+05:30)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time - UTC+00:00)" },
  { value: "Europe/London", label: "GMT / BST (London - UTC+00:00 / +01:00)" },
  { value: "Europe/Berlin", label: "CET / CEST (Central European - UTC+01:00 / +02:00)" },
  { value: "America/New_York", label: "EST / EDT (US Eastern - UTC-05:00 / -04:00)" },
  { value: "America/Chicago", label: "CST / CDT (US Central - UTC-06:00 / -05:00)" },
  { value: "America/Denver", label: "MST / MDT (US Mountain - UTC-07:00 / -06:00)" },
  { value: "America/Los_Angeles", label: "PST / PDT (US Pacific - UTC-08:00 / -07:00)" },
  { value: "Asia/Singapore", label: "SGT (Singapore - UTC+08:00)" },
  { value: "Asia/Dubai", label: "GST (Gulf Standard Time - UTC+04:00)" },
  { value: "Australia/Sydney", label: "AEST / AEDT (Sydney - UTC+10:00 / +11:00)" },
];

export const MEETING_SLOTS = [
  { id: "morning", label: "Morning", time: "10:00 AM - 1:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "2:00 PM - 5:00 PM" },
  { id: "evening", label: "Evening", time: "6:00 PM - 9:00 PM" },
];

export const CALL_DURATIONS = [
  { id: "30_min", label: "30 min", desc: "Project Scoping & Discovery" },
  { id: "45_min", label: "45 min", desc: "Detailed Technical Architecture Review" },
];

export const TEAM_MEMBERS = [
  { id: "anandha_k", name: "Anandha K.", role: "Principal Penetration Tester & Lead Architect" },
  { id: "vikram_s", name: "Vikram S.", role: "Lead Full-Stack Engineer" },
  { id: "priya_m", name: "Priya M.", role: "Mobile & Cloud Systems Architect" },
  { id: "karthik_r", name: "Karthik R.", role: "UI/UX & Frontend Engineer" },
];
