"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TEAM_MEMBERS } from "../lib/qualification-data";

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);

  // Inquiries and stats state
  const [data, setData] = useState({ inquiries: [], analytics: null, recentAuditLogs: [] });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inquiries"); // 'inquiries' | 'audit'
  const [noteInput, setNoteInput] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch inquiries when authenticated
  const loadDashboardData = async () => {
    try {
      const res = await fetch("/api/v1/admin/inquiries");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if session exists in sessionStorage or local
    const saved = sessionStorage.getItem("aegis_admin_auth");
    if (saved === "true") {
      setAuthenticated(true);
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/v1/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAuthError(json.message || "Invalid administrative passcode");
        return;
      }
      setAuthenticated(true);
      sessionStorage.setItem("aegis_admin_auth", "true");
      loadDashboardData();
    } catch {
      setAuthError("Failed to authenticate with server");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/v1/admin/auth", { method: "DELETE" });
    sessionStorage.removeItem("aegis_admin_auth");
    setAuthenticated(false);
    setPasscode("");
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${selectedInquiry.reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedInquiry(json.inquiry);
        loadDashboardData();
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAssignee = async (newAssignee) => {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${selectedInquiry.reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignee: newAssignee }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedInquiry(json.inquiry);
        loadDashboardData();
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedInquiry || !noteInput.trim()) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${selectedInquiry.reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_notes: noteInput.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedInquiry(json.inquiry);
        setNoteInput("");
        loadDashboardData();
      }
    } finally {
      setUpdating(false);
    }
  };

  const filteredInquiries = data.inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      inq.reference.toLowerCase().includes(query) ||
      inq.contact?.company_name?.toLowerCase().includes(query) ||
      inq.contact?.full_name?.toLowerCase().includes(query) ||
      inq.contact?.business_email?.toLowerCase().includes(query) ||
      inq.assessment?.service?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "NEW":
        return "#d90b0b";
      case "CONTACTED":
        return "#b36b00";
      case "SCOPING":
        return "#005bb5";
      case "ENGAGED":
        return "#1b7340";
      case "CLOSED":
        return "#5b6575";
      default:
        return "var(--navy)";
    }
  };

  if (!authenticated) {
    return (
      <main className="page-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ maxWidth: "420px", width: "100%", background: "#111111", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "36px 32px", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <img src="/aegis-logo.png" alt="Aegis Logo" style={{ width: "32px", height: "32px" }} />
            <span style={{ font: "700 18px var(--heading)", letterSpacing: "0.04em", color: "#fff" }}>AEGIS SECURITY OPERATIONS</span>
          </div>
          <h1 style={{ font: "700 22px var(--heading)", margin: "0 0 8px", color: "#ffffff" }}>Admin Intelligence Console</h1>
          <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.5", margin: "0 0 24px" }}>
            Restricted administrative portal for managing enterprise inquiries, lead qualification, and rules of engagement.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="admin_code" style={{ display: "block", font: "600 11px var(--mono)", textTransform: "uppercase", marginBottom: "6px", color: "#d4d4d8" }}>
                Access Passcode
              </label>
              <input
                id="admin_code"
                type="password"
                className="form-control"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                required
              />
              <span style={{ font: "10px var(--mono)", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                Default: <code>aegis-intel-2026</code>
              </span>
            </div>

            {authError && (
              <p style={{ color: "var(--red)", fontSize: "12px", margin: "0 0 16px" }}>{authError}</p>
            )}

            <button type="submit" className="pill-primary-btn" style={{ width: "100%", cursor: "pointer", justifyContent: "center" }}>
              Authenticate Console →
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link href="/" style={{ font: "11px var(--mono)", color: "var(--muted)" }}>← Return to Public Website</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell" style={{ padding: "0 4vw" }}>
      {/* Admin Header */}
      <header className="site-header" style={{ padding: "0 4vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img src="/aegis-logo.png" alt="Aegis Logo" className="brand-mark" />
          <div>
            <span className="brand-name" style={{ fontSize: "20px" }}>AEGIS OPS CENTER</span>
            <span style={{ display: "block", font: "9px var(--mono)", color: "var(--red)", letterSpacing: "0.1em" }}>RESTRICTED · OPERATIONS CONSOLE</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/request-assessment" target="_blank" style={{ font: "11px var(--mono)", color: "var(--muted)" }}>
            Public Form ↗
          </Link>
          <button type="button" onClick={handleLogout} className="refresh-button" style={{ color: "var(--red)", borderColor: "var(--red)" }}>
            Sign Out ⎋
          </button>
        </div>
      </header>

      <div style={{ marginTop: "124px", marginBottom: "80px" }}>
        {/* Analytics KPI Row */}
        {data.analytics && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "36px" }}>
            <div style={{ background: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ font: "10px var(--mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Opportunities</span>
              <div style={{ font: "700 32px var(--heading)", color: "#ffffff", marginTop: "6px" }}>{data.analytics.total}</div>
            </div>
            <div style={{ background: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ font: "10px var(--mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Pipeline</span>
              <div style={{ font: "700 32px var(--heading)", color: "#ffffff", marginTop: "6px" }}>{data.analytics.activePipeline}</div>
            </div>
            <div style={{ background: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ font: "10px var(--mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Engagement Conversion</span>
              <div style={{ font: "700 32px var(--heading)", color: "#00c853", marginTop: "6px" }}>{data.analytics.conversionRate}</div>
            </div>
            <div style={{ background: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "20px" }}>
              <span style={{ font: "10px var(--mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>NDA Requirement Ratio</span>
              <div style={{ font: "700 32px var(--heading)", color: "var(--red)", marginTop: "6px" }}>{data.analytics.ndaRatio}</div>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("inquiries")}
              style={{
                background: "none",
                border: "none",
                font: "600 13px var(--mono)",
                color: activeTab === "inquiries" ? "#0070f3" : "var(--muted)",
                cursor: "pointer",
                borderBottom: activeTab === "inquiries" ? "2px solid #0070f3" : "none",
                paddingBottom: "8px",
              }}
            >
              Enterprise Inquiries ({data.inquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              style={{
                background: "none",
                border: "none",
                font: "600 13px var(--mono)",
                color: activeTab === "audit" ? "#0070f3" : "var(--muted)",
                cursor: "pointer",
                borderBottom: activeTab === "audit" ? "2px solid #0070f3" : "none",
                paddingBottom: "8px",
              }}
            >
              Immutable Audit Log ({data.recentAuditLogs.length})
            </button>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="refresh-button"
              style={{ borderRadius: "8px", color: "#fff", borderColor: "rgba(255, 255, 255, 0.15)" }}
              onClick={loadDashboardData}
            >
              Refresh Feed ↻
            </button>
          </div>
        </div>

        {activeTab === "inquiries" ? (
          <div>
            {/* Filter and Search Bar */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {["ALL", "NEW", "CONTACTED", "SCOPING", "ENGAGED", "CLOSED"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: "6px 14px",
                      background: statusFilter === s ? "#0070f3" : "#161616",
                      color: statusFilter === s ? "#ffffff" : "#a1a1aa",
                      border: "1px solid " + (statusFilter === s ? "#0070f3" : "rgba(255, 255, 255, 0.1)"),
                      borderRadius: "9999px",
                      font: "11px var(--mono)",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <input
                type="search"
                placeholder="Search reference, company, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "220px",
                  padding: "8px 14px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  font: "13px var(--sans)",
                  background: "#181818",
                  color: "#ffffff",
                  outline: "none",
                }}
              />
            </div>

            {/* Inquiries Table */}
            <div style={{ overflowX: "auto", background: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#161616", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", font: "600 10px var(--mono)", color: "var(--muted)" }}>REF / DATE</th>
                    <th style={{ padding: "12px 16px", font: "600 10px var(--mono)", color: "var(--muted)" }}>PROSPECT & COMPANY</th>
                    <th style={{ padding: "12px 16px", font: "600 10px var(--mono)", color: "var(--muted)" }}>SERVICE & SCOPE</th>
                    <th style={{ padding: "12px 16px", font: "600 10px var(--mono)", color: "var(--muted)" }}>NDA / SCHEDULING</th>
                    <th style={{ padding: "12px 16px", font: "600 10px var(--mono)", color: "var(--muted)" }}>ASSIGNEE</th>
                    <th style={{ padding: "12px 16px", font: "600 10px var(--mono)", color: "var(--muted)" }}>STATUS</th>
                    <th style={{ padding: "12px 16px", font: "600 10px var(--mono)", color: "var(--muted)" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inq) => (
                      <tr
                        key={inq.reference}
                        style={{
                          borderBottom: "1px solid var(--rule)",
                          cursor: "pointer",
                          background: selectedInquiry?.reference === inq.reference ? "rgba(217,11,11,0.04)" : "transparent",
                        }}
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ font: "700 12px var(--mono)", color: "var(--navy)" }}>{inq.reference}</span>
                          <span style={{ display: "block", font: "10px var(--mono)", color: "var(--muted)" }}>
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <strong>{inq.contact?.company_name}</strong>
                          <span style={{ display: "block", fontSize: "11px", color: "var(--muted)" }}>
                            {inq.contact?.full_name} · {inq.contact?.business_email}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ textTransform: "capitalize" }}>{(inq.assessment?.service || "").replace("_", " ")}</span>
                          <span style={{ display: "block", font: "10px var(--mono)", color: "var(--muted)" }}>
                            {inq.assessment?.environment?.toUpperCase()} · {inq.assessment?.access_model}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ font: "11px var(--mono)", color: inq.nda_required === "yes" ? "var(--red)" : "var(--muted)" }}>
                            NDA: {inq.nda_required === "yes" ? "REQUIRED" : "NOT REQ"}
                          </span>
                          {inq.scheduling?.preferred_date && (
                            <span style={{ display: "block", fontSize: "11px", color: "var(--navy)" }}>
                              📅 {inq.scheduling.preferred_date}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "12px", color: inq.assignee ? "var(--navy)" : "var(--muted)" }}>
                            {inq.assignee || "- Unassigned -"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              font: "600 10px var(--mono)",
                              color: "#fff",
                              background: getStatusBadgeColor(inq.status),
                              borderRadius: "2px",
                            }}
                          >
                            {inq.status || "NEW"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <button
                            type="button"
                            style={{
                              padding: "4px 8px",
                              background: "none",
                              border: "1px solid var(--rule)",
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInquiry(inq);
                            }}
                          >
                            Manage →
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
                        No inquiries found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected Inquiry Detail Drawer / Management Panel */}
            {selectedInquiry && (
              <div
                style={{
                  marginTop: "32px",
                  background: "#141414",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "20px", marginBottom: "24px" }}>
                  <div>
                    <span style={{ font: "700 11px var(--mono)", color: "#0070f3", letterSpacing: "0.1em" }}>DOSSIER · {selectedInquiry.reference}</span>
                    <h2 style={{ font: "700 28px var(--heading)", margin: "6px 0 2px", color: "#ffffff" }}>
                      {selectedInquiry.contact?.company_name}
                    </h2>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "13px" }}>
                      Contact: <strong style={{ color: "#ffffff" }}>{selectedInquiry.contact?.full_name}</strong> ({selectedInquiry.contact?.job_title}) · Email: {selectedInquiry.contact?.business_email} · Phone: {selectedInquiry.contact?.phone || "None"} · Country: {selectedInquiry.contact?.country}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href={`/api/v1/admin/roe?reference=${selectedInquiry.reference}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-primary-btn"
                      style={{ padding: "8px 16px", fontSize: "12px" }}
                    >
                      Generate RoE Dossier 📄
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(null)}
                      style={{ background: "#1f1f1f", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "8px", color: "#fff", padding: "8px 14px", cursor: "pointer", font: "11px var(--mono)" }}
                    >
                      Close ✕
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px" }}>
                  {/* Left Column: Scope & Qualification Details */}
                  <div>
                    <h3 style={{ font: "700 14px var(--mono)", textTransform: "uppercase", color: "#ffffff", marginBottom: "12px", letterSpacing: "0.04em" }}>
                      Qualification & Architecture Breakdown
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "#181818", padding: "16px", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", marginBottom: "20px" }}>
                      <div>
                        <span style={{ font: "10px var(--mono)", color: "var(--muted)" }}>SERVICE:</span>
                        <div style={{ fontWeight: 600, color: "#ffffff" }}>{selectedInquiry.assessment?.service?.replace("_", " ")}</div>
                      </div>
                      <div>
                        <span style={{ font: "10px var(--mono)", color: "var(--muted)" }}>ENVIRONMENT:</span>
                        <div style={{ fontWeight: 600, color: "#ffffff" }}>{selectedInquiry.assessment?.environment?.toUpperCase()}</div>
                      </div>
                      <div>
                        <span style={{ font: "10px var(--mono)", color: "var(--muted)" }}>ACCESS MODEL:</span>
                        <div style={{ fontWeight: 600, color: "#ffffff" }}>{selectedInquiry.assessment?.access_model}</div>
                      </div>
                      <div>
                        <span style={{ font: "10px var(--mono)", color: "var(--muted)" }}>TIMELINE:</span>
                        <div style={{ fontWeight: 600, color: "#ffffff" }}>{selectedInquiry.assessment?.timeline}</div>
                      </div>
                    </div>

                    {/* Structured Asset Breakdown */}
                    {selectedInquiry.assessment?.asset_breakdown && Object.keys(selectedInquiry.assessment.asset_breakdown).length > 0 && (
                      <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ font: "600 12px var(--mono)", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>
                          Target Asset Breakdown
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px" }}>
                          {Object.entries(selectedInquiry.assessment.asset_breakdown).map(([k, v]) => (
                            <li key={k}>
                              <strong>{k.replace("_", " ")}:</strong> {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {selectedInquiry.assessment?.tech_stack?.length > 0 && (
                      <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ font: "600 12px var(--mono)", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>
                          Identified Technologies
                        </h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {selectedInquiry.assessment.tech_stack.map((t) => (
                            <span key={t} style={{ font: "11px var(--mono)", background: "#1f1f1f", color: "#ffffff", padding: "4px 8px", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "6px" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Objectives */}
                    {selectedInquiry.assessment?.objectives_selected?.length > 0 && (
                      <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ font: "600 12px var(--mono)", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>
                          Target Assessment Objectives
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px" }}>
                          {selectedInquiry.assessment.objectives_selected.map((obj) => (
                            <li key={obj}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Context */}
                    {selectedInquiry.additional_context && (
                      <div>
                        <h4 style={{ font: "600 12px var(--mono)", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>
                          Prospect Context & Boundaries
                        </h4>
                        <p style={{ background: "#faf8f5", padding: "12px", border: "1px solid var(--rule)", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                          {selectedInquiry.additional_context}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Workflow Management & Notes */}
                  <div style={{ borderLeft: "1px solid var(--rule)", paddingLeft: "24px" }}>
                    <h3 style={{ font: "700 15px var(--mono)", textTransform: "uppercase", color: "var(--navy)", marginBottom: "16px" }}>
                      Operations & Lead Pipeline
                    </h3>

                    {/* Status Changer */}
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", font: "600 11px var(--mono)", textTransform: "uppercase", marginBottom: "6px" }}>
                        Current Status
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {["NEW", "CONTACTED", "SCOPING", "ENGAGED", "CLOSED"].map((st) => (
                          <button
                            key={st}
                            type="button"
                            disabled={updating}
                            onClick={() => handleUpdateStatus(st)}
                            style={{
                              padding: "6px 10px",
                              font: "600 10px var(--mono)",
                              background: selectedInquiry.status === st ? getStatusBadgeColor(st) : "#181818",
                              color: selectedInquiry.status === st ? "#fff" : "#d4d4d8",
                              border: `1px solid ${selectedInquiry.status === st ? getStatusBadgeColor(st) : "rgba(255, 255, 255, 0.12)"}`,
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Assignee Changer */}
                    <div style={{ marginBottom: "24px" }}>
                      <label style={{ display: "block", font: "600 11px var(--mono)", textTransform: "uppercase", marginBottom: "6px", color: "var(--muted)" }}>
                        Assigned Assessor / Lead
                      </label>
                      <select
                        className="form-control"
                        value={selectedInquiry.assignee || ""}
                        disabled={updating}
                        onChange={(e) => handleUpdateAssignee(e.target.value)}
                      >
                        <option value="">- Unassigned -</option>
                        {TEAM_MEMBERS.map((tm) => (
                          <option key={tm.id} value={tm.name}>
                            {tm.name} ({tm.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Logistics Card */}
                    <div style={{ background: "#181818", padding: "14px", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", marginBottom: "20px", fontSize: "12px", color: "#d4d4d8" }}>
                      <div><strong style={{ color: "#ffffff" }}>NDA Workflow:</strong> {selectedInquiry.nda_workflow?.type || "None"}</div>
                      {selectedInquiry.nda_workflow?.file_name && (
                        <div style={{ marginTop: "4px" }}>
                          📎 <strong style={{ color: "#ffffff" }}>Uploaded File:</strong> {selectedInquiry.nda_workflow.file_name}
                        </div>
                      )}
                      {selectedInquiry.scheduling?.preferred_date && (
                        <div style={{ marginTop: "4px" }}>
                          📅 <strong style={{ color: "#ffffff" }}>Target Call:</strong> {selectedInquiry.scheduling.preferred_date} ({selectedInquiry.scheduling.preferred_slot}) [{selectedInquiry.scheduling.timezone}]
                        </div>
                      )}
                    </div>

                    {/* Internal Notes Thread */}
                    <div>
                      <label style={{ display: "block", font: "600 11px var(--mono)", textTransform: "uppercase", marginBottom: "8px" }}>
                        Operational Notes & Log
                      </label>
                      <form onSubmit={handleAddNote} style={{ marginBottom: "14px" }}>
                        <textarea
                          rows={2}
                          className="form-control"
                          placeholder="Add internal scoping note or communication summary..."
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                        />
                        <button
                          type="submit"
                          disabled={updating || !noteInput.trim()}
                          className="pill-primary-btn"
                          style={{
                            marginTop: "8px",
                            padding: "6px 14px",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          Add Note
                        </button>
                      </form>

                      {selectedInquiry.notes?.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "180px", overflowY: "auto" }}>
                          {selectedInquiry.notes.map((n, idx) => (
                            <div key={idx} style={{ background: "#181818", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "6px", padding: "8px 10px", fontSize: "11px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", font: "10px var(--mono)" }}>
                                <span>{n.author}</span>
                                <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                              <div style={{ marginTop: "4px", color: "#ffffff" }}>{n.text}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Audit Log Tab */
          <div style={{ background: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "20px" }}>
            <h2 style={{ font: "700 18px var(--heading)", margin: "0 0 16px", color: "#ffffff" }}>Enterprise Immutable Audit Trail</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ background: "#161616", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                    <th style={{ padding: "10px 14px", font: "600 10px var(--mono)", color: "var(--muted)" }}>EVENT ID</th>
                    <th style={{ padding: "10px 14px", font: "600 10px var(--mono)", color: "var(--muted)" }}>TIMESTAMP</th>
                    <th style={{ padding: "10px 14px", font: "600 10px var(--mono)", color: "var(--muted)" }}>EVENT TYPE</th>
                    <th style={{ padding: "10px 14px", font: "600 10px var(--mono)", color: "var(--muted)" }}>REFERENCE</th>
                    <th style={{ padding: "10px 14px", font: "600 10px var(--mono)", color: "var(--muted)" }}>ACTOR / IP</th>
                    <th style={{ padding: "10px 14px", font: "600 10px var(--mono)", color: "var(--muted)" }}>DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentAuditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "10px 14px", font: "11px var(--mono)", color: "#ffffff" }}>{log.id}</td>
                      <td style={{ padding: "10px 14px", font: "11px var(--mono)", color: "var(--muted)" }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ font: "600 10px var(--mono)", color: "var(--red)" }}>{log.event_type}</span>
                      </td>
                      <td style={{ padding: "10px 14px", font: "11px var(--mono)", color: "#ffffff" }}>{log.reference || "-"}</td>
                      <td style={{ padding: "10px 14px", color: "#d4d4d8" }}>{log.actor} ({log.ip})</td>
                      <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{JSON.stringify(log.details)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
