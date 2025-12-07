import { prisma } from "../../app.js";
import fs from "fs";
import { promisify } from "util";
import cloudinary from "../../db/db.js";
const unlinkAsync = promisify(fs.unlink); // Promisify fs.unlink for async/await
// getAll teacher
const getAllTeacher = async (req, res) => {
  try {
    const { name, limit = 10, page = 1 } = req.query;
    const teachers = await prisma.teacher.findMany({
      where: {
        firstName: {
          contains: name,
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.teacher.count({
      where: {
        firstName: {
          contains: name,
        },
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      teachers,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// create a teacher
const createTeacher = async (req, res) => {
  try {
    const { firstName, secondName, phone } = req.body;
    let imageUrl;
    if (req.file) {
      const image = req.file;
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "teachers",
      });
      imageUrl = result.url;
      unlinkAsync(image.path);
    }
    await prisma.teacher.create({
      data: {
        firstName,
        secondName,
        ...(imageUrl && { photo_url: imageUrl }), // Conditionally add photo_url
        phone,
      },
    });
    return res.status(201).json({ message: "Ustoz muoffaqiyatli yaratildi." });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error });
  }
};
// update a teacher
const updateTeacher = async (req, res) => {
  try {
    const { firstName, secondName, phone } = req.body;
    const { id } = req.params;
    let imageUrl;
    if (req.file) {
      const image = req.file;
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "teachers",
      });
      imageUrl = result.url;
      unlinkAsync(image.path);
    }
    await prisma.teacher.update({
      where: {
        id: parseInt(id),
      },
      data: {
        firstName,
        secondName,
        phone,
        ...(imageUrl && { photo_url: imageUrl }), // Conditionally add photo_url
      },
    });
    return res.status(200).json({ message: "Ustoz muoffaqiyatli yangilandi." });
  } catch (error) {

    return res.status(500).json({ error });
  }
};
// delete a teacher
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.teacher.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Ustoz muoffaqiyatli o'chirildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const handleDeleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.teacher.update({
      where: {
        id: parseInt(id),
      },
      data: {
        photo_url: null,
      },
    });
    return res
      .status(200)
      .json({ message: "Ustoz surati muoffaqiyatli o'chirildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export {
  getAllTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  handleDeleteImage,
};