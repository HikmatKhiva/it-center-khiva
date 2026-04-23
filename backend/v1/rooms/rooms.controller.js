import { prisma } from "../../app.js";
import { formatSchedules, formatSchedulesByDay } from "./room.helper.js";
const getRooms = async (req, res) => {
  try {
    const { name, limit = 10, page = 1 } = req.query;
    const rooms = await prisma.room.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      skip: (page - 1) * limit,
      include: {
        schedules: true,
      },
      take: parseInt(limit),
    });
    const totalCount = await prisma.room.count({
      where: {
        name: {
          contains: name,
        },
      },
    });
    const data = formatSchedulesByDay(rooms);
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({ rooms: data, totalPages, totalCount });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, weekType } = req.query;
    const where = {};
    const isValidWeekType = ["ODD", "EVEN"].includes(weekType?.trim());
    if (isValidWeekType) {
      where.weekType = { equals: weekType }; 
    }
    if (time) {
      where.time = { equals: time }; 
    }
    const room = await prisma.room.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        schedules: {
          where,
          select: {
            time: true,
            weekType: true,
            group: {
              select: {
                name: true,
                isActive: true,
                teacher: {
                  select: {
                    firstName: true,
                    secondName: true,
                  },
                },
                _count: {
                  select: {
                    Students: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!room) {
      return res.status(404).json({ message: "Xona topilmadi." });
    }
    const formatterRoom = formatSchedules(room);
    return res.status(200).json(formatterRoom);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getRoomTime = async (req, res) => {
  try {
    const { id } = req.params;
    let { weekType } = req.query;
    weekType = ["ODD", "EVEN"].includes(weekType?.trim())
      ? weekType?.trim()
      : null;
    const room = await prisma.room.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!room) {
      return res.status(404).json({ message: "Xona topilmadi." });
    }
    const busySlots = await prisma.schedule.findMany({
      where: {
        roomId: room.id,
        ...(weekType && { weekType: weekType?.toUpperCase() }),
      },
      select: { time: true },
    });
    let slots = new Array();
    let allTime = [
      { value: "T09_00", label: "9:00" },
      { value: "T11_00", label: "11:00" },
      { value: "T14_00", label: "14:00" },
      { value: "T16_00", label: "16:00" },
    ];

    if (busySlots.length === 0) {
      slots = allTime;
    }
    slots = allTime.map((t) => ({
      ...t,
      disabled: busySlots.some((b) => b.time === t.value),
    }));
    return res.status(200).json({ slots });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
};
const createRoom = async (req, res, next) => {
  try {
    const { name, capacity } = req.body;
    await prisma.room.create({
      data: {
        name,
        capacity,
      },
    });
    return res.status(201).json({ message: "Xona muvaffaqiyatli yaratildi." });
  } catch (error) {
    next(error);
  }
};
const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;
    await prisma.room.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        capacity,
      },
    });
    return res.status(200).json({ message: "Xona muvaffaqiyatli yangilandi." });
  } catch (error) {
    next(error);
  }
};
const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);
    const schedulesCount = await prisma.schedule.count({
      where: { roomId: roomId },
    });
    if (schedulesCount > 0) {
      return res.status(400).json({
        message:
          "Bu xona jadval yoki guruhlarga biriktirilgani uchun o'chirib bo'lmaydi.",
      });
    }
    await prisma.room.delete({
      where: {
        id: parseInt(roomId),
      },
    });
    return res.status(200).json({ message: "Xona muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};
export { createRoom, deleteRoom, getRoom, getRooms, updateRoom, getRoomTime };
