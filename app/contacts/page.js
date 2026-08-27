"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Users, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import api from "../lib/api";
import { format } from "date-fns";

export default function ContactsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Upload State
  const fileInputRef = useRef(null);
  const [listName, setListName] = useState("");
  const [file, setFile] = useState(null);
  const [dragover, setDragover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchLists = async () => {
    try {
      const res = await api.get("/api/contact_lists");
      setLists(res.data);
    } catch (err) {
      console.error("Failed to fetch contact lists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (f) => {
    if (!f.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError("Only Excel (.xlsx, .xls) and CSV files are allowed");
      return;
    }
    setFile(f);
    setError(null);
    // Auto-fill name if empty
    if (!listName) {
      setListName(f.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!listName.trim() || !file) {
      setError("Please provide a name and select a file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", listName.trim());
      formData.append("file", file);

      await api.post("/api/contact_lists", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("List saved successfully!");
      fetchLists();
      
      setTimeout(() => {
        setShowUploadModal(false);
        setSuccess(null);
        setFile(null);
        setListName("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload list");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Contact Lists</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowUploadModal(true)}
        >
          <Upload size={18} />
          Upload New Sheet
        </button>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : lists.length === 0 ? (
          <div className="chat-window-empty" style={{ background: "transparent" }}>
            <div className="empty-icon">
              <Users size={32} />
            </div>
            <h2>No contact lists yet</h2>
            <p>Upload an Excel or CSV file to save your contacts. You can select these lists when running campaigns.</p>
            <button 
              className="btn-primary" 
              style={{ marginTop: "16px" }}
              onClick={() => setShowUploadModal(true)}
            >
              Upload Sheet
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {lists.map((list) => (
              <div key={list.id} className="ui-card animate-fade-in">
                <div className="ui-card-header">
                  <h3 className="ui-card-title">{list.name}</h3>
                  <div className="ui-card-badge">
                    {list.member_count || 0} Contacts
                  </div>
                </div>
                <div className="ui-card-subtitle" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px" }}>
                  <FileSpreadsheet size={16} />
                  Created: {format(new Date(list.created_at), "MMM d, yyyy")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => !uploading && setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Upload Contact Sheet</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                disabled={uploading}
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="window-warning">
                <span className="window-warning-text">{error}</span>
              </div>
            )}

            {success && (
              <div style={{ padding: "12px", background: "var(--bubble-outbound)", color: "var(--secondary-accent)", borderRadius: "12px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">List Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Diwali 2026 Contacts, Sheet 1"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  disabled={uploading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Excel / CSV File</label>
                {file ? (
                  <div style={{ padding: "16px", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <FileSpreadsheet size={24} style={{ color: "var(--accent)" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                      onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      disabled={uploading}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`upload-zone ${dragover ? "dragover" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                    onDragLeave={() => setDragover(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: "32px 20px" }}
                  >
                    <div className="upload-icon" style={{ width: "56px", height: "56px", marginBottom: "16px" }}>
                      <Upload size={24} />
                    </div>
                    <h3 style={{ fontSize: "16px" }}>Drop file or click to browse</h3>
                    <p style={{ fontSize: "13px" }}>Supports .xlsx, .xls, .csv</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </div>

              <div className="modal-actions" style={{ marginTop: "24px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={uploading || !listName.trim() || !file}
                >
                  {uploading ? "Saving..." : "Save List"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
