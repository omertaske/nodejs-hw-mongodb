import express from "express"
import pino from 'pino-http';
import cors from 'cors';
import { getAllConcants,getConcantById } from "./services/contacts";



const PORT = 3000;


export const setupServer =  () => {
      const app = express();
      app.use(express.json());
      app.use(cors());



        app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
    app.use('', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
    app.get('/contacts', async (req, res) => {
    const contacts = await getAllConcants();

    try {
         res.status(200).json({
      data: contacts,
    });
        
    } catch (error) {
        console.log("sdasda  " , error);
        
        
    }

   


  });
    app.get('/concants/:concantsId', async (req, res, next) => {
    const { concantsId } = req.params;
    const concant = await getConcantById(concantsId);

   
	  if (!concant) {
	    res.status(404).json({
		    message: 'Öğrenci bulunamadı'
	    });
     
      
	    return;
	  }

		
    res.status(200).json({
      data: concant,
    });
  });


  

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}