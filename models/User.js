import mongoose from "mongoose";

// user table - ийн бүтэц username, lastname 
const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  lastname: {
    type: String
  },
});

// Model үүсгэх
const User = mongoose.model('User', userSchema);
export default User;