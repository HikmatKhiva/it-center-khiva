import { prisma } from "../../app.js";
import { calculateDebt, generateStudentCode } from "./students.helper.js";
// get all users
const getAllStudents = async (req, res) => {
  try {
    const { limit = 1, page = 1, name, groupId } = req.query;
    const students = await prisma.student.findMany({
      where: {
        firstName: {
          contains: name,
        },
        ...(groupId && { groupId: parseInt(groupId) }),
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.student.count({
      where: {
        firstName: {
          contains: name,
        },
        ...(groupId && { groupId: parseInt(groupId) }),
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({ students, totalPages });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// get a user
const getAStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi." });
    }
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// create a user
const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      secondName,
      passportId,
      groupId,
      courseId,
      discount,
      gender,
      phone,
    } = req.body;
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(groupId),
      },
    });
    if (!group) return res.status(404).json({ message: "Guruh topilmadi!" });
    if (group.isGroupFinished) {
      return res.status(400).json({ message: "Guruh yakunlangan!" });
    }
    const student = await prisma.student.findUnique({
      where: {
        passportId,
      },
    });
    if (student) {
      return res
        .status(400)
        .json({ message: "Passport ID ma'lumotlar bazasida mavjud!" });
    }
    const code = await generateStudentCode();
    const debt = await calculateDebt(groupId, discount);
    await prisma.student.create({
      data: {
        firstName,
        secondName,
        passportId,
        groupId,
        courseId,
        debt,
        code,
        discount: parseInt(discount),
        gender: gender.toUpperCase(),
        phone,
      },
    });
    return res
      .status(201)
      .json({ message: "O'quvchi muoffaqiyatli yaratildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, secondName, passportId, gender, phone } = req.body;
    await prisma.student.update({
      where: {
        id: parseInt(id),
      },
      data: {
        firstName,
        secondName,
        passportId,
        gender: gender.toUpperCase(),
        phone,
      },
    });
    return res
      .status(200)
      .json({ message: "O'quvchi muoffaqiyatli yangilandi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "O'quvchi muoffaqiyatli o'chirildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export {
  getAllStudents,
  getAStudent,
  createStudent,
  deleteStudent,
  updateStudent,
};