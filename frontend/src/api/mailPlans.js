import api from "./axios";

export const getMailPlans = () => api.get("/mail/plans/");
export const createMailPlan = (data) => api.post("/mail/plans/create/", data);
export const updateMailPlan = (id, data) => api.put(`/mail/plans/${id}/update/`, data);
export const getMailPlan = (id) => api.get(`/mail/plans/${id}/`);
export const deleteMailPlan = (id) => api.delete(`/mail/plans/${id}/`);
export const runMailPlan = (id) => api.post(`/mail/plans/${id}/run/`);
