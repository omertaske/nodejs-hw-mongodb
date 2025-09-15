import mongoose from "mongoose";
const { Schema, model  } = mongoose;


const contactSchema = new Schema({

     name: {
      type: String,
      required: true,
    },
     phoneNumber : {
      type: String,
      required: true,
    },
     email  : {
      type: String,
      required: false,
    },
     isFavourite   : {
      type: Boolean,
      default: false,
    },
     contactType    : {
      type: String,
      required: true,
      default: "personal",
      enum: ['work', 'home', 'personal'],
    },
    


 },
 { timestamps: true });
export const ConcantCollection = model('contacts', contactSchema);