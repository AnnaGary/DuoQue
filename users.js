import mongoose from "mongoose";

const { Schema, model } = mongoose; 

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },  
    bio: { type: String, maxlength: 100 },        
    hobbies: { type: [String], required: true },  
    location: {type: String},              
    matches: [{ 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
        status: { type: String, enum: ["pending", "matched", "rejected"], default: "pending" }
    }],
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    bannedAt: { type: Date },
    bannedBy: { type: String, ref: "Users" },
    lastLogin: { type: Date }
});

const reportSchema = new Schema({
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    reason: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ["pending", "reviewed", "dismissed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const activityLogSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    action: { type: String, required: true }, // login, profile update, etc.
    details: { type: Schema.Types.Mixed },
    ip: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Users = model("Users", userSchema);
const Report = model("Report", reportSchema);
const ActivityLog = model("ActivityLog", activityLogSchema);

export { Users, Report, ActivityLog };
export default Users;