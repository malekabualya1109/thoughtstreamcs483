
 import jwt from "jsonwebtoken";

 const authenticateJWT = (req, res, next) => {
  // Read the Authorization header (format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  // Check if the token is present and properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or malformed" });
  }
  // Extract the token from the header string
  const token = authHeader.split(" ")[1]; // the part after "Bearer"
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    // Allow the request to proceed to the route handler
    next();
  } catch (err) {
    // If the token is invalid or expired, deny access
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
 };
 export default authenticateJWT;
