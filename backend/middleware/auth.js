import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No Token Provided",
    });
  }

  try {

    const token = authHeader.split(" ")[1]; // remove "Bearer "

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });

  }
};

export default auth;