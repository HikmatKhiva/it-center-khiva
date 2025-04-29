import { prisma } from "../../app.js";
// save a Message
const createMessage = async (req, res) => {
  try {
    const { fullName, message } = req.body;
    await prisma.messages.create({
      data: {
        fullName,
        message,
      },
    });
    return res
      .status(201)
      .json({ message: "Xabar muffaqiyatli yozib olindi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// get all Messages
const getMessages = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const messages = await prisma.messages.findMany({
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });
    const totalCount = await prisma.messages.count();
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      messages,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// delete a Message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.messages.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Xabar o'chirildi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { createMessage, getMessages, deleteMessage };