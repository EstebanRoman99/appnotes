import React from "react";

// props

type Category = {
  id: number;
  name: string;
};

type NoteCardProps = {
  title: string;
  description: string;
  categories: Category[];
  onArchive: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  archiveButtonText: string;
};

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  description,
  categories,
  onArchive,
  onEdit,
  onDelete,
  archiveButtonText,
}) => {
  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
      <div className="text-sm text-gray-500 mt-2">
        <span className="font-semibold">Categories:</span>
        {Array.isArray(categories) && categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="text-sm text-gray-500">
                {category.name}
              </li>
            ))}
          </ul>
        ) : (
          <span> None</span>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          onClick={onArchive}
        >
          {archiveButtonText}
        </button>
        {onEdit && (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
