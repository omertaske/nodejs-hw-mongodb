import { ConcantCollection } from '../db/Contact.js';

// Tüm kişileri getir
export const getAllContacts = async () => {
  const contacts = await ConcantCollection.find();
  return contacts;
};

// ID'ye göre kişi getir
export const getContactById = async (contactId) => {
  const contact = await ConcantCollection.findById(contactId);
  return contact;
};
