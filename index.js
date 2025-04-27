import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./users.js";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
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

// Add a user
const addUser = async (userData) => {
  try {
    const newUser = new Users(userData);
    const savedUser = await newUser.save();
    console.log(`User added successfully: ${savedUser.username}`);
    return savedUser;
  } catch (error) {
    console.error(`Error adding user: ${error.message}`);
    throw error;
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await Users.find({}, '-password');
    return users;
  } catch (error) {
    console.error(`Error retrieving users: ${error.message}`);
    throw error;
  }
};

// Find user by username
const findUserByUsername = async (username) => {
  try {
    const user = await Users.findOne({ username });
    return user;
  } catch (error) {
    console.error(`Error finding user: ${error.message}`);
    throw error;
  }
};

// Find user by ID
const findUserById = async (userId) => {
  try {
    return await Users.findById(userId);
  } catch (error) {
    console.error(`Error finding user by ID: ${error.message}`);
    throw error;
  }
};

// Check if user is admin
const isUserAdmin = async (username) => {
  try {
    const user = await findUserByUsername(username);
    return user && user.role === 'admin';
  } catch (error) {
    console.error(`Error checking admin status: ${error.message}`);
    return false;
  }
};

// Update user
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

// 🔥 Find matching users based on hobbies
const findMatchingUsers = async (username) => {
  try {
    const currentUser = await Users.findOne({ username });
    if (!currentUser) return [];

    return await Users.find({
      username: { $ne: username },
      hobbies: { $in: currentUser.hobbies }
    });
  } catch (error) {
    console.error(`Error finding matching users: ${error.message}`);
    return [];
  }
};

// Delete a user
const deleteUser = async (userId) => {
  try {
    await Users.findByIdAndDelete(userId);
    console.log(`User ${userId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    throw error;
  }
};

// 🚫 Remove this - it was floating and does nothing:
// const user = new Users({ ... });

export {
  connectDB,
  addUser,
  getAllUsers,
  findUserByUsername,
  updateUser,
  isUserAdmin,
  findUserById,
  findMatchingUsers,
  deleteUser
};
