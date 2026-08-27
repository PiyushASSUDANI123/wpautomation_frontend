"use client";

import { useState, useEffect } from "react";
import { Reply, UserCircle2 } from "lucide-react";
import api from "../lib/api";
import { format } from "date-fns";
import Link from "next/link";

export default function RepliesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await api.get("/api/messages/inbound");
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch replies:", err);
        setError("Failed to load inbound replies.");
      } finally {
        setLoading(false);
      }
    };
    fetchReplies();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Inbound Replies</h1>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : error ? (
          <div className="window-warning">
            <span className="window-warning-text">{error}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-window-empty" style={{ background: "transparent" }}>
            <div className="empty-icon" style={{ background: "rgba(255, 153, 51, 0.1)" }}>
              <Reply size={32} />
            </div>
            <h2>No replies yet</h2>
            <p>When customers reply to your campaigns, their messages will appear here in a unified feed.</p>
          </div>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.map((msg) => (
              <div key={msg.id} className="ui-card animate-slide-in" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                      <UserCircle2 size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "16px" }}>
                        {msg.name || `+${msg.phone_number}`}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {format(new Date(msg.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  </div>
                  <Link href={`/chat?contact=${msg.contact_id}`} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    Open Chat
                  </Link>
                </div>
                
                <div style={{ padding: "16px", background: "var(--bg-chat)", borderRadius: "12px", border: "1px solid var(--border-color)", fontSize: "15px", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  {msg.message_body || "Media/Attachment received"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
