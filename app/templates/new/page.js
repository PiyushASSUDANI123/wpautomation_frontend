"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Megaphone, LayoutTemplate, X } from "lucide-react";
import api from "../../lib/api";

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("MARKETING");
  const [language, setLanguage] = useState("en_US");
  const [bodyText, setBodyText] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !bodyText.trim()) {
      setError("Please provide a template name and message body.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/api/templates", {
        name: name.trim(),
        language,
        category,
        text: bodyText.trim()
      });

      setSuccess(`Template submitted to Meta successfully! It will appear in the templates list once approved (usually takes 1-2 minutes).`);

      setTimeout(() => {
        router.push("/templates");
      }, 3000);
    } catch (err) {
      console.error("Template creation failed:", err);
      setError(err.response?.data?.error || "Failed to submit template to Meta.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/templates" className="btn-secondary" style={{ padding: "10px" }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="page-title">Create Custom Template</h1>
        </div>
      </div>

      <div className="page-content" style={{ maxWidth: "720px" }}>
        <div className="ui-card">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="window-warning" style={{ marginBottom: "24px" }}>
                <span className="window-warning-text">{error}</span>
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  onClick={() => setError(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {success && (
              <div style={{ padding: "16px", background: "var(--bubble-outbound)", border: "1px solid var(--secondary-accent-muted)", borderRadius: "12px", marginBottom: "24px", color: "var(--secondary-accent)", fontSize: "15px", fontWeight: "600" }}>
                ✅ {success}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Template Name</label>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                Use only lowercase letters, numbers, and underscores (e.g., `diwali_offer_2026`). No spaces allowed.
              </p>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., diwali_offer_2026"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="MARKETING">Marketing (Promotions, Offers)</option>
                  <option value="UTILITY">Utility (Updates, Confirmations)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  className="form-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="en_US">English (US)</option>
                  <option value="en_GB">English (UK)</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                  <option value="gu">Gujarati</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message Body</label>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                Enter the exact text you want to send. (Variables like {'{{1}}'} are currently not supported in this simple builder).
              </p>
              <textarea
                className="form-input"
                rows={6}
                placeholder="Hello! We have a special offer for you..."
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting || !name.trim() || !bodyText.trim()}
              >
                {submitting ? (
                  <>
                    <div className="loading-spinner" style={{ width: "18px", height: "18px", borderWidth: "3px" }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <LayoutTemplate size={18} />
                    Submit to Meta
                  </>
                )}
              </button>
              <Link href="/templates" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
