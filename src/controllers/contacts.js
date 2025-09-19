import { ContactCollection } from "../db/Contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
 
    const contacts = await ContactCollection.find({ userId: req.user._id });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};