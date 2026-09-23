// const express = require("express"); => traditional commonjs import
import express from "express"; // => es6 module import
import cookieParser from "cookie-parser"; // to parse cookies from incoming requests
import authRoutes from "./routes/auth.route.js";
import msgRoutes from "./routes/messages.route.js";
import path from "path"; //In-built in nodejs
import { connectDB } from "./lib/db.js"; // import the connectDB function from db.js
import { ENV } from "./lib/env.js"; // import the ENV object from env.js

const PORT = ENV.PORT || 3000;

const app = express();
const __dirname = path.resolve(); // to get the current directory path

app.use(express.json()); // to parse incoming JSON requests
app.use(cookieParser()); // to parse cookies from incoming requests

app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

// Deployment ready code
if(ENV.NODE_ENV === "production") {
    //serve static files(frontend) to express server
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    //if any route other than api routes is hit, serve the index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB(); // call the connectDB function to connect to the database
});