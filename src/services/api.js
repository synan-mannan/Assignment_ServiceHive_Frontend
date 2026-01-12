import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const authAPI = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    
    return response.data;
  },
};

export const gigsAPI = {
  getGigs: async (title = "") => {
    const response = await api.get("/gigs", {
      params: { title },
    });
    return response.data;
  },

  getGig: async (id) => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  createGig: async (data) => {
    const response = await api.post("/gigs", data);
    return response.data;
  },
};

export const bidsAPI = {
  submitBid: async (data) => {
    const response = await api.post("/bids", data);
    return response.data;
  },

  getBidsForGig: async (gigId) => {
    const response = await api.get(`/bids/${gigId}`);
    return response.data;
  },

  hireBid: async (bidId) => {
    const response = await api.patch(`/bids/${bidId}/hire`);
    return response.data;
  },
};

export default api;
