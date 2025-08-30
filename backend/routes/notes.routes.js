const express = require("express")
const { allNotes, newNotes, updateNote, deleteNote, generateSummary } = require("../controllers/notes.controllers")
const upload = require("../middlewares/multer.middleware")

const notesRoutes = express.Router()

notesRoutes.get("/allNotes", allNotes)
notesRoutes.post("/newNote", upload.single("audio"),newNotes)
notesRoutes.put("/updateNote/:id", updateNote);
notesRoutes.delete("/deleteNote/:id", deleteNote);
notesRoutes.post("/summary/:id", generateSummary);


module.exports =  notesRoutes 
