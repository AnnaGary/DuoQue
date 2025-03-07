import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./model/users.js";

dotenv.config();  

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

const user = new Users({
    "username": "hobbylover123",
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
});

user.save()
    .then(() => {
        console.log("User saved successfully!");
        mongoose.connection.close(); 
    })
    .catch(err => {
        console.error("Error saving user:", err);
        mongoose.connection.close();
    });
