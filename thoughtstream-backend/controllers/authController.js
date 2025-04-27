import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleGoogleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({ googleId: sub, name, email, picture });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { name, email, picture }
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid Google token",
      error: err.message
    });
  }
};