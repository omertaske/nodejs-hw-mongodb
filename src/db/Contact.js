import mongoose from "mongoose";
const { Schema } = mongoose;


const concantshema = new Schema({

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
      type: boolean,
      default: false,
    },
     contactType    : {
      type: String,
      required: true,
      default: "personal",
      enum: ['work', 'home', 'personal'],
    },


})
export const ConcantCollection = model('concants', concantshema);