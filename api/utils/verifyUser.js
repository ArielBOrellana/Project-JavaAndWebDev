import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

{/* Middleware to verify a user's authentication token.
    Ensures that only authenticated users can access protected routes */}
export const verifyToken = (req, res, next) => {
    // Retrieve the token from the cookies
    let token = req.cookies.access_token;

    // Remove potential surrounding quotes ("") that may be added when sending 
    // secure, cross-site cookies (due to trust proxy/SameSite settings).
    if (token) {
        token = token.replace(/"/g, '').trim();
    }

    // If no token is found, return an unauthorized error
    if (!token) return next(errorHandler(401, 'Unauthorized'));

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If token verification fails, return a forbidden error
        if (err) return next(errorHandler(403, 'Not valid'));

        // Attach the user information from the token to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    });
};
