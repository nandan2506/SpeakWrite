const noteModel = require("../models/notes.model");
const { transcribeWithAssemblyAI, summarizeText } = require("../services/openAi.service");
require('dotenv').config()
const apiKey = process.env.OPENAI_API_KEY

const allNotes = async (req, res) => {
  try {
    const notes = await noteModel.find();
    if (notes.length === 0) {
      return res.status(200).json({ message: "no notes yet", notes: [] });
    }

    return res.status(200).json({
      message: "notes found successfully",
      notes,
    });
  } catch (error) {
    console.log("error while getting notes", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};


const newNotes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }
    const audioPath = req.file.path;
    const transcript = await transcribeWithAssemblyAI(audioPath);

    const newNote = await noteModel.create({
      transcript,
      summary: "",
      isSummaryGenerated: false,
    });

    return res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;

    const note = await noteModel.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (transcript && transcript !== note.transcript) {
      note.transcript = transcript;
      note.summary = "";
      note.isSummaryGenerated = false;
    }

    await note.save();

    return res.status(200).json({ message: "Note updated", note });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await noteModel.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const generateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteModel.findById(id);

    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.isSummaryGenerated) {
      return res.status(400).json({ message: "Summary already generated" });
    }

  
    const summary = await summarizeText(note.transcript);

    note.summary = summary;
    note.isSummaryGenerated = true;
    await note.save();

    return res.status(200).json({ message: "Summary generated", note }); // ✅ return full note
  } catch (error) {
    console.error("error while generating summary", error);
    res.status(500).json({ message: "Error generating summary", error: error.message });
  }
};


module.exports = { allNotes, newNotes, updateNote, deleteNote, generateSummary };
