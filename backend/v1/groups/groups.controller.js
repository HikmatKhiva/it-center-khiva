import { prisma } from "../../app.js";
import { formatterGroups } from "./group.helper.js";
// getAll groups
const getAllGroup = async (req, res) => {
  try {
    const { name, isGroupFinished, limit = 10, page = 1 } = req.query;
    const groups = await prisma.group.findMany({
      where: {
        name: {
          contains: name,
        },
        isGroupFinished: isGroupFinished === "true",
      },
      select: {
        id: true,
        name: true,
        groupTime: true,
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
        isGroupFinished: isGroupFinished === "true" ? true : false,
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      groups,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// create a group
const createGroup = async (req, res) => {
  try {
    let { teacherId, name, courseId, duration, price, groupTime } = req.body;
    if (duration > 13) {
      return res.status(400).json({ message: "Oy xato kiritildi." });
    }
    let currentDate = new Date();
    // Add  months to the current date
    currentDate.setMonth(currentDate.getMonth() + duration);
    await prisma.group.create({
      data: {
        teacherId: parseInt(teacherId),
        name,
        courseId: parseInt(courseId),
        duration,
        finishedDate: currentDate,
        price,
        groupTime,
      },
    });
    return res.status(201).json({ message: "Guruh muoffaqiyatli yaratildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// update a group
const updateGroup = async (req, res) => {
  try {
    const { teacherId, groupTime } = req.body;
    const { id } = req.params;
    // Add six months to the current date
    await prisma.group.update({
      where: {
        id: parseInt(id),
      },
      data: {
        teacherId: parseInt(teacherId),
        groupTime,
      },
    });
    return res.status(200).json({ message: "Guruh muoffaqiyatli yangilandi." });
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
        groupTime: true,
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
      },
    });
    if (!group) {
      return res.status(404).json({ message: "Guruh topilmadi." });
    }
    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// delete a group
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id); // Ensure groupId is defined
    // Step 1: Delete payments associated with students in the group
    await prisma.payment.deleteMany({
      where: {
        Student: {
          groupId: groupId, // Use the correct variable here
        },
      },
    });

    // Step 2: Delete students in the group
    await prisma.student.deleteMany({
      where: {
        groupId: groupId,
      },
    });
    // Step 3: Delete the group itself
    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });
    return res.status(200).json({ message: "Guruh muoffaqiyatli o'chirildi" });
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
        groupTime: true,
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
      },
    });
    const groups = await formatterGroups(data);
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// get stats
const getStats = async (req, res) => {
  try {
    const active_groups_count = await prisma.group.count({
      where: {
        isGroupFinished: false,
      },
    });
    const total_teachers_count = await prisma.teacher.count();
    const total_courses_count = await prisma.course.count();
    const active_students_count = await prisma.student.count({
      where: {
        Group: {
          isGroupFinished: false,
        },
      },
    });
    res.status(200).json({
      active_students_count,
      active_groups_count,
      total_teachers_count,
      total_courses_count,
    });
  } catch (error) {
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
  getStats,
  updateGroup,
  finishGroup,
};
