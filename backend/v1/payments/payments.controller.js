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
    const paymentNotRefund = await prisma.payment.findMany({
      where: {
        studentId: parseInt(id),
        isRefunded: false,
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
    const totalPaid = calculateTotalPaid(paymentNotRefund);
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
    console.log(error);

    return res.status(500).json({ error });
  }
};
// upload payment a student
const uploadPayment = async (req, res) => {
  try {
    const { studentId, amount, paymentDate } = req.body;
    // const username = req.admin.username;
    // const find = await prisma.admin.findUnique({
    //   where: {
    //     username,
    //   },
    // });
    // if (!find) {
    //   return res.status(400).json({ message: "Hisob topilmadi!" });
    // }
    // if (!find.isActive && find.role === "RECEPTION") {
    //   return res.status(400).json({ message: "Sizda Ruxsat yo'q!" });
    // }
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
    await prisma.$transaction([
      prisma.student.update({
        where: {
          id: parseInt(studentId),
        },
        data: {
          debt: parseInt(student.debt) - parseInt(amount),
          finishedDate: new Date(),
        },
      }),
      prisma.payment.create({
        data: {
          amount: parseInt(amount),
          studentId: parseInt(studentId),
          createdAt: new Date(paymentDate),
        },
      }),
    ]);
    return res.status(201).json({ message: "To'lov muoffaqiyatli yuklandi." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const paymentRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason, amount } = req.body;
    console.log(reason);
    
    const parsedPaymentId = parseInt(paymentId, 10);
    const payment = await prisma.payment.findUnique({
      where: { id: parsedPaymentId },
      include: { Student: true },
    });
    if (!payment || payment.isRefunded) {
      return res
        .status(400)
        .json({ message: "To'lov topilmadi yoki allaqachon bekor qilingan" });
    }
    if (payment.amount < amount) {
      return res
        .status(400)
        .json({ message: "Bekor qilish miqdori to'lov miqdoridan yuqori!" });
    }
    await prisma.$transaction([
      prisma.student.update({
        where: { id: payment.studentId },
        data: {
          debt: {
            increment: amount,
          },
        },
      }),
      prisma.payment.update({
        where: { id: parsedPaymentId },
        data: {
          status: "Refunded",
          isRefunded: true,
          refundedAt: new Date(),
        },
      }),
      prisma.refund.create({
        data: {
          reason,
          amount: amount,
          paymentId: parsedPaymentId,
        },
      }),
    ]);
    return res
      .status(200)
      .json({ message: "To'lov muoffaqiyatli bekor qilindi!" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
};
const getRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const refund = await prisma.refund.findFirst({
      where: {
        paymentId: parseInt(paymentId, 10),
      },
    });
    if (!refund) {
      return res
        .status(404)
        .json({ message: "Bekor qilingan to'lov topilmadi!" });
    }
    return res.status(200).json(refund);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export { uploadPayment, getPayments, paymentRefund, getRefund };
