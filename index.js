// Import necessary libraries and modules
import express from "express"; // Express framework for server setup
import mongoose from "mongoose"; // Mongoose for MongoDB object modeling
import userRoutes from "./routes/user.route.js"; // Routes for user-related endpoints
import db from "./utils/db.js"; // Database connection utility
import dotenv from "dotenv"; // To load environment variables
import cookieParser from "cookie-parser"; // Middleware to parse cookies
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing

// Load environment variables from .env file
dotenv.config();

//create an express app instance
const app = express();

// 1. Cookie parser middleware to parse cookies sent with requests
app.use(cookieParser());

// 2. CORS configuration to allow requests from specific domains
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend at this address
    credentials: true, // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "Accept"], // Allowed request headers
    exposedHeaders: ["Set-Cookie", "*"], // Expose response headers (e.g., Set-Cookie)
  })
);

// 3. Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the "public" directory

// Test route to check cookie handling
app.get("/", (req, res) => {
  console.log("=== Cookie Debug ===");
  console.log("Request cookies:", req.cookies); // Log cookies sent by the client
  console.log("Request headers:", {
    cookie: req.headers.cookie, // Log the cookie header
    origin: req.headers.origin, // Log the origin of the request
  });

  // Respond with a message and the cookies in the request
  app.json({
    message: "Hello World",
    cookies: req.cookies,
  });
});

// 4. Register user-related routes
app.use("/api/v1/users", userRoutes);

// 5. Establish a connection to the database using a custom utility function
db();

// 6. Start the server and listen for incoming requests on port 3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
