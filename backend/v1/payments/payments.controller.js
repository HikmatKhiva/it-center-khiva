import { prisma } from "../../app.js";
import {
  calculateCourseDuration,
  calculateTotalPaid,
  calculateTotalPrice,
} from "./payment.helper.js";
// get all payments
const getPayments = async (req, res) => {
  try {
    const { id } = req.params;
    const payments = await prisma.payment.findMany({
      where: {
        studentId: parseInt(id),
      },
    });
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        firstName: true,
        secondName: true,
        discount: true,
        debt: true,
        createdAt: true,
        Group: {
          select: {
            duration: true,
            price: true,
          },
        },
        Payments: true,
      },
    });
    const { price, duration } = student.Group;
    const totalPrice = calculateTotalPrice(price, duration);
    const totalPaid = calculateTotalPaid(payments);
    const monthly = await calculateCourseDuration(student);
    const discountAmount = ((price * student.discount) / 100) * duration;
    const percentagePaid =
      ((totalPaid + discountAmount) / parseInt(totalPrice)) * 100;
    return res.status(200).json({
      payments,
      student,
      percentagePaid,
      monthly,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// upload payment a student
const uploadPayment = async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    const username = req.admin.username;
    const find = await prisma.admin.findUnique({
      where: {
        username,
      },
    });
    if (!find) {
      return res.status(400).json({ message: "Hisob topilmadi!" });
    }
    if (!find.isActive && find.role === "RECEPTION") {
      return res.status(400).json({ message: "Sizda Ruxsat yo'q!" });
    }
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(studentId),
      },
    });
    if (!student) {
      return res.status(404).json({ message: "O'quvchi toplimadi." });
    }
    if (parseInt(student?.debt) < parseInt(amount)) {
      return res
        .status(400)
        .json({ message: "To'lov miqdori qarz miqdoridan yuqori!" });
    }
    await prisma.student.update({
      where: {
        id: parseInt(studentId),
      },
      data: {
        debt: parseInt(student.debt) - parseInt(amount),
        finishedDate: new Date(),
      },
    });
    await prisma.payment.create({
      data: {
        amount: parseInt(amount),
        studentId: parseInt(studentId),
      },
    });
    return res.status(201).json({ message: "To'lov muoffaqiyatli yuklandi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { uploadPayment, getPayments };