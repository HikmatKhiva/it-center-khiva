import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.jwtSecret;
export async function middlewareAdmin(req, res, next) {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1]; // token
    if (!token) return res.status(401).json({ message: "permission denied" });
    const decode = jwt.decode(token, jwtSecret);
    if (!decode) return res.status(401).json({ message: "permission denied" });
    req.admin = decode;
    next();
  } catch (error) {
    return res.status(500).json({ message: "authorization need" });
  }
}
