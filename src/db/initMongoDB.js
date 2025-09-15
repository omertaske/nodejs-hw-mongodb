import mongoose from 'mongoose';

import { env } from '../utils/env.js';

export const initMongoDB = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');


    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    //mongodb+srv://omertaskesenn_db_user:pAzwe3cwZc4rjrvS@cluster0.tshoeit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};

export const Getveri = async () => {

    
}