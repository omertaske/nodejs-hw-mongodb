// src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// buffer -> base64 -> data URI -> upload
export const uploadImageFromBuffer = async (buffer, mimetype = "image/jpeg", folder = "contacts") => {
  if (!buffer) throw new Error("No buffer provided for upload");

  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimetype};base64,${base64}`;

  // Daha fazla opsiyon ekleyebilirsin: transformation, public_id, overwrite, ...
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  // result contains secure_url, public_id, etc.
  return result;
};

export const deleteImageByPublicId = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
