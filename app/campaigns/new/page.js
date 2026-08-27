"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Megaphone, ArrowLeft, X, Image } from "lucide-react";
import api from "../../lib/api";

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [languageCode, setLanguageCode] = useState("en_US");
  const [contactListId, setContactListId] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  
  const [contactLists, setContactLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listsRes, templatesRes] = await Promise.all([
          api.get("/api/contact_lists"),
          api.get("/api/templates")
        ]);
        setContactLists(listsRes.data);
        setTemplates(templatesRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load required data. Please refresh and try again.");
      } finally {
        setLoadingLists(false);
        setLoadingTemplates(false);
      }
    };
    fetchData();
  }, []);

  const handleTemplateSelect = (e) => {
    const selected = templates.find(t => t.name === e.target.value);
    if (selected) {
      setTemplateName(selected.name);
      setLanguageCode(selected.language);
    } else {
      setTemplateName("");
      setLanguageCode("en_US");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !templateName.trim() || !contactListId) {
      setError("Please fill all fields and select a contact list");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("template_name", templateName.trim());
      formData.append("language_code", languageCode);
      formData.append("contact_list_id", contactListId);
      if (mediaFile) {
        formData.append("mediaFile", mediaFile);
      }

      const res = await api.post("/api/campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(
        `Campaign "${res.data.campaign.name}" launched! Processing ${res.data.campaign.total_recipients} recipients...`
      );

      // Redirect after short delay
      setTimeout(() => {
        router.push("/campaigns");
      }, 2000);
    } catch (err) {
      console.error("Campaign creation failed:", err);
      setError(err.response?.data?.error || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/campaigns" className="btn-secondary" style={{ padding: "10px" }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="page-title">Launch Campaign</h1>
        </div>
      </div>

      <div className="page-content" style={{ maxWidth: "720px" }}>
        <div className="ui-card">
          <form onSubmit={handleSubmit}>
            {/* Error */}
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

            {/* Success */}
            {success && (
              <div style={{ padding: "16px", background: "var(--bubble-outbound)", border: "1px solid var(--secondary-accent-muted)", borderRadius: "12px", marginBottom: "24px", color: "var(--secondary-accent)", fontSize: "15px", fontWeight: "600" }}>
                ✅ {success}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Campaign Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., Diwali Offer 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meta Template</label>
              {loadingTemplates ? (
                <div style={{ padding: "14px 16px", background: "var(--bg-tertiary)", borderRadius: "12px", color: "var(--text-secondary)" }}>
                  Fetching approved templates from Meta...
                </div>
              ) : templates.length === 0 ? (
                <div style={{ padding: "16px", background: "var(--warning-bg)", borderRadius: "12px", color: "var(--warning-text)" }}>
                  No approved templates found in your Meta account.
                </div>
              ) : (
                <select
                  className="form-select"
                  value={templateName}
                  onChange={handleTemplateSelect}
                  required
                >
                  <option value="" disabled>-- Select a template --</option>
                  {templates.map((tpl) => (
                    <option key={`${tpl.name}-${tpl.language}`} value={tpl.name}>
                      {tpl.name} ({tpl.language})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group" style={{ background: "var(--bg-tertiary)", padding: "20px", borderRadius: "12px", border: "1px dashed var(--border-color)", marginBottom: "24px" }}>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image size={18} color="var(--accent)" />
                Attach Media (Optional)
              </label>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                Only attach media if your Meta template requires a media header (Image, Video, or PDF). Max 16MB.
              </p>
              <input
                type="file"
                className="form-input"
                style={{ padding: "8px", background: "var(--bg-primary)" }}
                accept="image/*,video/*,application/pdf"
                onChange={(e) => setMediaFile(e.target.files[0] || null)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Contact List (Sheet)</label>
              {loadingLists ? (
                <div style={{ padding: "14px 16px", background: "var(--bg-tertiary)", borderRadius: "12px", color: "var(--text-secondary)" }}>
                  Loading lists...
                </div>
              ) : contactLists.length === 0 ? (
                <div style={{ padding: "16px", background: "var(--warning-bg)", borderRadius: "12px", color: "var(--warning-text)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>No contact lists found. Please upload a sheet first.</span>
                  <Link href="/contacts" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    Go to Contacts
                  </Link>
                </div>
              ) : (
                <select
                  className="form-select"
                  value={contactListId}
                  onChange={(e) => setContactListId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Select a saved sheet --</option>
                  {contactLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.member_count || 0} contacts)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting || !name.trim() || !templateName.trim() || !contactListId}
              >
                {submitting ? (
                  <>
                    <div className="loading-spinner" style={{ width: "18px", height: "18px", borderWidth: "3px" }} />
                    Starting...
                  </>
                ) : (
                  <>
                    <Megaphone size={18} />
                    Launch Campaign
                  </>
                )}
              </button>
              <Link href="/campaigns" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
