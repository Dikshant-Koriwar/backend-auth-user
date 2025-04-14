// Import required libraries
import mongoose from "mongoose";  // Mongoose to interact with MongoDB
import bcrypt from "bcryptjs";  // Bcrypt for hashing passwords

// Define the schema for the user data
const userSchema = new mongoose.Schema({
    name: String,  // Name of the user
    email: String,  // Email of the user
    password: String,  // User's password (will be hashed before storing)
    role: {  // User's role (either 'user' or 'admin')
        type: String,
        enum: ["user", "admin"],  // Define possible roles
        default: "user"  // Default role is 'user'
    },
    isVerified: {  // Boolean to indicate if the user's email is verified
        type: Boolean,
        default: false  // Default is not verified
    },
    verificationToken: {  // Token used for email verification
        type: String
    },
    passwordResetToken: {  // Token used for password reset
        type: String
    },
    passwordResetExpires: {  // Expiration time for password reset token
        type: Date
    },
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Hook to hash the password before saving the user
userSchema.pre("save", async function(next) {
    // Check if password field is modified
    if(this.isModified("password")) {
        // Hash the password using bcrypt with a salt rounds of 10
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();  // Proceed to the next middleware or save operation
});

// Create a Mongoose model for the user schema
const User = mongoose.model("User", userSchema);

// Export the User model to be used elsewhere in the application
export default User;
