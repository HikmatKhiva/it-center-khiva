import bcrypt from "bcrypt";
import { TOTP } from "otpauth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import { promisify } from "util";
import { prisma } from "../../app.js";
import { generateBase32Secret } from "./admin.helper.js";
import cloudinary from "../../db/db.js";
dotenv.config();
const unlinkAsync = promisify(fs.unlink); // Promisify fs.unlink for async/await
const { JWT_SECRET } = process.env;
const expirationTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days from now
const registerUser = async (req, res) => {
  try {
    const { username, password, secret, role } = req.body;
    const roles = ["ADMIN", "RECEPTION", "TEACHER"];
    const find = await prisma.admin.findFirst({
      where: {
        username,
      },
    });
    if (find) return res.status(400).json({ message: "Hisob mavjud!" });
    if (!roles.includes(role)) {
      return res.status(500).json({ message: "Bunday role mavjud emas!" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        secret,
        role,
      },
    });
    res.status(201).json({
      message: "Hisob muaffaqiyatli yaratildi!",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const find = await prisma.admin.findFirst({
      where: {
        username,
      },
    });
    if (!find) {
      return res.status(400).json({ message: "Hisob topilmadi!" });
    }
    const isValid = await bcrypt.compare(password, find.password);
    if (!isValid) {
      return res.status(400).json({
        message: "Parol xato iltimos tekshirib qayta urinib ko'ring.",
      });
    }
    res.status(200).json({
      message: "Login Admin",
      username,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const Verify2FA = async (req, res) => {
  try {
    const { username, token } = req.body;
    const find = await prisma.admin.findFirst({
      where: {
        username,
      },
    });
    if (!find) {
      return res.status(400).json({ message: "Hisob topilmadi!" });
    }
    const totp = new TOTP({
      issuer: "it-khiva.uz",
      label: "IT_khiva_Manager",
      algorithm: "SHA1",
      digits: 6,
      secret: find?.secret,
    });
    const delta = totp.validate({ token });
    if (delta === null) {
      return res.status(401).json({
        status: "fail",
        message: "Authenticator code xato.",
      });
    }
    const jwToken = jwt.sign(
      { username, password: find.password, role: find.role },
      JWT_SECRET,
      {
        expiresIn: expirationTime,
      }
    );
    return res.json({
      message: "Hisobga kirish muoffaqiyatli amalga oshirildi.",
      user: {
        id: find.id,
        token: jwToken,
        role: find.role,
        expirationTime,
      },
    });
  } catch (error) {
    console.error("Error during 2FA verification:", error); // Use console.error for errors
    res.status(500).json({ message: "Internal server error" });
  }
};
const userProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        username: true,
        photo_url: true,
        role: true,
        secret: true,
      },
    });
    return res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const uploadImage = async (req, res) => {
  try {
    const image = req.file;
    const { username } = req.admin;
    const find = await prisma.admin.findFirst({
      where: {
        username,
      },
    });
    if (!find) {
      return res.status(404).json({ message: "Hisob topilmadi." });
    }
    let imageUrl;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "admin",
      });
      imageUrl = result.url;
      await unlinkAsync(image.path);
    }
    await prisma.admin.update({
      where: {
        username,
      },
      data: {
        photo_url: imageUrl,
      },
    });
    return res.status(200).json({ message: "Surat yuklandi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { username, secret, password, id } = req.body;
    const find = await prisma.admin.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!find) {
      return res.status(404).json({ message: "Hisob topilmadi." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.admin.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username,
        secret,
        password: hashedPassword,
      },
    });
    const jwToken = jwt.sign(
      { username, password: hashedPassword, role: find.role },
      JWT_SECRET,
      {
        expiresIn: expirationTime,
      }
    );
    res.status(200).json({
      message: "Hisob ma'lumotlari yangilandi.",
      user: {
        id: find.id,
        token: jwToken,
        role: find.role,
        expirationTime,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { username } = req.admin;
    const find = await prisma.admin.findFirst({
      where: {
        username,
      },
    });
    if (!find) {
      return res.status(404).json({ message: "Hisob topilmadi." });
    }
    await prisma.admin.update({
      where: {
        username,
      },
      data: {
        photo_url: null,
      },
    });
    return res.status(200).json({ message: "Surat o'chirildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const generateSecret = async (req, res) => {
  try {
    const secret = generateBase32Secret();
    return res.status(200).json(secret);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getReceptionAccounts = async (req, res) => {
  try {
    const receptions = await prisma.admin.findMany({
      where: {
        role: "RECEPTION",
      },
    });
    return res.status(200).json({ receptions });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getReceptionAccount = async (req, res) => {
  try {
    const username = req.params.username;
    const reception = await prisma.admin.findUnique({
      where: {
        username,
        role: "RECEPTION",
      },
    });
    return res.status(200).json(reception);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
};
const deleteReceptionAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.admin.delete({
      where: {
        id: parseInt(id),
        role: "RECEPTION",
      },
    });
    return res
      .status(200)
      .json({ message: "Reception hisob muoffaqiyatli o'chirildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const updateReceptionStatus = async (req, res) => {
  try {
    const { username = "", isActive = true } = req.body;
    const find = await prisma.admin.findUnique({
      where: {
        username,
      },
    });
    if (!find) {
      return res.status(404).json({ message: "Reception topilmadi!" });
    }
    await prisma.admin.update({
      where: {
        username,
      },
      data: {
        isActive,
      },
    });
    return res
      .status(200)
      .json({ message: "Reception status muoffaqiyatli yangilandi!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export {
  adminLogin,
  Verify2FA,
  uploadImage,
  updateProfile,
  userProfile,
  deleteImage,
  generateSecret,
  registerUser,
  getReceptionAccounts,
  deleteReceptionAccount,
  updateReceptionStatus,
  getReceptionAccount,
};
