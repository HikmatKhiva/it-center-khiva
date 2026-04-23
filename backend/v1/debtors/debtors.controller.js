import { prisma } from "../../app.js";
import { filterStudents } from "./debtors.helper.js";
const getAllMonthlyDebtors = async (req, res) => {
  try {
    let { month, limit = 10, page = 1, name, year, orderBy } = req.query;
    orderBy = !["desc", "asc"].includes(orderBy) ? "asc" : orderBy;
    const yearFilter = parseInt(year, 10) || new Date().getFullYear();
    const currentDate = new Date();
    const monthNumber = parseInt(month)
      ? parseInt(month)
      : currentDate.getMonth() + 1;
    limit = parseInt(limit);
    page = parseInt(page);
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = monthNumber
      ? new Date(currentYear, monthNumber - 1, 1)
      : new Date(currentYear, currentDate.getMonth(), 1);
    const currentMonth = firstDayOfMonth.toLocaleString("default", {
      month: "long",
    });
    const lastDayOfMonth = monthNumber
      ? new Date(currentYear, monthNumber, 0, 23, 59, 59)
      : new Date(currentYear, currentDate.getMonth() + 1, 0);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const students = await prisma.student.findMany({
      where: {
        debt: { gt: 0 },
        Group: {
          isActive: {
            in: ["ACTIVE", "FINISHED"],
          },
        },
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
        firstName: true,
        secondName: true,
        passportId: true,
        createdAt: true,
        debt: true,
        discount: true,
        Group: {
          select: {
            id: true,
            name: true,
            price: true,
            startTime: true,
            teacher: {
              select: {
                firstName: true,
                secondName: true,
              },
            },
          },
        },
        course: { select: { name: true } },
        Payments: {
          where: {
            isRefunded: false,
            createdAt: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth,
            },
          },
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
    });
    const debtors = await filterStudents(students, name);
    const paginatedDebtors = debtors.slice(startIndex, endIndex);
    const totalPages = Math.ceil(debtors.length / limit);
    res.status(200).json({
      debtors: paginatedDebtors,
      totalPages,
      currentMonth,
      count: debtors.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching data." });
  }
};
export { getAllMonthlyDebtors };