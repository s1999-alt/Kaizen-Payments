import api from "./axios";

export const getMailPlans = () => api.get("plans/");
export const createMailPlan = (data) => api.post("plans/create/", data);
export const updateMailPlan = (id, data) => api.put(`plans/${id}/update/`, data);
export const getMailPlan = (id) => api.get(`plans/${id}/`);
export const deleteMailPlan = (id) => api.delete(`plans/${id}/`);
