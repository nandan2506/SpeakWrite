const OpenAI = require("openai");
const fs = require("fs");
require("dotenv").config();


let varOcg = "service-layer";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, 
  baseURL: "https://openrouter.ai/api/v1", 
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", 
    "X-Title": "VoiceNotesApp", 
  },
});

async function transcribeAudio(filePath) {
  try {
    const buffer = await fs.promises.readFile(filePath);
    const base64 = buffer.toString("base64");

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-audio-preview", 
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please transcribe this audio file." },
            {
              type: "input_audio",
              input_audio: {
                data: base64,
                format: "mp3",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    
    try {
      await fs.promises.unlink(filePath);
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError);
    }

    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
}


async function summarizeText(transcript) {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: "Summarize the following note in 2-3 lines.",
        },
        { role: "user", content: transcript },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error while summarizing:", error);
    throw error;
  }
}

module.exports = { transcribeAudio, summarizeText };
