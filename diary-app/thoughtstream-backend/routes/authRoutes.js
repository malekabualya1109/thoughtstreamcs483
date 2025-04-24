import express from "express";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const payload = await verifyToken(token);
    console.log("Verified user:", payload);

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user: payload,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});


export default router;
