import User from "../models/User.js";
import Message from "../models/Messages.js";
import cloudinary from "../lib/cloudinary.js";

// Get all contacts except the logged-in user
export const getAllContacts = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        // Fetch all users except the current user
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("Error fetching contacts:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Get messages between the logged-in user and another user by their ID
export const getMessagesById = async (req, res) => {
    try{
        // Get the logged-in user's ID and the other user's ID from the request parameters
        const loggedInUserId = req.user._id;
        const {id: otherUserId} = req.params;

        // Fetch messages where the logged-in user is either the sender or receiver and the other user is the counterpart
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, recieverId: otherUserId },
                { senderId: otherUserId, recieverId: loggedInUserId }
            ]
        });
        res.status(200).json(messages);
    }
    catch(error){
        console.log("Error fetching messages:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Send a message from the logged-in user to another user by their ID
export const sendMessage = async (req, res) => {
    try{
        const { text, image } = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;

        // Validate that either text or image is provided, and that the sender is not the same as the receiver
        if(!text && !image){
            return res.status(400).json({message: "Message text or image is required"});
        }

        // Check if the sender is trying to send a message to themselves
        if(senderId.equals(recieverId)){
            return res.status(400).json({message: "You cannot send a message to yourself"});
        }

        // Check if the receiver exists in the database
        const receiverExists = await User.exists({_id: recieverId});
        if(!receiverExists){
            return res.status(404).json({message: "Receiver not found"});
        } 

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // todo: Send the messages in real-time using socket.io

        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("Error sending message:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Get all unique chat partners for the logged-in user
export const getChatPartners = async (req, res) => {
    try{
        // Get the logged-in user's ID
        const loggedInUserId = req.user._id;

        // Fetch all messages where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { recieverId: loggedInUserId }
            ]
        });

        // Extract unique user IDs of chat partners from the messages
        const chatPartnerIds = [...new Set(messages.map(msg => msg.senderId.toString() === loggedInUserId.toString() ? msg.recieverId.toString() : msg.senderId.toString()))];

        // Fetch the user details of the chat partners
        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password");
        
        res.status(200).json(chatPartners);
    }
    catch(error){
        console.log("Error fetching chat partners:", error);
        res.status(500).json({message: "Internal server error"});
    }
}