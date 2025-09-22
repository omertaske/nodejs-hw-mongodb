import { Router } from "express";
import multer from "multer";
import { uploadImageFromBuffer } from "../utils/cloudinary.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadImageFromBuffer(req.file.buffer, req.file.mimetype, "test_uploads");

    res.json({
      message: "Uploaded successfully",
      url: result.secure_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;