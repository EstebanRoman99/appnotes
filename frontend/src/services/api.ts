import axios from "axios";

// Define la URL base desde una variable de entorno o valor por defecto
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://appnotes-backend.onrender.com/api";

// Configuración global de axios (puedes agregar headers comunes aquí)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- NOTES ----------
export const fetchNotes = async () => {
  const response = await axiosInstance.get("/notes");
  return response.data;
};

export const addNote = async (newNote: any) => {
  const response = await axiosInstance.post("/notes", newNote);
  return response.data;
};

export const updateNote = async (id: number, updatedNote: any) => {
  const response = await axiosInstance.put(`/notes/${id}`, updatedNote);
  return response.data;
};

export const patchNote = async (id: number, partialNote: any) => {
  const response = await axiosInstance.patch(`/notes/${id}`, partialNote);
  return response.data;
};

export const deleteNote = async (id: number) => {
  await axiosInstance.delete(`/notes/${id}`);
};

// ---------- CATEGORIES ----------
export const fetchCategories = async () => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

export const addCategory = async (newCategory: any) => {
  const response = await axiosInstance.post("/categories", newCategory);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};

// ---------- AUTH ----------
export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};
