import { Prisma } from "@prisma/client";
import { prisma } from "../../app.js";
import { formatterGroups, calculateDebt } from "./group.helper.js";
// getAll groups
const getAllGroup = async (req, res) => {
  try {
    let {
      name,
      isGroupFinished,
      limit = 10,
      page = 1,
      year,
      orderBy,
    } = req.query;
    const yearFilter = parseInt(year, 10) || new Date().getFullYear();
    orderBy = orderBy || "asc";
    const groups = await prisma.group.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
        isGroupFinished: isGroupFinished === "true",
        createdAt: {
          gte: new Date(yearFilter, 0, 1),
          lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
      select: {
        id: true,
        name: true,
        // groupTime: true,
        duration: true,
        finishedDate: true,
        Students: true,
        price: true,
        createdAt: true,
        isGroupFinished: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            secondName: true,
          },
        },
        course: {
          select: {
            name: true,
            nameCertificate: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.group.count({
      where: {
        name: {
          contains: name,
        },
        createdAt: {
          gte: new Date(yearFilter, 0, 1),
          lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
        },
        isGroupFinished: isGroupFinished === "true" ? true : false,
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      groups,
      totalPages,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
};
// create a group
const createGroup = async (req, res) => {
  try {
    let { teacherId, name, courseId, duration, price, schedules } = req.body;
    duration = parseInt(duration, 10);
    if (duration > 13) {
      return res.status(400).json({ message: "Oy xato kiritildi." });
    }
    await prisma.group.create({
      data: {
        teacherId: parseInt(teacherId, 10),
        name,
        courseId: parseInt(courseId, 10),
        duration: duration,
        price: new Prisma.Decimal(price),
        schedules: {
          create: {
            weekType: schedules.weekType,
            time: schedules.time,
            roomId: parseInt(schedules.roomId),
          },
        },
      },
    });
    return res.status(201).json({ message: "Guruh muvaffaqiyatli yaratildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// update a group
const updateGroup = async (req, res) => {
  try {
    const { teacherId, schedules } = req.body;
    const { id } = req.params;
    // Add six months to the current date
    await prisma.group.update({
      where: {
        id: parseInt(id),
      },
      data: {
        teacherId: parseInt(teacherId),
        schedules: {
          deleteMany: {},
          create: {
            ...schedules,
            roomId: parseInt(schedules.roomId, 10),
          },
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Guruh muvaffaqiyatli yangilandi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// get a group
const getGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
        // groupTime: true,
        isActive: true,
        startTime: true,
        duration: true,
        finishedDate: true,
        Students: true,
        price: true,
        createdAt: true,
        isGroupFinished: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            secondName: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            nameCertificate: true,
          },
        },
        schedules: true,
      },
    });
    if (!group) {
      return res.status(404).json({ message: "Guruh topilmadi." });
    }
    return res.status(200).json(group);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
// delete a group
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id); // Ensure groupId is defined
    await prisma.$transaction([
      // 1) Delete schedules that reference this group
      prisma.schedule.deleteMany({
        where: { groupId },
      }),
      // 2) Delete payments for students in this group
      prisma.payment.deleteMany({
        where: {
          Student: {
            groupId,
          },
        },
      }),
      // 3) Delete students in this group
      prisma.student.deleteMany({
        where: { groupId },
      }),

      // 4) Delete the group
      prisma.group.delete({
        where: { id: groupId },
      }),
    ]);

    return res.status(200).json({ message: "Guruh muvaffaqiyatli o'chirildi" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the group." });
  }
};
// get a opened group
const getNewGroups = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const data = await prisma.group.findMany({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
        isGroupFinished: false,
      },
      select: {
        createdAt: true,
        course: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            firstName: true,
            secondName: true,
          },
        },
        schedules: {
          select: {
            Room: {
              select: {
                name: true,
              },
            },
            weekType: true,
            time: true,
          },
        },
      },
    });
    const groups = await formatterGroups(data);
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// activate a  group
const activateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    const { startTime, finishedDate } = req.body;
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      return res.status(404).json({ message: "Guruh topilmadi." });
    }
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Activate the group
      const group = await tx.group.update({
        where: { id: groupId },
        data: {
          isActive: true,
          startTime: startTime,
          finishedDate: finishedDate,
        },
      });

      // 2️⃣ Fetch students in the group
      const students = await tx.student.findMany({ where: { groupId } });
      // 3️⃣ Calculate and update debt for each student
      const updates = students.map((student) => {
        const debt =
          parseInt(group.price) *
          parseInt(group.duration) *
          (1 - student.discount / 100);
        return tx.student.update({
          where: { id: student.id },
          data: { debt, debtStatus: "ACTIVE", createdAt: startTime },
        });
      });

      // Run all updates in parallel inside transaction
      await Promise.all(updates);

      return { group, updatedStudents: students.length };
    });

    return res.status(200).json({ message: "Guruh faollashtirildi!" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
};
// finish a group
const finishGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const find = await prisma.group.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!find) {
      return res.status(404).json({ message: "Guruh topilmadi!" });
    }
    await prisma.group.update({
      where: {
        id: parseInt(id),
      },
      data: {
        schedules: {
          deleteMany: {},
        },
        isGroupFinished: true,
        finishedDate: now,
      },
    });
    return res.status(200).json({ message: "Guruh yakunlandi!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export {
  getAllGroup,
  createGroup,
  getGroup,
  deleteGroup,
  getNewGroups,
  updateGroup,
  finishGroup,
  activateGroup,
};
