import { prisma } from "../../app.js";
// get all newStudents
const getNewStudents = async (req, res) => {
  try {
    const {
      isAttend,
      month,
      courseTime,
      limit = 10,
      page = 1,
      courseId,
    } = req.query;
    const currentYear = new Date().getFullYear();
    const monthNumber = parseInt(month); // Ensure month is an integer
    // Create dates for the start and end of the month
    const startDate = new Date(currentYear, monthNumber - 1, 1);
    const endDate = new Date(currentYear, monthNumber, 0, 23, 59, 59); // Last day of the month
    const students = await prisma.newStudent.findMany({
      where: {
        isAttend,
        courseTime: {
          contains: courseTime,
        },
        ...(courseId && {
          courseId: parseInt(courseId),
        }),
        ...(month && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
      include: {
        course: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.newStudent.count({
      where: {
        isAttend,
        ...(courseId && {
          courseId: parseInt(courseId),
        }),
      },
    });
    const countNewStudents = await prisma.newStudent.count({
      where: {
        isAttend,
        courseTime: {
          contains: courseTime,
        },
        ...(month && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      totalPages,
      students,
      countNewStudents,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// add new student
const addNewStudent = async (req, res) => {
  try {
    const { fullName, phone, courseId, courseTime } = req.body;
    await prisma.newStudent.create({
      data: {
        fullName,
        phone,
        courseId: parseInt(courseId),
        courseTime,
      },
    });
    res.status(201).json({
      message: "Ma'lumotlaringiz bazaga joylandi biz siz bilan bog'lanamiz!",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// update new student status
const updateNewStudent = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const find = await prisma.newStudent.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!find) {
      return res.status(404).json({ message: "Topilmadi." });
    }
    await prisma.newStudent.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isAttend: status,
      },
    });
    res.status(200).json({ message: "Ma'lumotlar yangilandi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// delete new student
const deleteNewStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.newStudent.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Ma'lumotlar o'chirildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { getNewStudents, addNewStudent, updateNewStudent, deleteNewStudent };