"use client";

import { Search } from "lucide-react";
import ContactItem from "./ContactItem";

export default function ChatSidebar({
  contacts,
  selectedContact,
  onSelectContact,
  searchQuery,
  onSearchChange,
  loading,
}) {
  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h1 className="chat-sidebar-title">Chats</h1>
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="contact-list">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : contacts.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            <p style={{ fontSize: "14px" }}>
              {searchQuery
                ? "No contacts match your search"
                : "No contacts yet. Incoming messages will appear here."}
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={selectedContact?.id === contact.id}
              onClick={() => onSelectContact(contact)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
