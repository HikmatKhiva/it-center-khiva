import { prisma } from "../../app.js";
import bcrypt from "bcrypt";
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
    const id = req.params.id;
    const reception = await prisma.admin.findUnique({
      where: {
        id: parseInt(id),
        role: "RECEPTION",
      },
    });
    return res.status(200).json(reception);
  } catch (error) {

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
const updateReception = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, secret, password } = req.body;
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
    res.status(200).json({
      message: "Hisob ma'lumotlari yangilandi.",
    });
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
  getReceptionAccounts,
  getReceptionAccount,
  deleteReceptionAccount,
  updateReception,
  updateReceptionStatus,
};