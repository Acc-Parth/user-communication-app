// const express = require("express"); => traditional commonjs import
import express from "express"; // => es6 module import
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import msgRoutes from "./routes/messages.route.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));