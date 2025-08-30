const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  // title: { type: String, required: true },
  audioUrl: { type: String },
  transcript: { type: String },
  summary: { type: String },
  isSummaryGenerated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("note", noteSchema);
