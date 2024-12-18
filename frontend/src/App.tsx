import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import ArchivedNotes from "./pages/ArchivedNotes";
import Login from "./pages/Login";
import { fetchNotes, deleteNote, addNote, patchNote } from "./services/api";
import { fetchCategories } from "./services/api";
import Swal from "sweetalert2";

export interface Note {
  id: number;
  title: string;
  description: string;
  categories: string[];
  archived: boolean;
}
export interface Category {
  id: number;
  name: string;
}

function App() {
  // get api all notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notes = await fetchNotes();
        const normalizedNotes = notes.map((note) => ({
          ...note,
          categories: Array.isArray(note.categories) ? note.categories : [],
        }));

        setActiveNotes(normalizedNotes.filter((note) => !note.archived));
        setArchivedNotes(normalizedNotes.filter((note) => note.archived));
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    loadNotes();
  }, []);

  // Add function
  const handleAddNote = async (
    title: string,
    description: string,
    selectedCategoryIds: number[]
  ) => {
    const newNote = {
      title,
      description,
      categories: selectedCategoryIds.map((id) => ({ id })),
      archived: false,
    };

    try {
      const createdNote = await addNote(newNote);

      setActiveNotes((prevNotes) => [...prevNotes, createdNote]);

      Swal.fire({
        title: "Success!",
        text: "The note has been added successfully.",
        icon: "success",
        confirmButtonColor: "#4CAF50",
      });
    } catch (error) {
      console.error("Error adding note:", error);

      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the note. Please try again.",
        icon: "error",
        confirmButtonColor: "#F44336",
      });
    }
  };

  //getall

  const [activeNotes, setActiveNotes] = useState<Note[]>([]);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);

  //Archive function

  const handleArchive = async (id: number) => {
    try {
      const updatedNote = await patchNote(id, { archived: true });
      setActiveNotes((prevActiveNotes) =>
        prevActiveNotes.filter((note) => note.id !== id)
      );
      setArchivedNotes((prevArchivedNotes) => [
        ...prevArchivedNotes,
        updatedNote,
      ]);
    } catch (error) {
      console.error(`Error archiving note with id ${id}:`, error);
    }
  };

  const handleUnarchive = async (id: number) => {
    try {
      const updatedNote = await patchNote(id, { archived: false });
      setArchivedNotes((prevArchivedNotes) =>
        prevArchivedNotes.filter((note) => note.id !== id)
      );
      setActiveNotes((prevActiveNotes) => [...prevActiveNotes, updatedNote]);
    } catch (error) {
      console.error(`Error unarchiving note with id ${id}:`, error);
    }
  };

  //Delete function
  const handleDelete = async (id: number, isArchive: boolean) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteNote(id);
        if (isArchive) {
          setArchivedNotes((prevArchivedNotes) =>
            prevArchivedNotes.filter((note) => note.id !== id)
          );
        } else {
          setActiveNotes((prevActiveNotes) =>
            prevActiveNotes.filter((note) => note.id !== id)
          );
        }

        Swal.fire({
          title: "Deleted!",
          text: "Your note has been deleted.",
          icon: "success",
          confirmButtonColor: "#4CAF50",
        });
      } catch (error) {
        console.error("Error deleting the note:", error);

        Swal.fire({
          title: "Error!",
          text: "Failed to delete the note.",
          icon: "error",
          confirmButtonColor: "#F44336",
        });
      }
    }
  };

  const handleDeleteActive = (id: number) => handleDelete(id, false);
  const handleDeleteArchived = (id: number) => handleDelete(id, true);

  // Categories api

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  //authentica function

  const isAuthenticated = () => {
    return localStorage.getItem("token") === "loggedin";
  };

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  // logout function

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        //login
        <Route path="/login" element={<Login />} />
        //route
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                {/* Navbar */}
                <div className="bg-gray-100 p-4">
                  <nav className="flex justify-between max-w-4xl mx-auto">
                    <Link
                      to="/archived"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 "
                    >
                      Archived Notes
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </nav>
                </div>

                {/* Página Home */}
                <Home
                  notes={activeNotes}
                  setNotes={setActiveNotes}
                  handleArchive={handleArchive}
                  handleDelete={handleDeleteActive}
                  handleAddNote={handleAddNote}
                  categories={categories}
                  setCategories={setCategories}
                />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/archived"
          element={
            <PrivateRoute>
              <>
                {/* Navbar */}
                <div className="bg-gray-100 p-4">
                  <nav className="flex justify-between max-w-4xl mx-auto">
                    <Link
                      to="/"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 "
                    >
                      Active notes
                    </Link>

                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </nav>
                </div>

                {/* Página ArchivedNotes */}
                <ArchivedNotes
                  notes={archivedNotes}
                  handleUnarchive={handleUnarchive}
                  handleDelete={handleDeleteArchived}
                />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
