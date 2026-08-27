"use client";

import { useState } from "react";
import { UserCog, Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";
import api from "../lib/api";

export default function SettingsPage() {
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.put("/api/auth/profile", {
        currentUsername,
        currentPassword,
        newUsername,
        newPassword
      });

      setSuccess("Profile updated successfully! Please use new credentials on your next login.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
      </div>

      <div className="page-content" style={{ maxWidth: "600px" }}>
        <div className="ui-card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
              <UserCog size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-primary)" }}>Update Credentials</h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Change your login ID and password here.</p>
            </div>
          </div>

          {error && (
            <div className="window-warning" style={{ marginBottom: "20px" }}>
              <span className="window-warning-text">{error}</span>
            </div>
          )}

          {success && (
            <div style={{ padding: "12px 16px", backgroundColor: "rgba(76, 175, 80, 0.1)", border: "1px solid var(--status-delivered)", borderRadius: "12px", color: "var(--status-delivered)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>Current Credentials</h3>
            
            <div className="form-group">
              <label className="form-label">Current ID / Username</label>
              <input
                type="text"
                className="form-input"
                value={currentUsername}
                onChange={(e) => setCurrentUsername(e.target.value)}
                placeholder="Enter current ID"
                required
              />
            </div>
            
            <div className="form-group" style={{ position: "relative" }}>
              <label className="form-label">Current Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="form-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: "24px 0 16px", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>New Credentials</h3>

            <div className="form-group">
              <label className="form-label">New ID / Username</label>
              <input
                type="text"
                className="form-input"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new ID"
                required
              />
            </div>

            <div className="form-group" style={{ position: "relative", marginBottom: "32px" }}>
              <label className="form-label">New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "center", gap: "8px" }} disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ width: "20px", height: "20px", borderWidth: "3px" }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
