import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { prisma } from "../app.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "some jwt secret";
export async function checkAdmin(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.admin.findUnique({
      where: { username: decoded.username },
    });

    return !!user; 
  } catch (error) {
    console.error("Admin auth failed:", error);
    return false;
  }
}
