// middleware/uploadVideo.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/videos"); // ✅ separate folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // keep .mp4, .mkv, etc.
    const filename = path.basename(file.originalname, ext);
    cb(null, filename + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only video files allowed."), false);
};

exports.uploadVideo = multer({ storage, fileFilter });
