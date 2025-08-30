const multer = require("multer");
const path = require("path");

// storage config (save in /uploads folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // make sure 'uploads' folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    },
});

const upload = multer({ storage })

module.exports = upload;
