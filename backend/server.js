const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");


connectDB();

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Test route
app.get("/", (req, res) => {
  res.send("✅ SocialSphere backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));


const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
