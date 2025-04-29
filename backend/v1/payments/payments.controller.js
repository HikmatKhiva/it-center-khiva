import { prisma } from "../../app.js";
import { createCertificate } from "../certificates/certificates.helper.js";
import { calculateTotalPaid, calculateTotalPrice } from "./payment.helper.js";
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
        Group: {
          select: {
            duration: true,
            price: true,
          },
        },
      },
    });
    const { price, duration } = student.Group;
    const totalPrice = calculateTotalPrice(price, duration);
    const totalPaid = calculateTotalPaid(payments);
    const discountAmount = ((price * student.discount) / 100) * duration;
    const percentagePaid =
      ((totalPaid + discountAmount) / parseInt(totalPrice)) * 100;
    return res.status(200).json({
      payments,
      student,
      percentagePaid,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// upload payment a student
const uploadPayment = async (req, res) => {
  try {
    // const { origin } = new URL(req.url, `${req.protocol}://${req.get("host")}`);
    const origin = "https://it-khiva.uz"
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
      return res.status(400).json({ message: "Sizda Ruxat yo'q!" });
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
      },
    });
    await prisma.payment.create({
      data: {
        amount: parseInt(amount),
        studentId: parseInt(studentId),
      },
    });
    const _student = await prisma.student.findUnique({
      where: {
        id: parseInt(studentId),
        debt: 0,
      },
      include: {
        Group: true,
        course: true,
      },
    });
    if (_student) {
      await createCertificate(
        _student,
        _student.Group,
        _student.course.nameCertificate,
        origin
      );
    }
    return res.status(201).json({ message: "To'lov muoffaqiyatli yuklandi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { uploadPayment, getPayments };