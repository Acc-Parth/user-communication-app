import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    // Extracting the data from the request body
    const {fullName, email, password} = req.body;
    try{
        // Checking if all fields are provided
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        // Validating the password length
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        // Validating the email format using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Please enter a valid email address"});
        }

        // Checking if the user already exists in the database
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        // Hashing the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        // If the user is created successfully, generate a token and send the user data in the response
        if(newUser){
            await newUser.save();
            generateToken(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            })
        }
        else{
            res.status(400).json({message: "Invalid user data"});
        }
    }
    catch(error){
        console.log("Error in signup controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}