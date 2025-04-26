import mongoose from "mongoose";

const { Schema, model } = mongoose; 

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },  
    bio: { type: String, maxlength: 100 },        
    hobbies: { type: [String], required: true },  
    location: {type: String},              
    matches: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: String
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

const Users = model("Users", userSchema);
export default Users;