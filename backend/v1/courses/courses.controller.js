import { prisma } from "../../app.js";
// getAll courses
const getAllCourse = async (req, res) => {
  try {
    const { name, limit = 10, page = 1 } = req.query;
    const courses = await prisma.course.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            secondName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.course.count({
      where: {
        name: {
          contains: name,
        },
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      totalPages,
      courses,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// get a course
const getACourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// create a course
const createCourse = async (req, res) => {
  try {
    const { name, teacherId, nameCertificate } = req.body;
    await prisma.course.create({
      data: {
        name,
        teacherId: parseInt(teacherId),
        nameCertificate,
      },
    });
    return res.status(201).json({ message: "Kurs muffaqiyatli yaratildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// update a course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, teacherId, nameCertificate } = req.body;
    await prisma.course.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        teacherId: parseInt(teacherId),
        nameCertificate,
      },
    });
    res.status(200).json({
      message: "Kurs muffaqiyatli yangilandi.",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Kurs muffaqiyatli o'chirildi." });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error });
  }
};
export { getAllCourse, getACourse, createCourse, deleteCourse, updateCourse };