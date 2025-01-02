import axios from "axios";
import { Note, Category, NewNote } from "../App";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://appnotes-backend.onrender.com/api";

// Configuración global de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- NOTES ----------
export const fetchNotes = async (): Promise<Note[]> => {
  const response = await axiosInstance.get("/notes");
  return response.data;
};

export const addNote = async (newNote: NewNote): Promise<Note> => {
  const response = await axiosInstance.post("/notes", newNote);
  return response.data;
};

export const updateNote = async (
  id: number,
  updatedNote: Partial<Note>
): Promise<Note> => {
  const response = await axiosInstance.put(`/notes/${id}`, updatedNote);
  return response.data;
};

export const patchNote = async (
  id: number,
  partialNote: Partial<Note>
): Promise<Note> => {
  const response = await axiosInstance.patch(`/notes/${id}`, partialNote);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/notes/${id}`);
};

// ---------- CATEGORIES ----------
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

export const addCategory = async (newCategory: Category): Promise<Category> => {
  const response = await axiosInstance.post("/categories", newCategory);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};

// ---------- AUTH ----------
export const login = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};
