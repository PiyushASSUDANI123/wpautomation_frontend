"use client";

import { useState, useEffect, useCallback } from "react";
import { getContacts, getMessages } from "../lib/api";
import { getSocket } from "../lib/socket";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [windowInfo, setWindowInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      const res = await getContacts();
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a contact
  const fetchMessages = useCallback(async (contactId) => {
    setMessagesLoading(true);
    try {
      const res = await getMessages(contactId);
      setMessages(res.data.messages);
      setWindowInfo(res.data.window);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Select a contact
  const handleSelectContact = useCallback(
    (contact) => {
      setSelectedContact(contact);
      fetchMessages(contact.id);
    },
    [fetchMessages]
  );

  // Initial load
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Socket.io real-time updates
  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (msg) => {
      // Update messages if viewing this contact's chat
      if (selectedContact && msg.contact_id === selectedContact.id) {
        setMessages((prev) => [...prev, msg]);

        // If inbound, update window info
        if (msg.direction === "inbound") {
          setWindowInfo((prev) => ({
            ...prev,
            open: true,
            last_inbound_at: msg.timestamp,
            expires_at: new Date(
              new Date(msg.timestamp).getTime() + 24 * 60 * 60 * 1000
            ).toISOString(),
          }));
        }
      }

      // Update contacts list (move to top, update last message)
      setContacts((prev) => {
        const idx = prev.findIndex((c) => c.id === msg.contact_id);
        if (idx === -1) {
          // New contact - prepend
          return [
            {
              id: msg.contact_id,
              phone_number: msg.contact_phone,
              name: msg.contact_name,
              last_message: msg.message_body,
              last_message_direction: msg.direction,
              last_message_time: msg.timestamp,
              unread_count: msg.direction === "inbound" ? 1 : 0,
            },
            ...prev,
          ];
        }

        const updated = [...prev];
        const contact = {
          ...updated[idx],
          last_message: msg.message_body,
          last_message_direction: msg.direction,
          last_message_time: msg.timestamp,
        };

        // Increment unread only if not currently viewing
        if (
          msg.direction === "inbound" &&
          (!selectedContact || selectedContact.id !== msg.contact_id)
        ) {
          contact.unread_count = (contact.unread_count || 0) + 1;
        }

        // Remove from current position and prepend
        updated.splice(idx, 1);
        return [contact, ...updated];
      });
    };

    const handleStatusUpdate = (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.meta_message_id === data.meta_message_id
            ? { ...m, status: data.status }
            : m
        )
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_status", handleStatusUpdate);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_status", handleStatusUpdate);
    };
  }, [selectedContact]);

  // Message sent callback
  const handleMessageSent = (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.phone_number?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.last_message?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <ChatSidebar
        contacts={filteredContacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
      />

      {selectedContact ? (
        <ChatWindow
          contact={selectedContact}
          messages={messages}
          windowInfo={windowInfo}
          loading={messagesLoading}
          onMessageSent={handleMessageSent}
        />
      ) : (
        <div className="chat-window">
          <div className="chat-window-empty">
            <div className="empty-icon">
              <MessageCircle size={32} />
            </div>
            <h2>MAA AAINATH GOU SEVA SAMITI BALOTRA</h2>
            <p>
              Select a contact from the sidebar to view your conversation
              history and send messages. Inbound messages will appear here in
              real-time.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
