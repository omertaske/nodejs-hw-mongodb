import { ContactCollection } from '../db/Contact.js';

// Tüm kişiler
export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

// ID kişi 
export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};
