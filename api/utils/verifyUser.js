import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

{/* Middleware to verify a user's authentication token.
    Ensures that only authenticated users can access protected routes */}
export const verifyToken = (req, res, next) => {
    // 1. Check for the token in the Authorization Header (Bearer Token)
    let token = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token part
        token = authHeader.split(' ')[1]; 
    }
    
    // 2. Fallback: If no header token, check the cookie
    if (!token && req.cookies && req.cookies.access_token) {
        token = req.cookies.access_token;
    }

    // 3. If still no token, return 401 Unauthorized
    if (!token) {
        return next(errorHandler(401, 'Unauthorized: No token provided.'));
    }

    // 4. Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            return next(errorHandler(403, 'Forbidden: Token is invalid or expired.'));
        }

        // Token is valid, attach user payload to request
        req.user = user;
        next();
    });
};
