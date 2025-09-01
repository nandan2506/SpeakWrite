import React, { useEffect, useState, useRef } from "react";
import NoteList from "../components/NoteList";

export default function Home() {
  const baseUrl = "https://speakwrite-1.onrender.com";
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
      formData.append("audio", audioBlob, "note.webm"); 

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
        chunksRef.current = []; 
        handleAddNote(blob); 
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold animate-pulse">Loading Notes...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            🎤 Voice Notes
          </h1>
          <span className="text-sm text-gray-500">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        </div>

        {/* Record Button */}
        <div className="flex justify-center mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
            >
              ⏺ Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-full shadow-md animate-pulse transition-transform transform hover:scale-105"
            >
              ⏹ Stop Recording
            </button>
          )}
        </div>

        {/* Notes Section */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          {notes.length > 0 ? (
            <NoteList notes={notes} />
          ) : (
            <div className="text-center text-gray-500 py-6">
              <p className="text-lg">No notes yet 🎧</p>
              <p className="text-sm">Start recording to add your first note.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
