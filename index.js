import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./users.js";

dotenv.config();

const connectDB = async () => {
    try {
      // Get MongoDB URI from environment variables
      const MONGODB_URI = process.env.MONGODB_URI;
      
      // Check if MONGODB_URI is defined
      if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
      }
      
      const conn = await mongoose.connect(MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  };

const addUser = async (userData) => {
    try {
        const newUser = new Users(userData);
        const savedUser = await newUser.save();

        console.log(`User added successfully: ${savedUser.username}`);
        return savedUser;
    } catch (error) {
        console.error(`Error adding user: ${error.message}`);
        //this is where we can add specific error types later i.e. username already taken etc
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const users = await Users.find({}, '-password');
        return users;
    } catch (error) {
        console.error(`Error retrieving users: ${error.message}`);
        throw error;
    }
};

const findUserByUsername = async (username) => {
    try {
        const user = await Users.findOne({ username }); // ← Removed '-password'
        return user;
    } catch (error) {
        console.error(`Error finding user: ${error.message}`);
        throw error;
    }
};

const updateUser = async (userId, updateData) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        throw error;
      }
    };

const user = new Users({
    "username": "hobbylover1234",
    "password": "$abchashedpasswordhere",
    "bio": "I hate making databases!",
    "hobbies": ["hiking", "cooking", "board games"],
    "matches": [
        {
            "userId": "65f12ab34cd5678901234567",
            "status": "matched"
        }
    ],
    "createdAt": "2025-02-27T15:30:00Z" 
})

export { connectDB, addUser, getAllUsers, findUserByUsername, updateUser };