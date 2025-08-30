import React, { useState } from "react";

export default function NoteCard({ note, onEdit, onDelete, onGenerateSummary }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.transcript);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-50">
      {isEditing ? (
        <>
          <textarea
            className="w-full p-2 border rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => {
                onEdit(note._id, text);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="px-3 py-1 bg-gray-400 text-white rounded"
              onClick={() => {
                setIsEditing(false);
                setText(note.transcript);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold">{note.title}</h1>
          <h3 className="text-gray-700">{note.transcript}</h3>
          {note.summary && (
            <p className="text-sm italic text-gray-500 mt-1">
              Summary: {note.summary}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => onDelete(note._id)}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50"
              disabled={note.isSummaryGenerated}
              onClick={() => onGenerateSummary(note._id)}
            >
              Generate Summary
            </button>
          </div>
        </>
      )}
    </div>
  );
}
