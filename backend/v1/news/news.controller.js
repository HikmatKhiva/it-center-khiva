import dotenv from "dotenv";
import fs from "fs";
import slugify from "slugify";
import { prisma } from "../../app.js";
import Ajv from "ajv";
import {  newsSchema } from "./news.validator.js";
import { promisify } from "util";
import cloudinary from "../../db/db.js";
const ajv = new Ajv({ allErrors: true });
const unlinkAsync = promisify(fs.unlink); // Promisify fs.unlink for async/await
dotenv.config();
const { LOGO_URL } = process.env;
// create a news
const createNews = async (req, res) => {
  try {
    const image = req.file;
    const { title, description, content, createdAt } = req.body;
    const validate = ajv.compile(newsSchema);
    const valid = validate(req.body);
    const error = validate.errors ? validate.errors : "Validation failed";
    if (!valid) {
      return res
        .status(400)
        .json({ message: `${error[0].instancePath} ${error[0].message}` });
    }
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });
    let imageUrl;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "news",
      });
      imageUrl = result.url;
      unlinkAsync(image.path);
    }
    await prisma.news.create({
      data: {
        slug,
        description,
        title,
        photo_url: imageUrl ? imageUrl : LOGO_URL, // Conditionally add photo_url
        createdAt,
        content,
      },
    });
    return res
      .status(201)
      .json({ message: "Yangilik muoffaqiyatli yaratildi." });
  } catch (error) {
    res.status(500).json(error);
  }
};
// get all news
const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const news = await prisma.news.findMany({
      where: {
        title: {
          contains: name,
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.news.count({
      where: {
        title: {
          contains: name,
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      news,
      totalPages,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
//  get a news
const getNews = async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await prisma.news.findUnique({
      where: {
        slug,
      },
    });
    return res.status(200).json(news);
  } catch (error) {
    res.status(500).json(error);
  }
};
// delete a news
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Muoffaqiyatli o'chirildi." });
  } catch (error) {
    res.status(500).json(error);
  }
};
// update a news
const updateNews = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, content, createdAt } = req.body;
    const validate = ajv.compile(newsSchema);
    const valid = validate(req.body);
    const error = validate.errors ? validate.errors : "Validation failed";
    if (!valid) {
      return res
        .status(400)
        .json({ message: `${error[0].instancePath} ${error[0].message}` });
    }
    let imageUrl;
    if (req.file) {
      const image = req.file;
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "news",
      });
      imageUrl = result.url;
      unlinkAsync(image.path);
    }
    await prisma.news.update({
      where: {
        slug,
      },
      data: {
        title,
        description,
        content,
        createdAt,
        ...(imageUrl && { photo_url: imageUrl }), // Conditionally add photo_url
      },
    });
    return res.status(200).json({ message: "Muoffaqiyatli yangilandi." });
  } catch (error) {
    res.status(500).json(error);
  }
};
export { createNews, getAllNews, getNews, deleteNews, updateNews };