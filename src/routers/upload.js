// src/routers/upload.js
import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import cloudinaryUtil from "../utils/cloudinary.js"; // this ensures config runs

// remove cloudinary.config(...) from here if you added it in utils

const router = Router();

const storage = new multer.memoryStorage({
  cloudinary,
  params: {
    folder: "test_uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  res.json({
    message: "Uploaded successfully",
    url: req.file.path, // Cloudinary URL
  });
});

export default router;
