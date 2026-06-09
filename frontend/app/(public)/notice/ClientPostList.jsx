"use client";

import Link from "next/link";

export default function NoticePage() {
  return (
    <div className="ps-page--single" id="about-us">
      <div className="mt-5">
        <div className="container">

          {/* Page Header */}
          <div className="ps-section__header" style={{ borderBottom: "2px solid #1a3c6e", paddingBottom: "16px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "28px", fontWeight: 700, color: "#1a3c6e", margin: "0 0 4px" }}>
              Posting Date: 09-Jun-2024
            </h3>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Employment Opportunities</p>
          </div>

          {/* Job Card */}
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "32px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            marginBottom: "40px"
          }}>

            {/* Title & Badges */}
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>
                SAP Security Consultant <span style={{ fontWeight: 400, color: "#6b7280" }}>(Multiple Positions)</span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  { label: "Full Time", bg: "#eff6ff", color: "#1d4ed8" },
                  { label: "Mon–Fri · 40 hrs/wk · 8:00 AM–5:30 PM", bg: "#f0fdf4", color: "#15803d" },
                  { label: "Houston, TX", bg: "#fef9c3", color: "#854d0e" },
                ].map((badge) => (
                  <span key={badge.label} style={{
                    display: "inline-flex", alignItems: "center",
                    fontSize: "12px", fontWeight: 500,
                    padding: "4px 10px", borderRadius: "20px",
                    background: badge.bg, color: badge.color
                  }}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "20px 0" }} />

            {/* Responsibilities */}
            <SectionLabel>Responsibilities</SectionLabel>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "Design and build security roles and authorizations for ERP systems to ensure appropriate user access based on business and compliance requirements.",
                "Define and manage application-specific access controls supporting both analytical and transactional applications.",
                "Develop and maintain user provisioning and de-provisioning processes, including workflows for pre- and post-implementation phases.",
                "Collaborate with technical and functional teams to troubleshoot and resolve authorization and access-related issues.",
                "Coordinate with project teams to ensure consistent role mapping and access configurations across all system environments (development, testing, production).",
                "Analyze segregation-of-duties (SoD) conflicts and implement mitigating controls to ensure compliance with internal audit and regulatory standards.",
                "Integrate enterprise identity management systems with business applications to support single sign-on and secure authentication.",
                "Support internal and external audit activities by generating access reports and providing evidence of compliance.",
                "Collaborate with IT governance and compliance teams to align system security with corporate policies and industry best practices.",
                "Provide post-implementation support for security configuration and access-related issues.",
              ].map((duty, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#374151", lineHeight: 1.65 }}>
                  <span style={{ color: "#1a3c6e", fontWeight: 600, flexShrink: 0 }}>→</span>
                  {duty}
                </li>
              ))}
            </ul>

            <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "20px 0" }} />

            {/* Travel */}
            <SectionLabel>Travel Requirements</SectionLabel>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, margin: 0 }}>
              Up to 25% limited domestic travel per year to various client sites across the U.S., based on client and/or project requirements.
            </p>

            <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "20px 0" }} />

            {/* Education & Experience */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <InfoBlock label="Education">
                Bachelor&apos;s Degree in Science, Technology, Computer Science, or Engineering
              </InfoBlock>
              <InfoBlock label="Experience Required">
                3 Years in relevant SAP security roles
              </InfoBlock>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "20px 0" }} />

            {/* Technical Skills */}
            <SectionLabel>Required Technical Skills</SectionLabel>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, margin: 0 }}>
              SAP S/4HANA · HANA Database · SAP Analytics Cloud (SAC) · BPC · Fiori · BTP · Datasphere ·
              SAP GRC Access Control 12.0 (MSMP Workflow, Firefighter, ARM, EAM, BRM, ARA) ·
              SoD Analysis Tools · SAP IAS/IPS · LDAP · Single Sign-On (SSO)
            </p>

            {/* Contact / Apply Box */}
            <div style={{
              background: "#1a3c6e",
              borderRadius: "8px",
              padding: "20px 24px",
              marginTop: "24px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ color: "#e0e9ff", fontSize: "13px", lineHeight: 1.6 }}>
                <strong style={{ color: "#fff", display: "block", marginBottom: "6px", fontSize: "14px" }}>
                  How to Apply
                </strong>
                Send your resume to <strong style={{ color: "#fff" }}>Astute 360 Corporation</strong> with subject line:{" "}
                <strong style={{ color: "#fff" }}>Attn: HR (Ref Code: SAP26)</strong>
                <br />
                <a href="mailto:hr@astute360corp.com" style={{ color: "#93c5fd" }}>
                  hr@astute360corp.com
                </a>
                {" · "}
                6065 Hillcroft Street, Suite 410, Houston, TX 77081
                <div style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.12)",
                  color: "#cbd5e1",
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  marginTop: "8px"
                }}>
                  Ref: SAP26
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small helper components ──────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: "11px", fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      color: "#9ca3af", margin: "0 0 10px"
    }}>
      {children}
    </p>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "16px" }}>
      <p style={{
        fontSize: "11px", fontWeight: 600,
        letterSpacing: "0.07em", textTransform: "uppercase",
        color: "#9ca3af", margin: "0 0 6px"
      }}>
        {label}
      </p>
      <p style={{ fontSize: "14px", color: "#111827", fontWeight: 500, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}