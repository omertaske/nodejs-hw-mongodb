import fs from "fs/promises";
import mongoose from "mongoose";
import { ConcantCollection } from "./Contact.js";

const user = "omertaskesenn_db_user";
const pwd = "pAzwe3cwZc4rjrvS";
const url = "cluster0.tshoeit.mongodb.net";
const db = "concants";

 export const initMongoConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`
    );
    console.log("Mongo connected!");

    // JSON dosyasını oku
    const data = await fs.readFile("contacts.json", "utf-8");
    const contacts = JSON.parse(data);

    // Önce koleksiyonu temizle
    await ConcantCollection.deleteMany({});

    // Yeni verileri ekle
    await ConcantCollection.insertMany(contacts);

    console.log("Contacts imported!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

initMongoConnection();
