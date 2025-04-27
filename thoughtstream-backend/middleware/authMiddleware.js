// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader);  // Log the Authorization header

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token);  // Log the token extracted

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);  // Log the decoded JWT

    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);  // Log error message
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
export default authenticateJWT;
