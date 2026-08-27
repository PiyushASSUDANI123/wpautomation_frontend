"use client";

import { format } from "date-fns";
import { Check, CheckCheck, X } from "lucide-react";

export default function MessageBubble({ message }) {
  const isOutbound = message.direction === "outbound";

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), "HH:mm");
    } catch {
      return "";
    }
  };

  const renderStatus = () => {
    if (!isOutbound) return null;

    switch (message.status) {
      case "sent":
        return (
          <span className="message-status sent">
            <Check size={14} />
          </span>
        );
      case "delivered":
        return (
          <span className="message-status delivered">
            <CheckCheck size={14} />
          </span>
        );
      case "read":
        return (
          <span className="message-status read">
            <CheckCheck size={14} />
          </span>
        );
      case "failed":
        return (
          <span className="message-status failed">
            <X size={14} />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`message-row ${isOutbound ? "outbound" : "inbound"} animate-fade-in`}
    >
      <div className={`message-bubble ${isOutbound ? "outbound" : "inbound"}`}>
        <div className="message-text">{message.message_body}</div>
        <div className="message-meta">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
