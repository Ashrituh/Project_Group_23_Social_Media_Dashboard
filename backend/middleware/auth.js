const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization") || req.header("authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided" });
    }

    try {
        const parts = authHeader.split(" ");
        const actualToken = parts.length === 2 ? parts[1] : parts[0];
        const secret = process.env.JWT_SECRET || "secret123";
        const decoded = jwt.verify(actualToken, secret);
        // normalize user object to { id }
        req.user = { id: decoded.user_id || decoded.id };
        next();
    } catch (err) {
        return res.status(400).json({ error: "Invalid token." });
    }
};