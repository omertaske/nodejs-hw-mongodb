
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/ // basit e-posta doğrulaması
    },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export const UserCollection = model("users", userSchema);