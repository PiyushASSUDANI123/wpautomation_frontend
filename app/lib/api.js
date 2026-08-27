import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// Contacts
// ============================================

export const getContacts = () => api.get("/api/contacts");

export const getContact = (id) => api.get(`/api/contacts/${id}`);

// ============================================
// Messages
// ============================================

export const getMessages = (contactId, limit = 100, offset = 0) =>
  api.get(`/api/messages/${contactId}`, { params: { limit, offset } });

export const sendMessage = (contactId, message) =>
  api.post(`/api/messages/${contactId}`, { message });

export const sendTemplate = (contactId, templateName, languageCode = "en_US") =>
  api.post(`/api/messages/${contactId}/template`, {
    template_name: templateName,
    language_code: languageCode,
  });

// ============================================
// Campaigns
// ============================================

export const getCampaigns = () => api.get("/api/campaigns");

export const getCampaign = (id) => api.get(`/api/campaigns/${id}`);

export const createCampaign = (formData) =>
  api.post("/api/campaigns", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ============================================
// Templates
// ============================================

export const getTemplates = () => api.get("/api/templates");

export default api;
