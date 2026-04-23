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
      year,
    } = req.query;
    const currentYear = parseInt(year) || new Date().getFullYear();
    const monthNumber = parseInt(month); // Ensure month is an integer
    // Create dates for the start and end of the month
    const startDate = new Date(currentYear, monthNumber - 1, 1);
    const endDate = new Date(currentYear, monthNumber, 0, 23, 59, 59); // Last day of the month
    const students = await prisma.newStudent.findMany({
      where: {
        ...(isAttend && {
          isAttend,
        }),
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
        ...(isAttend && {
          isAttend,
        }),
        ...(courseId && {
          courseId: parseInt(courseId),
        }),
      },
    });
    const countNewStudents = await prisma.newStudent.count({
      where: {
        isAttend: "PENDING",
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
const addNewStudent = async (req, res, next) => {
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
    next(error);
  }
};
// update new student status
const updateNewStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { courseId, fullName, isAttend, reason } = req.body;
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
        isAttend,
        courseId: parseInt(courseId, 10),
        fullName,
        reason: reason ? reason : null,
      },
    });
    res.status(200).json({ message: "Ma'lumotlar yangilandi." });
  } catch (error) {
    next(error);
  }
};
// delete new student
const deleteNewStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.newStudent.delete({
      where: {
        id: parseInt(id, 10),
        AND: [{ isAttend: "PENDING" }],
      },
    });
    res.status(200).json({ message: "Ma'lumotlar o'chirildi." });
  } catch (error) {
    next(error);
  }
};
export { getNewStudents, addNewStudent, updateNewStudent, deleteNewStudent };
