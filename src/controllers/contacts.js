import { ConcantCollection } from "../db/Contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
 
    const contacts = await ConcantCollection.find({ userId: req.user._id });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};