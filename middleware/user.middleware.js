/*
1. Try to extract token → from cookie → or from Authorization header.
2. If not found → return 401 Unauthorized.
3. If token found → verify it using jwt.
4. If valid → attach user to request → proceed.
5. If invalid → return 401 Unauthorized.
6. Catch all unexpected errors → return 500 Internal Error.
*/

// Middleware to check if user is authenticated
import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    console.log("=== Auth Middleware Debug ===");

    // 1. Log cookie and headers for debugging
    console.log("Cookies:", req.cookies);
    console.log("Headers:", {
      cookie: req.headers.cookie,
      authorization: req.headers.authorization,
    });

    // 2. Try to extract token from cookies first
    let token = req.cookies?.token;

    // 3. If not found in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    // 4. Log whether token is found or not
    console.log("Token found:", token ? "Yes" : "No");

    // 5. If no token found, reject request
    if (!token) {
      console.log("No token found, user not authenticated.");
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    try {
      // 6. Verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified successfully");

      // 7. Attach decoded user info to request object
      req.user = decoded;

      // 8. Proceed to the next middleware/route
      next();
    } catch (error) {
      // 9. Token verification failed
      console.log("Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }
  } catch (error) {
    // 10. Any other unexpected error
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
