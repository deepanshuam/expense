const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        console.log("In middleware auth");

        // Extract Authorization header
        const authHeader = req.headers['authorization'];
        console.log('Auth Header:', authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing.' });
        }

        const token =authHeader && authHeader.split(" ")[1];
        console.log("Token:", token);
        if (!token) {
            return res.status(401).json({ message: 'Token missing in header.' });
        }

        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("Decoded Token:", decodedToken);

        const userId = decodedToken.userId;
        console.log('User ID from token:', userId);

        // Fetch user from database
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Attach user to the request object
        req.user = user;
        console.log("User authenticated:", user);

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in auth middleware:", error.stack);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }

        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = authenticate;
