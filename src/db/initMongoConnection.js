import fs from "fs/promises";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ContactCollection } from "./Contact.js";
import { UserCollection } from "./User.js";
import { config } from "dotenv";
config();

const user = String(process.env.MONGODB_USER);
const pwd = String(process.env.MONGODB_PASSWORD);
const url = String(process.env.MONGODB_URL);
const db = String(process.env.MONGODB_DB);

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`);
    console.log("Mongo connected!");

    // create or find seed user for contacts
    const seedEmail = process.env.SEED_USER_EMAIL || "seed@example.com";
    let seedUser = await UserCollection.findOne({ email: seedEmail });
    if (!seedUser) {
      const hashed = await bcrypt.hash(process.env.SEED_USER_PASSWORD || "password123", 10);
      seedUser = await UserCollection.create({ name: "Seed User", email: seedEmail, password: hashed });
      console.log("Seed user created:", seedUser.email);
    } else {
      console.log("Seed user exists:", seedUser.email);
    }

    // read contacts file
    const data = await fs.readFile("contacts.json", "utf-8");
    const contacts = JSON.parse(data);

    // attach userId to each contact
    const contactsWithUser = contacts.map((c) => ({ ...c, userId: seedUser._id }));

    await ContactCollection.deleteMany({});
    await ContactCollection.insertMany(contactsWithUser);
    console.log("Contacts imported!");
  } catch (err) {
    console.error("Seed error:", err);
    throw err;
  }
};