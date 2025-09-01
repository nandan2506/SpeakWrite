const OpenAI = require("openai");
const { AssemblyAI } = require("assemblyai");
const fs = require("fs");
require("dotenv").config();

// OpenRouter client for summaries
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "VoiceNotesApp",
  },
});

// AssemblyAI client for transcription
const assembly = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// Demo variable (__define-ocg__)
let varOcg = "transcription-service-layer";

/**
 * Transcribe audio using AssemblyAI
 */
async function transcribeWithAssemblyAI(filePath) {
  try {
    const audioStream = fs.createReadStream(filePath);

    // Upload file
    const uploadUrl = await assembly.files.upload(audioStream);
    console.log("Uploaded file URL:", uploadUrl);

    // Create transcript job
    const transcript = await assembly.transcripts.create({
      audio_url: uploadUrl,
    });

    console.log("Transcript ID:", transcript.id);

    // Polling with timeout (max 2 minutes)
    const start = Date.now();
    let polling = await assembly.transcripts.get(transcript.id);

    while (polling.status !== "completed" && polling.status !== "error") {
      if (Date.now() - start > 120000) {
        throw new Error("Transcription timed out");
      }

      console.log("Status:", polling.status);
      await new Promise((r) => setTimeout(r, 5000));
      polling = await assembly.transcripts.get(transcript.id);
    }

    if (polling.status === "completed") {
      return polling.text;
    } else {
      throw new Error(polling.error || "Transcription failed");
    }
  } catch (error) {
    console.error("AssemblyAI transcription error:", error.message);
    throw error;
  }
}

/**
 * Summarize transcript using OpenRouter
 */
async function summarizeText(transcript) {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize the following note in 2-3 lines." },
        { role: "user", content: transcript },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error while summarizing:", error.message);
    throw error;
  }
}

module.exports = { transcribeWithAssemblyAI, summarizeText };
