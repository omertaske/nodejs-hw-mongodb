
import mongoose from 'mongoose';
export const initMongoConnection = async () => {
    
     try {
    const user = "omertaskesenn_db_user";
    const pwd = "pAzwe3cwZc4rjrvS"
    const url = "cluster0.tshoeit.mongodb.net"
    const db = "concants"


    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    //mongodb+srv://omertaskesenn_db_user:pAzwe3cwZc4rjrvS@cluster0.tshoeit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
}