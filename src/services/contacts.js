import { ContactCollection } from "../db/Contact.js";
import mongoose from "mongoose";

export const getAllContacts = async ({ userId, page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite }) => {
  page = parseInt(page);
  perPage = parseInt(perPage);
  const filter = { userId };
  if (type) filter.contactType = type;
  if (typeof isFavourite !== "undefined") filter.isFavourite = (isFavourite === "true" || isFavourite === true);

  const totalItems = await ContactCollection.countDocuments(filter);
  const contacts = await ContactCollection.find(filter)
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  return { contacts, page, perPage, totalItems, totalPages: Math.ceil(totalItems / perPage), hasPreviousPage: page > 1, hasNextPage: page * perPage < totalItems };
};

export const getContactById = async ({ userId, contactId }) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) return null;
  return ContactCollection.findOne({ _id: contactId, userId });
};

export const createContact = async ({ userId, body }) => {
  return ContactCollection.create({ ...body, userId });
};

export const updateContact = async ({ userId, contactId, body }) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) return null;
  return ContactCollection.findOneAndUpdate({ _id: contactId, userId }, body, { new: true });
};

export const deleteContact = async ({ userId, contactId }) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) return null;
  return ContactCollection.findOneAndDelete({ _id: contactId, userId });
};