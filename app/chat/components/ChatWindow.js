"use client";

import { useRef, useEffect } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  contact,
  messages,
  windowInfo,
  loading,
  onMessageSent,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDateLabel = (date) => {
    const d = new Date(date);
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMMM d, yyyy");
  };

  // Group messages by date for date separators
  const renderMessages = () => {
    if (!messages || messages.length === 0) {
      return (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          No messages yet
        </div>
      );
    }

    const elements = [];
    let lastDate = null;

    messages.forEach((msg, idx) => {
      const msgDate = new Date(msg.timestamp);

      if (!lastDate || !isSameDay(lastDate, msgDate)) {
        elements.push(
          <div className="date-separator" key={`date-${idx}`}>
            <span className="date-separator-label">
              {formatDateLabel(msgDate)}
            </span>
          </div>
        );
        lastDate = msgDate;
      }

      elements.push(<MessageBubble key={msg.id || idx} message={msg} />);
    });

    return elements;
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="contact-avatar">
          {contact.name
            ? contact.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .substring(0, 2)
            : contact.phone_number?.slice(-2)}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">
            {contact.name || contact.phone_number}
          </div>
          <div className="chat-header-phone">
            {contact.name ? contact.phone_number : ""}
            {windowInfo?.open && (
              <span
                style={{
                  marginLeft: "8px",
                  color: "var(--accent)",
                  fontSize: "12px",
                }}
              >
                ● Window open
              </span>
            )}
            {windowInfo && !windowInfo.open && (
              <span
                style={{
                  marginLeft: "8px",
                  color: "var(--warning-text)",
                  fontSize: "12px",
                }}
              >
                ● Window closed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : (
          <>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        contactId={contact.id}
        windowInfo={windowInfo}
        onMessageSent={onMessageSent}
      />
    </div>
  );
}
