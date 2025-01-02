import React, { useState } from "react";
import NoteCard from "../components/NoteCard";
import { Note, Category, NewCategory } from "../App";
import { updateNote } from "../services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addCategory, fetchCategories, deleteCategory } from "../services/api";
import { fetchNotes } from "../services/api";
import Swal from "sweetalert2";
import axios from "axios";

interface HomeProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  handleArchive: (id: number) => void;
  handleDelete: (id: number) => void;
  handleAddNote: (
    title: string,
    description: string,
    selectedCategoryIds: number[]
  ) => Promise<void>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const Home: React.FC<HomeProps> = ({
  notes,
  setNotes,
  handleArchive,
  handleDelete,
  handleAddNote,
  categories,
  setCategories,
}) => {
  // validation de Yup
  const noteSchema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    categories: yup
      .array()
      .of(
        yup.lazy((value) =>
          typeof value === "string"
            ? yup.string()
            : yup.object({
                id: yup.number().required("Category ID is required"),
              })
        )
      )
      .required("Select at least one category"),
  });

  // state add notes
  const [isAdding, setIsAdding] = useState(false);

  // state edit notes
  const [isEditing, setIsEditing] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  // filter state
  const [filterCategory, setFilterCategory] = useState<string>("");
  const filteredNotes = filterCategory
    ? notes.filter((note) =>
        note.categories.some((category) => category.name === filterCategory)
      )
    : notes;

  // react-hook-form para Add Note
  const {
    register: addRegister,
    handleSubmit: addHandleSubmit,
    reset: addReset,
    formState: { errors: addErrors },
  } = useForm({
    resolver: yupResolver(noteSchema),
  });

  interface AddNoteFormData {
    title: string;
    description: string;
    categories: string[];
  }

  const onAddSubmit = (data: AddNoteFormData) => {
    try {
      console.log("Adding note...", data);

      const selectedCategoryIds =
        data.categories?.map((id: string) => parseInt(id, 10)) || [];

      // Llamamos a la función para agregar la nota
      handleAddNote(data.title, data.description, selectedCategoryIds);

      // Cerrar formulario y resetear
      setIsAdding(false);
      addReset();

      console.log("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<AddNoteFormData>({
    resolver: yupResolver(noteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      description: noteToEdit?.description || "",
      categories:
        noteToEdit?.categories.map((cat) =>
          typeof cat === "string" ? cat : cat.id.toString()
        ) || [], // Convertir objetos a cadenas
    },
  });

  const handleEdit = (note: Note) => {
    setNoteToEdit(note);
    editReset({ ...note, categories: note.categories || [] });
    setIsEditing(true);
  };

  // Post Edit
  const onEditSubmit = async (data: AddNoteFormData) => {
    if (noteToEdit) {
      const formattedCategories = (data.categories || []).map((categoryId) => ({
        id: parseInt(categoryId, 10), // Convertir de string a número
        name: "", // Backend no requiere el nombre en este caso
      }));

      const updatedData = {
        ...data,
        categories: formattedCategories, // Categorías formateadas
      };

      try {
        console.log("Datos enviados al backend:", updatedData);
        const updatedNote = await updateNote(noteToEdit.id, updatedData);

        setNotes(
          notes.map((note) => (note.id === noteToEdit.id ? updatedNote : note))
        );

        setIsEditing(false);
        setNoteToEdit(null);
        console.log("Note updated successfully!");
      } catch (error) {
        console.error("Error updating the note:", error);
      }
    }
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // add category

  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = async (name: string) => {
    try {
      const newCategory: NewCategory = { name }; // Solo enviamos el campo "name"
      await addCategory(newCategory);

      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);

      Swal.fire({
        title: "Success!",
        text: "Category added successfully!",
        icon: "success",
        confirmButtonColor: "#4CAF50",
      });

      setIsAddingCategory(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        Swal.fire({
          title: "Oops!",
          text: "The category already exists!",
          icon: "warning",
          confirmButtonColor: "#F44336",
        });
      } else {
        console.error("Error adding category:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#F44336",
        });
      }
    }
  };

  // delete categories

  const [isManagingCategories, setIsManagingCategories] = useState(false);

  const handleDeleteCategory = async (id: number) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the category and reassign related notes to 'Uncategorized'.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmation.isConfirmed) {
      try {
        await deleteCategory(id);

        const updatedCategories = await fetchCategories();
        setCategories(updatedCategories);

        const updatedNotes = await fetchNotes();
        setNotes(updatedNotes);

        setIsManagingCategories(false);

        Swal.fire("Deleted!", "The category has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        Swal.fire("Error!", "Could not delete the category.", "error");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Active Notes</h1>

        <div>
          <label className="text-gray-700 mr-2">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Note
        </button>

        <button
          onClick={() => setIsManagingCategories(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Manage Categories
        </button>
      </div>
      {/* Manage Categories Form */}
      {isManagingCategories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

            {/* Add Category Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get("name") as string;
                if (name.trim().toLowerCase() !== "uncategorized") {
                  handleAddCategory(name);
                } else {
                  Swal.fire({
                    title: "Error",
                    text: "Cannot create a category named 'Uncategorized'.",
                    icon: "error",
                    confirmButtonColor: "#F44336",
                  });
                }
              }}
              className="flex gap-2 mb-4"
            >
              <input
                name="name"
                type="text"
                placeholder="New Category Name"
                required
                className="border p-2 rounded w-full"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
            </form>

            {/* List Categories (excluding Uncategorized) */}
            <ul className="mb-4">
              {categories
                .filter(
                  (category) => category.name.toLowerCase() !== "uncategorized"
                ) // Exclude 'Uncategorized'
                .map((category) => (
                  <li
                    key={category.id}
                    className="flex justify-between items-center border-b pb-2 mb-2"
                  >
                    <span>{category.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>

            {/* Close Button */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsManagingCategories(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Form */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Note</h2>
            <form onSubmit={addHandleSubmit(onAddSubmit)}>
              <input
                type="text"
                placeholder="Title"
                {...addRegister("title")}
                className="border p-2 rounded w-full mb-2"
              />
              <p className="text-red-500">{addErrors.title?.message}</p>

              <textarea
                placeholder="Description"
                {...addRegister("description")}
                className="border p-2 rounded w-full mb-2"
                rows={3}
              ></textarea>
              <p className="text-red-500">{addErrors.description?.message}</p>

              <div className="mb-4">
                <label className="font-bold mb-2 block">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        value={category.id}
                        {...addRegister("categories")}
                        className="accent-blue-500 w-4 h-4"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
                <p className="text-red-500">{addErrors.categories?.message}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Form */}
      {isAddingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get("name") as string;
                handleAddCategory(name);
              }}
            >
              <input
                name="name"
                type="text"
                placeholder="Category Name"
                required
                className="border p-2 rounded w-full mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Note Form */}
      {isEditing && noteToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>
            <form onSubmit={editHandleSubmit(onEditSubmit)}>
              {/* Title Input */}
              <input
                type="text"
                {...editRegister("title")}
                className="border p-2 rounded w-full mb-2"
                placeholder="Title"
              />
              <p className="text-red-500">{editErrors.title?.message}</p>

              {/* Description Input */}
              <textarea
                {...editRegister("description")}
                className="border p-2 rounded w-full mb-2"
                rows={3}
                placeholder="Description"
              ></textarea>
              <p className="text-red-500">{editErrors.description?.message}</p>

              <div className="mb-4">
                <label className="font-bold mb-2 block">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        value={category.id}
                        defaultChecked={noteToEdit?.categories?.some(
                          (cat) => cat.id === category.id
                        )}
                        {...editRegister("categories")}
                        className="accent-blue-500 w-4 h-4"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
                <p className="text-red-500">{editErrors.categories?.message}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show Notes */}
      <div className="mt-5">
        {currentNotes.map((note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            description={note.description}
            categories={note.categories}
            onArchive={() => handleArchive(note.id)}
            onDelete={() => handleDelete(note.id)}
            onEdit={() => handleEdit(note)}
            archiveButtonText="Archive"
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
