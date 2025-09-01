import { useState } from "react";
import NoteCard from "./NoteCard";

export default function NoteList({ notes: initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const baseUrl = "https://speakwrite-1.onrender.com"; 


  // ✅ Edit Transcript
  const handleEdit = async (id, newTranscript) => {
    try {
      const res = await fetch(`${baseUrl}/notes/updateNote/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: newTranscript }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotes((prev) =>
          prev.map((n) => (n._id === id ? data.note : n))
        );
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  // ✅ Delete Note
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/notes/deleteNote/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // ✅ Generate Summary
  const handleGenerateSummary = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/notes/summary/${id}`, {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok) {
        setNotes((prev) =>
          prev.map((n) => (n._id === id ? data.note : n))
        );
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  return (
  <div className="flex flex-col gap-4 p-4">
    {notes
      .filter((note) => note && note._id) 
      .map((note) => (
        <div key={note._id}>
          <NoteCard
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onGenerateSummary={handleGenerateSummary}
          />
        </div>
      ))}
  </div>
);
}
