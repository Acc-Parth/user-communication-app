import mongoose from "mongoose";

// Build User Schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    profilePicture: {
        type: String,
        default: "",
    }
}, {timestamps: true}) // createdAt and updatedAt fields will be automatically added to the schema

const User = mongoose.model("User", userSchema);
export default User;