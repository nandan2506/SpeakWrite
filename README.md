# SpeakWrite
VoiceNotesApp is a full-stack web application that allows users to record voice notes, automatically transcribe them into text, and generate AI-powered summaries. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and integrated with OpenRouter/OpenAI APIs for transcription and summarization.

# Features
- Record Audio Notes: Users can record their voice notes directly in the browser.
- Automatic Transcription: Audio is transcribed to text using OpenAI’s Whisper model.
- AI Summarization: Generate concise 2-3 line summaries of each note.
- CRUD Operations: Create, Read, Update, and Delete notes.
- Summary Generation Control: Summary can only be generated once until the transcript is edited.
- Responsive UI: Clean and modern design, works on desktop and mobile.

# Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- AI Services: OpenRouter / OpenAI (Whisper, GPT-4o-mini)
- Other: Multer for file uploads, dotenv for environment variables

# Project Structure
```
SpeakWrite/
│
├─ backend/
│   ├─ controllers/        # Handles API logic (notes.controllers.js)
│   ├─ models/             # Mongoose models (notes.model.js)
│   ├─ routes/             # Express routes
│   ├─ services/           # OpenAI/OpenRouter API services
│   └─ app.js           # Entry point for backend
│
├─ frontend/
│   ├─ src/
│   │   ├─ components/     # React components
│   │   ├─ pages/          # Page components
│   │   └─ App.js
│   └─ package.json
│
└─ .env                    # API keys and environment variables
```
# Installation & Setup
## 1. Clone the repository:
```
git clone https://github.com/nandan2506/SpeakWrite.git
cd SpeakWrite
```


## 2. Backend Setup:

```
cd backend
npm install
```


## 3. Create .env file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
```


## 4. Start backend server:

npm run start


## 5. Frontend Setup:

```
cd frontend
npm install
npm run dev
```


## 6. Open http://localhost:5000 in your browser.

# API Endpoints
```
Notes
Method	        Endpoint	                    Description
GET	            /notes/allNotes                 Get all notes
POST	        /notes/newNote                  Create a new note (with audio)
PUT	            /notes/updateNote/:id	        Update transcript of a note
DELETE	        /notes/deleteNote/:id	        Delete a note
POST	        /notes/summary/:id/	            Generate AI summary for a note
```

# Usage
1. Upload or record an audio note.
2. The note will be automatically transcribed.
3. Edit the transcript if needed.
4. Click Generate Summary to get a short AI-powered summary.
5. Notes can be updated or deleted at any time.

# Environment Variables
```
Variable	                Description
MONGO_URI	                MongoDB connection string
OPENROUTER_API_KEY	        OpenRouter / OpenAI API key for transcription and summarization
PORT	                    Backend server port (default: 5000)
```


# Future Enhancements
- User authentication & roles
- Tagging and search for notes
- Export notes as PDF or text
- Dark mode and theming
- Support for longer audio notes with streaming


# License

This project is MIT Licensed. See LICENSE for details.

