import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No Token Provided",
    });
  }

  try {
    const token = authHeader.split(" ")[1]; // remove "Bearer "

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }

    req.user = user; 

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default auth;