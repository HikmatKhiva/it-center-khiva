import { prisma } from "../../app.js";
import { nanoid, customAlphabet } from "nanoid";
import {
  calculateCourseDuration,
  calculateTotalPaid,
  calculateTotalPrice,
} from "./payment.helper.js";
import { paymentsFormatter } from "../admin/admin.helper.js";
// get all payments
const getPayments = async (req, res) => {
  try {
    const { id } = req.params;
    const payments = await prisma.payment.findMany({
      where: {
        studentId: parseInt(id),
      },
      include: {
        refunds: true,
        createdBy: {
          select: {
            username: true,
            role: true,
          },
        },
      },
    });
    const paymentNotRefund = await prisma.payment.findMany({
      where: {
        studentId: parseInt(id),
        isRefunded: false,
      },
      include: {
        refunds: true,
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
        discount: true,
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
    const totalPrice = calculateTotalPrice(price, duration, student.discount);
    const discountFactor = 1 - Number(student.discount) / 100;
    const monthlyPrice = price * discountFactor;
    const totalPaid = calculateTotalPaid(paymentNotRefund);
    const monthly = await calculateCourseDuration(student);
    const percentagePaid =
      totalPrice > 0 ? Math.min((totalPaid / totalPrice) * 100, 100) : 0;
    return res.status(200).json({
      monthlyPrice,
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
const uploadPayment = async (req, res, next) => {
  try {
    const { studentId, amount, paymentDate } = req.body;
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
    const publicToken = nanoid(32);
    const generateNumber = customAlphabet("1234567890ABCDEF", 6);
    await prisma.$transaction(async (tx) => {
      // 1. Update student
      const updatedStudent = await tx.student.update({
        where: { id: parseInt(studentId) },
        data: {
          debt: {
            decrement: parseInt(amount),
          },
          finishedDate: new Date(),
        },
      });
      // 2. Create payment
      const payment = await tx.payment.create({
        data: {
          amount: parseInt(amount),
          studentId: parseInt(studentId),
          createdAt: new Date(paymentDate),
          createdById: find?.id,
        },
      });
      // 3. Create receipt
      const receipt = await tx.receipt.create({
        data: {
          receiptNo: generateNumber(),
          publicToken,
          amount: parseInt(amount),
          paymentId: payment.id, // link to the payment
          studentId: parseInt(studentId),
        },
      });
      return { updatedStudent, payment, receipt };
    });
    return res.status(201).json({ message: "To'lov muvaffaqiyatli yuklandi." });
  } catch (error) {
    next(error);
  }
};
const paymentRefund = async (req, res, next) => {
  try {
    const admin = req.admin;
    const find = await prisma.admin.findUnique({
      where: {
        username: admin.username,
      },
    });
    if (!find) {
      return res.status(400).json({ message: "Hisob topilmadi!" });
    }
    if (!find.isActive && find.role === "RECEPTION") {
      return res.status(400).json({ message: "Sizda Ruxsat yo'q!" });
    }
    const { paymentId } = req.params;
    const { reason, amount } = req.body;
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
            increment: payment?.amount,
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
      prisma.receipt.update({
        where: {
          paymentId: parsedPaymentId,
        },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      }),
      prisma.refund.create({
        data: {
          reason,
          amount: amount,
          paymentId: parsedPaymentId,
          cancelledById: find?.id,
        },
      }),
    ]);
    return res
      .status(200)
      .json({ message: "To'lov muvaffaqiyatli bekor qilindi!" });
  } catch (error) {
    next(error);
  }
};
const getRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const refund = await prisma.refund.findFirst({
      where: {
        paymentId: parseInt(paymentId, 10),
      },
      include: {
        cancelledBy: {
          select: {
            role: true,
          },
        },
      },
    });
    if (!refund) {
      return res
        .status(404)
        .json({ message: "Bekor qilingan to'lov topilmadi!" });
    }
    return res.status(200).json(refund);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getUnconfirmedPayments = async (req, res) => {
  try {
    let { date, isConfirmed, limit = 10, page = 1, name } = req.query;
    isConfirmed = ["PENDING", "CONFIRMED"].includes(isConfirmed)
      ? isConfirmed
      : "";
    date = date ? new Date(date) : null;
    const data = await prisma.payment.findMany({
      where: {
        ...(isConfirmed && { confirmedStatus: isConfirmed }),
        ...(date && {
          createdAt: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lte: new Date(date.setHours(23, 59, 59, 999)),
          },
        }),
        createdBy: { role: "RECEPTION" }, // only reception staff
        isRefunded: false,
        Student: name
          ? {
              OR: [
                { firstName: { contains: name, mode: "insensitive" } },
                { secondName: { contains: name, mode: "insensitive" } },
              ],
            }
          : undefined,
      },
      include: {
        Student: {
          select: {
            id: true,
            firstName: true,
            secondName: true,
            course: { select: { name: true } },
            Group: {
              select: {
                name: true,
                teacher: { select: { firstName: true, secondName: true } },
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.payment.count({
      where: {
        ...(isConfirmed && { confirmedStatus: isConfirmed }),
        ...(date && {
          createdAt: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lte: new Date(date.setHours(23, 59, 59, 999)),
          },
        }),
        createdBy: { role: "RECEPTION" },
        isRefunded: false,
      },
    });
    const payments = paymentsFormatter(data);
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({ payments, totalPages });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
};
const confirmedPayments = async (req, res) => {
  try {
    const payments = req.body;
    await prisma.$transaction(
      payments.map((payment) =>
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            confirmedStatus: "CONFIRMED",
            confirmedAt: new Date(),
          },
        }),
      ),
    );
    res.status(200).json({ message: "To'lov muvaffaqiyatli yangilandi!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export {
  uploadPayment,
  getPayments,
  paymentRefund,
  getRefund,
  getUnconfirmedPayments,
  confirmedPayments,
};
