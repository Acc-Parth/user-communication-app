// const express = require("express"); => traditional commonjs import
import express from "express"; // => es6 module import
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import msgRoutes from "./routes/messages.route.js";
import path from "path"; //In-built in nodejs

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const __dirname = path.resolve(); // to get the current directory path

app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

// Deployment ready code
if(process.env.NODE_ENV === "production") {
    //serve static files(frontend) to express server
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    //if any route other than api routes is hit, serve the index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));