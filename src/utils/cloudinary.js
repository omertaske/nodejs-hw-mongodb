import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * buffer: Buffer
 * mimetype: file mimetype
 * folder: optional
 */
export const uploadImageFromBuffer = async (buffer, mimetype, folder = "contacts") => {
  const dataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, { folder });
};
