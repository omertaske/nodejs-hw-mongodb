import mongoose from "mongoose";
const { Schema, model  } = mongoose;


const contactSchema = new Schema(
  {
    name: String,
    phoneNumber: String,
    email: String,
    isFavourite: Boolean,
    contactType: String,
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true }, // 👈 burası ödevin şartı
  },
  { timestamps: true }
);

export const ConcantCollection = model('contacts', contactSchema);