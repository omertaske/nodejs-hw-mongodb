import { ConcantCollection } from '../db/models/student.js';

export const getAllConcants = async () => {
  const concants = await ConcantCollection.find();
  return concants;
};

export const getConcantById = async (concantsId) => {
  const concants = await ConcantCollection.findById(concantsId);
  return concants; 
};