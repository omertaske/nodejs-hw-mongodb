import mongoose from "mongoose";
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: String,
    phoneNumber: String,
    email: String,
    isFavourite: Boolean,
    contactType: String,
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true }
  },
  { timestamps: true }
);

export const ContactCollection = model("contacts", contactSchema);