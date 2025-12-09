import api from "./axios";

export const getRecipients = (filters = {}) => api.get("recipients/", { params: filters });
