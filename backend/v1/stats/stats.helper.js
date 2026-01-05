import { prisma } from "../../app.js";
export async function getTeacherMonthlyReport(teacherId, year, month) {
  try {
    if (!teacherId) throw new Error("Invalid teacherId");
    if (
      typeof year !== "number" ||
      typeof month !== "number" ||
      month < 1 ||
      month > 12
    ) {
      throw new Error("Invalid year or month");
    }
    // 1. Fetch teacher info
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { id: true, firstName: true, secondName: true }, // adjust field name if different
    });
    if (!teacher) throw new Error("Teacher not found");

    // 2. Calculate totalPaid by students of this teacher's groups in the month
    const paidAggregate = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        isRefunded: false,
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
        Student: {
          Group: {
            teacherId: teacherId,
          },
        },
      },
    });
    const totalPaid = Number(paidAggregate._sum.amount) || 0;

    // 3. Calculate totalSalary (50% of totalPaid)
    const totalSalary = totalPaid * 0.5;

    // 4. Calculate expectedSalary based on groups and students count
    const groups = await prisma.group.findMany({
      where: {
        teacherId,
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      select: {
        price: true,
        Students: true,
      },
    });
    const expectedSalary = groups.reduce(
      (sum, group) => sum + Number(group.price) * group.Students.length * 0.5,
      0
    );
    const totalAmount = groups.reduce(
      (sum, group) => sum + Number(group.price) * group.Students.length,
      0
    );
    const monthName = getMonthName(year, month);
    // 5. Build report object
    return {
      teacherName: teacher.firstName + " " + teacher.secondName,
      month: monthName,
      totalPaid,
      totalSalary,
      expectedSalary,
      totalAmount,
      year,
    };
  } catch (error) {
    throw error;
  }
}
export async function calculateAllTeachersSalaries(filterYear, filterMonth) {
  try {
    // Get current year and month from system date
    const now = new Date();
    const year = parseInt(filterYear, 10) || now.getFullYear();
    const month = parseInt(filterMonth, 10) || now.getMonth() + 1; // getMonth() is zero-based
    // Validate year and month (optional but recommended)
    if (typeof year !== "number" || year < 0) {
      throw new Error("Invalid year");
    }
    if (typeof month !== "number" || month < 1 || month > 12) {
      throw new Error("Invalid month");
    }
    // Fetch all teachers
    const teachers = await prisma.teacher.findMany({
      select: { id: true, firstName: true, secondName: true },
    });
    // For each teacher, calculate salary for the current month
    const results = await Promise.all(
      teachers.map(async (teacher) => {
        // Pass year and month to getTeacherMonthlyReport
        return await getTeacherMonthlyReport(teacher.id, year, month);
      })
    );

    return results; // array of { teacherId, teacherName, monthlyReport }
  } catch (error) {
    throw error;
  }
}
export async function calculateIncomeForYear(filterYear) {
  try {
    const results = [];
    const year = filterYear || new Date().getFullYear();

    const activeGroups = await prisma.group.findMany({
      where: { isGroupFinished: false },
      select: {
        id: true,
        price: true,
        Students: {
          select: {
            id: true,
            Payments: {
              where: {
                isRefunded: false,
              },
              include: {
                refunds: true,
              },
            },
          },
        },
        createdAt: true,
        duration: true,
      },
    });

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
      const currentMonth = new Date(year, month, 1);

      const expectedIncome = activeGroups.reduce((acc, group) => {
        const groupStart = new Date(group.createdAt);
        const duration = Number(group.duration) || 0;
        if (duration <= 0) return acc;

        const groupStartMonth = new Date(
          groupStart.getFullYear(),
          groupStart.getMonth(),
          1
        );
        const lastActiveMonth = new Date(
          groupStart.getFullYear(),
          groupStart.getMonth() + duration - 1,
          1
        );

        const isGroupActiveThisMonth =
          currentMonth >= groupStartMonth && currentMonth <= lastActiveMonth;

        if (!isGroupActiveThisMonth) return acc;

        const studentCount = group.Students.length;
        const monthlyPrice = Number(group.price) || 0;
        return acc + monthlyPrice * studentCount;
      }, 0);

      const paymentsThisMonth = await prisma.payment.findMany({
        where: {
          isRefunded: false,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: {
          refunds: true,
        },
      });

      const paidThisMonth = paymentsThisMonth.reduce((total, payment) => {
        const refundedAmount = payment.refunds.reduce(
          (sum, refund) => sum + Number(refund.amount),
          0
        );
        return total + (Number(payment.amount) - refundedAmount);
      }, 0);

      const percentage =
        expectedIncome > 0
          ? Math.floor((paidThisMonth / expectedIncome) * 100)
          : 0;

      results.push({
        month: startOfMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        expectedIncome,
        paidThisMonth,
        percentage,
      });
    }

    return results;
  } catch (error) {
    throw error;
  }
}
export async function calculateStats(filterYear) {
  try {
    const yearFilter = parseInt(filterYear) || new Date().getFullYear();
    const stats = await prisma.$transaction([
      prisma.group.count({
        where: {
          isGroupFinished: false,
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.group.count({
        where: {
          isGroupFinished: true,
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.teacher.count({
        where: {
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.course.count({
        where: {
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.student.count({
        where: {
          Group: {
            isGroupFinished: false,
            createdAt: {
              gte: new Date(yearFilter, 0, 1),
              lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
            },
          },
        },
      }),
      prisma.student.count({
        where: {
          debt: { gt: 0 },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.student.count({
        where: {
          Group: {
            isGroupFinished: true,
            finishedDate: {
              gte: new Date(yearFilter, 0, 1),
              lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
            },
          },
          debt: 0,
        },
      }),
      prisma.student.count({
        where: {
          Group: {
            isGroupFinished: false,
          },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.student.count({
        where: {
          gender: "MALE",
          Group: { isGroupFinished: false, ...yearFilter },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.student.count({
        where: {
          gender: "FEMALE",
          Group: { isGroupFinished: false },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.student.count({
        where: {
          gender: "FEMALE",
          Group: { isGroupFinished: true },
          debt: 0,
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.student.count({
        where: {
          gender: "MALE",
          Group: { isGroupFinished: true },
          debt: 0,
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.newStudent.count({
        where: {
          isAttend: "NOT_CAME",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.newStudent.count({
        where: {
          isAttend: "CAME",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.newStudent.count({
        where: {
          isAttend: "PENDING",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      prisma.newStudent.count({
        where: {
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
    ]);
    const [
      activeGroups,
      finishedGroups,
      totalTeachers,
      totalCourses,
      activeStudents,
      totalDebtors,
      finishedStudents,
      totalStudents,
      totalMaleStudents,
      totalFemaleStudents,
      totalFinishedFemaleStudents,
      totalFinishedMaleStudents,
      totalNewstudentNOT_CAME,
      totalNewstudentCAME,
      totalNewstudentPENDING,
      totalNewstudent,
    ] = stats;
    return {
      stat: "Statistika",
      yearFilter,
      activeStudents,
      activeGroups,
      totalTeachers,
      totalCourses,
      totalMaleStudents,
      totalFemaleStudents,
      totalFinishedFemaleStudents,
      totalFinishedMaleStudents,
      totalStudents,
      totalDebtors,
      finishedStudents,
      finishedGroups,
      totalNewstudentNOT_CAME,
      totalNewstudentCAME,
      totalNewstudent,
      totalNewstudentPENDING,
    };
  } catch (error) {
    throw error;
  }
}

function getMonthName(year, month) {
  const now = new Date();
  // If year/month are not provided, use current year/month
  const y = typeof year === "number" ? year : now.getFullYear();
  // `month` expected as 1–12; convert to 0–11; if not given, use current month (0–11)
  const m = typeof month === "number" ? month - 1 : now.getMonth();
  const date = new Date(y, m, 1);
  return date.toLocaleString("default", {
    month: "long",
  });
}
