import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import { Note } from "../App";
import { fetchCategories } from "../services/api";

interface ArchivedNotesProps {
  notes: Note[];
  handleUnarchive: (id: number) => void;
  handleDelete: (id: number) => void;
}

const ArchivedNotes: React.FC<ArchivedNotesProps> = ({
  notes,
  handleUnarchive,
  handleDelete,
}) => {
  // Filter state
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [filterCategory, setFilterCategory] = useState<string>("");

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

  const filteredNotes = filterCategory
    ? notes.filter((note) =>
        note.categories.some((category) => category.name === filterCategory)
      )
    : notes;

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Archived Notes</h1>

      {/* Filter by Category */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <label className="text-gray-700 mr-2">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes List */}
      <div className="mt-5">
        {currentNotes.length > 0 ? (
          currentNotes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              description={note.description}
              categories={note.categories}
              onArchive={() => handleUnarchive(note.id)}
              onDelete={() => handleDelete(note.id)}
              archiveButtonText="Unarchive"
            />
          ))
        ) : (
          <p className="text-gray-500">
            No archived notes found for this category.
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredNotes.length > notesPerPage && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ArchivedNotes;
