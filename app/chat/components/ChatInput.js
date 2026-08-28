"use client";

import { useState } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { sendMessage, sendTemplate } from "../../lib/api";

export default function ChatInput({ contactId, windowInfo, onMessageSent }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSending, setTemplateSending] = useState(false);

  const isWindowClosed = windowInfo && !windowInfo.open;

  const handleSend = async () => {
    if (!text.trim() || sending || isWindowClosed) return;

    setSending(true);
    try {
      const res = await sendMessage(contactId, text.trim());
      onMessageSent(res.data);
      setText("");
    } catch (err) {
      console.error("Send failed:", err);
      if (err.response?.data?.window_closed) {
        // Window just closed - UI will update via socket
        alert("24-hour window has closed. Please send a template message.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendTemplate = async () => {
    if (!templateName.trim() || templateSending) return;

    setTemplateSending(true);
    try {
      const res = await sendTemplate(contactId, templateName.trim());
      onMessageSent(res.data);
      setTemplateName("");
      setShowTemplateModal(false);
    } catch (err) {
      console.error("Template send failed:", err);
      alert(err.response?.data?.error || "Failed to send template");
    } finally {
      setTemplateSending(false);
    }
  };

  return (
    <div className="chat-input-container">
      {}
      {isWindowClosed && (
        <div className="window-warning">
          <AlertTriangle size={18} style={{ color: "var(--warning-text)", minWidth: "18px" }} />
          <span className="window-warning-text">
            24-hour window closed. Send a template to restart chat.
          </span>
          <button
            className="template-btn"
            onClick={() => setShowTemplateModal(true)}
          >
            Send Template
          </button>
        </div>
      )}

      {}
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          placeholder={
            isWindowClosed
              ? "Window closed — use template to restart"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isWindowClosed || sending}
          rows={1}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!text.trim() || isWindowClosed || sending}
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      {}
      {showTemplateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowTemplateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Send Template Message</h3>
            <div className="form-group">
              <label className="form-label">Template Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., hello_world"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowTemplateModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSendTemplate}
                disabled={!templateName.trim() || templateSending}
              >
                {templateSending ? "Sending..." : "Send Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
