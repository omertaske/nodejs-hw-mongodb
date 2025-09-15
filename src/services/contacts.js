import { ConcantCollection } from '../db/Contact.js';

// Tüm kişiler
export const getAllContacts = async () => {
  const contacts = await ConcantCollection.find();
  return contacts;
};

// ID kişi 
export const getContactById = async (contactId) => {
  const contact = await ConcantCollection.findById(contactId);
  return contact;
};
