import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    console.log("=================================");
    console.log("AUTH MIDDLEWARE");
    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Expected format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    console.log("Token:", token);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    // Save logged-in user id
    req.user = decoded.id;

    next();

  } catch (err) {
    console.log("❌ JWT ERROR:", err.message);

    return res.status(401).json({
      message: err.message,
    });
  }
};

export default authMiddleware;