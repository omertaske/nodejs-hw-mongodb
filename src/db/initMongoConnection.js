import fs from "fs/promises";
import mongoose from "mongoose";
import { ConcantCollection } from "./Contact.js";
import { config } from "dotenv";
config();
const user = String(process.env.MONGODB_USER);
const pwd =String(process.env.MONGODB_PASSWORD);
const url = String(process.env.MONGODB_URL);
const db = String(process.env.MONGODB_DB);
 export const initMongoConnection = async () => {
  try {
    await mongoose.connect( `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority` );
    console.log("Mongo connected!");   
    const data = await fs.readFile("contacts.json", "utf-8");
    const contacts = JSON.parse(data);
    await ConcantCollection.deleteMany({});  
    await ConcantCollection.insertMany(contacts);
    console.log("Contacts imported!");
  } catch (err) {
    console.error("Seed error:", err);
  }
};


