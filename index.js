import mongoose from "mongoose";
import Users from "./model/users";

mongoose.connect("mongodb+srv://Jaron Hiatt:yKdEL1LxETQqGPSz@cluster0.g3l7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

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
})