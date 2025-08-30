import React, { useEffect, useState, useRef } from "react";
import NoteList from "../components/NoteList";

export default function Home() {
  const baseUrl = "http://localhost:5000";
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/notes/allNotes`);
        const data = await res.json();
        setNotes(data.notes);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
      setLoading(false);
    };

    fetchNotes();
  }, []);

  // Upload audio to backend
  async function handleAddNote(audioBlob) {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "note.webm"); // multer field must be "audio"

      const res = await fetch(`${baseUrl}/notes/newNote`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Note added:", data);

      // refresh notes list
      setNotes((prev) => [...prev, data.note]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = []; // reset
        handleAddNote(blob); // upload note
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
    }
  };
  

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  if (loading) return <h1>Loading....</h1>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎤 Voice Notes</h1>

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg"
        >
          Stop Recording
        </button>
      )}

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <h1 className="mt-4">No Notes yet</h1>
      )}
    </div>
  );
}
