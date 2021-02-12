// Imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectRoutes = require("./routes/connect");
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");

// Create app
const app = express();

// Configure CORS options and add cors middleware
const corsOptions = {
  origin: "*",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content",
    "Accept",
    "Content-Type",
    "Authorization",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};
app.use(cors(corsOptions));

// Middleware to transform body requests received from frontend to JSON object
app.use(bodyParser.json());

// Routes
app.use("/api/auth", connectRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);

module.exports = app;
