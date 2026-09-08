import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";

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
            // Save the new user to the database
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            // Send the user data in the response, excluding the password
            res.status(201).json({
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                profilePicture: savedUser.profilePicture,
            });

            // Send a welcome email to the new user
            try{
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            }
            catch(error){
                console.error("Error sending welcome email:", error);
            }
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

export const login = async (req, res) => {
    // Extracting the data from the request body
    const {email, password} = req.body;

    try{
        // Checking if all fields are provided
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        // Checking if the user exists in the database
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        // Comparing the provided password with the hashed password stored in the database
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if(!isCorrectPassword){
            return res.status(400).json({message: "Invalid credentials"});
        }

        // If the credentials are valid, generate a token and send the user data in the response
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    }
    // Handling any errors that occur during the login process
    catch(error){
        console.log("Error in login controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = (_, res) => {
    // Clearing the token cookie to log the user out
    res.clearCookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
}