import api from "./axios";

export const getItems = async () => {
  const { data } = await api.get("/items");
  return data;
};

export const getItemById = async (id) => {
  const { data } = await api.get(`/items/${id}`);
  return data;
};

export const createItem = async (payload) => {
  const { data } = await api.post("/items", payload);
  return data;
};

export const updateItem = async (id, payload) => {
  const { data } = await api.put(`/items/${id}`, payload);
  return data;
};

export const deleteItem = async (id) => {
  const { data } = await api.delete(`/items/${id}`);
  return data;
};

export const getStats = async () => {
  const { data } = await api.get("/stats");
  return data;
};
