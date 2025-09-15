import { setupServer } from "./server.js"
import { initMongoConnection } from "./db/initMongoConnection.js";

const index = async () => {
     setupServer();
   await  initMongoConnection();
    
}

index();