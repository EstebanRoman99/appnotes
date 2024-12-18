import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// notes

export const fetchNotes = async () => {
  const response = await axios.get(`${API_BASE_URL}/notes`);
  return response.data;
};

export const addNote = async (newNote: any) => {
  const response = await axios.post(`${API_BASE_URL}/notes`, newNote, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateNote = async (id: number, updatedNote: any) => {
  const response = await axios.put(`${API_BASE_URL}/notes/${id}`, updatedNote, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const patchNote = async (id: number, partialNote: any) => {
  const response = await axios.patch(
    `${API_BASE_URL}/notes/${id}`,
    partialNote,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const deleteNote = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/notes/${id}`);
};

// categories

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
};

export const addCategory = async (newCategory: any) => {
  const response = await axios.post(`${API_BASE_URL}/categories`, newCategory, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/categories/${id}`);
};

// auth

export const login = async (username: string, password: string) => {
  const response = await axios.post("http://localhost:8080/api/auth/login", {
    username,
    password,
  });
  return response.data;
};
