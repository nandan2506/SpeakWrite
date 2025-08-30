const express = require("express");
const dbConnection = require("./config/db");
const notesRoutes = require("./routes/notes.routes"); 
const cors = require("cors")
require("dotenv").config();

const app = express();
app.use(cors())
const PORT = process.env.PORT || 5000; 

app.use(express.json());

// Routes
app.use("/notes", notesRoutes);

// 404 fallback
app.use("*", (req, res) => res.status(404).json({ message: "route not found" }));


app.listen(PORT, () => {
    console.log("Server started on", PORT);
    dbConnection();
});
