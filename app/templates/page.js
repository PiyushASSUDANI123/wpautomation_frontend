"use client";

import { useState, useEffect } from "react";
import { getTemplates } from "../lib/api";
import { LayoutTemplate, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function TemplateLibraryPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await getTemplates();
      setTemplates(res.data || []);
    } catch (err) {
      setError("Failed to fetch templates. Make sure your Meta API credentials are correct.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 size={12} /> Approved</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> Pending</span>;
      case "REJECTED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Template Library</h1>
        <button onClick={fetchTemplates} disabled={loading} className="btn-secondary">
          Refresh Templates
        </button>
      </div>

      <div className="page-content">
        {error && (
          <div style={{ background: "rgba(255, 0, 0, 0.1)", color: "red", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : templates.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 20px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                background: "var(--bg-tertiary)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                color: "var(--accent)",
              }}
            >
              <LayoutTemplate size={32} />
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              No templates found
            </h2>
            <p style={{ fontSize: "14px", maxWidth: "400px", lineHeight: 1.6 }}>
              Create templates in your WhatsApp Business Manager.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {templates.map((template) => (
              <div key={template.id} className="ui-card animate-fade-in" style={{ display: "flex", flexDirection: "column", padding: "0" }}>
                <div className="ui-card-header" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 className="ui-card-title">{template.name}</h3>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {template.language}
                    </div>
                  </div>
                  <div>
                    {renderStatus(template.status)}
                  </div>
                </div>
                
                <div style={{ padding: "20px", flex: "1", background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {template.components.map((comp, idx) => (
                      <div key={idx} style={{ fontSize: "14px" }}>
                        <span style={{ fontWeight: "600", color: "var(--text-secondary)", textTransform: "capitalize", marginRight: "8px" }}>{comp.type}:</span>
                        {comp.format === "IMAGE" || comp.format === "VIDEO" || comp.format === "DOCUMENT" ? (
                          <span style={{ color: "var(--accent)", fontWeight: "600" }}>[{comp.format} MEDIA]</span>
                        ) : (
                          <span style={{ color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>{comp.text}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ padding: "12px 20px", fontSize: "12px", color: "var(--text-muted)" }}>
                  Category: {template.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
