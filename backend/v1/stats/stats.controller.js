import { prisma } from "../../app.js";
import {
  calculateIncomeForYear,
  calculateAllTeachersSalaries,
} from "./stats.helper.js";
// get stats
const getStats = async (req, res) => {
  try {
    const activeGroups = await prisma.group.count({
      where: {
        isGroupFinished: false,
      },
    });
    const finishedGroups = await prisma.group.count({
      where: {
        isGroupFinished: true,
      },
    });
    const totalTeachers = await prisma.teacher.count();
    const totalCourses = await prisma.course.count();
    const activeStudents = await prisma.student.count({
      where: {
        Group: {
          isGroupFinished: false,
        },
      },
    });
    const finishedStudents = await prisma.student.count({
      where: {
        Group: {
          isGroupFinished: true,
        },
      },
    });
    const totalStudents = await prisma.student.count();
    const totalMaleStudents = await prisma.student.count({
      where: {
        gender: "MALE",
      },
    });
    const totalFinishedFemaleStudents = await prisma.student.count({
      where: {
        gender: "FEMALE",
        Group: {
          isGroupFinished: true,
        },
      },
    });
    const totalFinishedMaleStudents = await prisma.student.count({
      where: {
        gender: "MALE",
        Group: {
          isGroupFinished: true,
        },
      },
    });
    const totalFemaleStudents = await prisma.student.count({
      where: {
        gender: "FEMALE",
      },
    });
    res.status(200).json([
      {
        stat: "Statistika",
        activeStudents,
        activeGroups,
        totalTeachers,
        totalCourses,
        totalMaleStudents,
        totalFemaleStudents,
        totalFinishedFemaleStudents,
        totalFinishedMaleStudents,
        totalStudents,
        finishedStudents,
        finishedGroups,
      },
    ]);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getYearlyIncome = async (req, res) => {
  try {
    const yearly = await calculateIncomeForYear();
    res.status(200).json(yearly);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getTeachersSalary = async (req, res) => {
  try {
    const teachers = await calculateAllTeachersSalaries();
    res.status(200).json(teachers);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { getStats, getTeachersSalary, getYearlyIncome };
