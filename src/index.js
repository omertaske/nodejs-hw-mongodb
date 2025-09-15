import { initMongoDB,Getveri } from './db/initMongoDB.js';
import { startServer } from './server.js';



const bootstrap = async () => {
  await initMongoDB();
  startServer();


  console.log("getirmeye çalışılanlar  :   ");
  
};

bootstrap();