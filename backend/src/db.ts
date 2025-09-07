import mongoose = require("mongoose");
import dotenv = require("dotenv")

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in .env");
}

mongoose.connect(uri)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.error("MongoDB Error:", err));


  const userSchema = new mongoose.Schema({
         username: String,
         password: String,
         firstName: String,
         lastName: String
  })

  const accountSchema = new mongoose.Schema({
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
      },
      balance: {
           type: Number,
           required: true
      }
  })

 export const User = mongoose.model("User",userSchema)
 export const Account = mongoose.model("Account",accountSchema)