import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS || "access_secret";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
