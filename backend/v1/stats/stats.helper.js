// import { IsActive } from "@prisma/client";
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
      select: { id: true, firstName: true, secondName: true },
    });
    if (!teacher) throw new Error("Teacher not found");
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    // 2. Calculate totalPaid by students of this teacher's groups in the month (with refunds)
    const paymentsThisMonth = await prisma.payment.findMany({
      where: {
        isRefunded: false,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        Student: {
          Group: {
            teacherId: teacherId,
          },
        },
      },
      include: {
        refunds: true,
      },
    });

    const totalPaid = paymentsThisMonth.reduce((total, payment) => {
      const refundedAmount = payment.refunds.reduce(
        (sum, refund) => sum + Number(refund.amount),
        0,
      );
      return total + (Number(payment.amount) - refundedAmount);
    }, 0);

    // 3. Calculate expectedSalary based on active groups with student discounts
    const groups = await prisma.group.findMany({
      where: {
        teacherId,
        isActive: "ACTIVE", // Only active groups
        createdAt: {
          lt: endOfMonth, // Group must have started by end of month
        },
      },
      select: {
        id: true,
        price: true,
        createdAt: true,
        duration: true,
        Students: {
          select: {
            discount: true,
          },
        },
      },
    });

    let expectedSalary = 0;
    const currentMonthDate = new Date(year, month - 1, 1);

    groups.forEach((group) => {
      const groupStart = new Date(group.createdAt);
      const duration = Number(group.duration) || 0;

      if (duration <= 0) return;

      const groupStartMonth = new Date(
        groupStart.getFullYear(),
        groupStart.getMonth(),
        1,
      );
      const lastActiveMonth = new Date(
        groupStart.getFullYear(),
        groupStart.getMonth() + duration - 1,
        1,
      );

      // Check if group was active this month
      const isGroupActiveThisMonth =
        currentMonthDate >= groupStartMonth &&
        currentMonthDate <= lastActiveMonth;
      if (!isGroupActiveThisMonth) return;
      // Calculate expected income with student discounts
      const monthlyExpectedIncome = group.Students.reduce(
        (groupTotal, student) => {
          const discountFactor = 1 - Number(student.discount) / 100;
          const studentMonthlyPrice = Number(group.price) * discountFactor;
          return groupTotal + studentMonthlyPrice;
        },
        0,
      );
      // Teacher gets 50% of expected income
      expectedSalary += monthlyExpectedIncome * 0.5;
    });
    const totalSalary = totalPaid * 0.5; // 50% of actual payments
    const totalAmount = expectedSalary * 2; // Full expected amount (before teacher split)
    const monthName = getMonthName(year, month);
    return {
      teacherName: `${teacher.firstName} ${teacher.secondName}`,
      month: monthName,
      totalPaid: Number(totalPaid.toFixed(2)),
      totalSalary: Number(totalSalary.toFixed(2)),
      expectedSalary: Number(expectedSalary.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      year,
    };
  } catch (error) {
    console.error("Error in getTeacherMonthlyReport:", error);
    throw error;
  }
}
export async function calculateAllTeachersSalaries(filterYear, filterMonth) {
  console.log(filterMonth, "filterMonth");
  // console.log(filterYear);

  try {
    const now = new Date();
    const year = parseInt(filterYear, 10) || now.getFullYear();
    const month = parseInt(filterMonth, 10) || now.getMonth() + 1;
    console.log(month);

    if (typeof year !== "number" || year < 0) {
      throw new Error("Invalid year");
    }
    if (typeof month !== "number" || month < 1 || month > 12) {
      throw new Error("Invalid month");
    }

    const teachers = await prisma.teacher.findMany({
      select: { id: true, firstName: true, secondName: true },
      // where: {
      //   Groups: {
      //     some: {
      //       isGroupFinished: false,
      //     },
      //   },
      // },
    });
    const results = await Promise.all(
      teachers.map(async (teacher) => {
        return await getTeacherMonthlyReport(teacher.id, year, month);
      }),
    );
    return results.filter(
      (report) => report.totalPaid > 0 || report.expectedSalary > 0,
    );
  } catch (error) {
    console.error("Error in calculateAllTeachersSalaries:", error);
    throw error;
  }
}
export async function calculateIncomeForYear(filterYear) {
  try {
    const results = [];
    const year = filterYear || new Date().getFullYear();

    const activeGroups = await prisma.group.findMany({
      where: { isActive: "ACTIVE" },
      select: {
        id: true,
        price: true,
        Students: {
          select: {
            id: true,
            discount: true, // Include discount for calculation
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

      // FIXED: Calculate expected income with student discounts applied
      const expectedIncome = activeGroups.reduce((acc, group) => {
        const groupStart = new Date(group.createdAt);
        const duration = Number(group.duration) || 0;
        if (duration <= 0) return acc;

        const groupStartMonth = new Date(
          groupStart.getFullYear(),
          groupStart.getMonth(),
          1,
        );
        const lastActiveMonth = new Date(
          groupStart.getFullYear(),
          groupStart.getMonth() + duration - 1,
          1,
        );

        const isGroupActiveThisMonth =
          currentMonth >= groupStartMonth && currentMonth <= lastActiveMonth;

        if (!isGroupActiveThisMonth) return acc;

        // Calculate per-student expected payment with discounts
        const monthlyIncome = group.Students.reduce((groupTotal, student) => {
          const discountFactor = 1 - Number(student.discount) / 100; // Assumes discount is percentage
          const studentMonthlyPrice = Number(group.price) * discountFactor;
          return groupTotal + studentMonthlyPrice;
        }, 0);

        return acc + monthlyIncome;
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
          0,
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
        expectedIncome: Number(expectedIncome.toFixed(2)),
        paidThisMonth: Number(paidThisMonth.toFixed(2)),
        percentage,
      });
    }

    return results;
  } catch (error) {
    console.error("Error calculating income:", error);
    throw error;
  }
}

export async function calculateStats(filterYear) {
  try {
    const yearFilter = parseInt(filterYear) || new Date().getFullYear();
    const stats = await prisma.$transaction([
      //  Active Groups
      prisma.group.count({
        where: {
          isActive: "ACTIVE",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // finished Groups
      prisma.group.count({
        where: {
          isActive: "FINISHED",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total Teachers
      prisma.teacher.count({
        where: {
          // createdAt: {
          //   gte: new Date(yearFilter, 0, 1),
          //   lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          // },
        },
      }),
      // total Courses
      prisma.course.count({
        where: {
          // createdAt: {
          //   gte: new Date(yearFilter, 0, 1),
          //   lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          // },
        },
      }),
      // active Students
      prisma.student.count({
        where: {
          Group: {
            isActive: "ACTIVE",
            createdAt: {
              gte: new Date(yearFilter, 0, 1),
              lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
            },
          },
        },
      }),
      // total Debtors
      prisma.student.count({
        where: {
          debt: { gt: 0 },
          Group: {
            isActive: "ACTIVE",
          },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // finished Students
      prisma.student.count({
        where: {
          Group: {
            isActive: "FINISHED",
            finishedDate: {
              gte: new Date(yearFilter, 0, 1),
              lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
            },
          },
          debt: 0,
        },
      }),
      // total students
      prisma.student.count({
        where: {
          Group: {
            isActive: "ACTIVE",
          },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total students MALE
      prisma.student.count({
        where: {
          gender: "MALE",
          Group: {
            isActive: "ACTIVE",
            ...yearFilter,
          },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total students FEMALE
      prisma.student.count({
        where: {
          gender: "FEMALE",
          Group: {
            isActive: "ACTIVE",
          },
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total finished students FEMALE
      prisma.student.count({
        where: {
          gender: "FEMALE",
          Group: {
            isActive: "FINISHED",
          },
          debt: 0,
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total finished students MALE
      prisma.student.count({
        where: {
          gender: "MALE",
          Group: {
            isActive: "FINISHED",
          },
          debt: 0,
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total new students NOT_CAME
      prisma.newStudent.count({
        where: {
          isAttend: "NOT_CAME",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total new students CAME
      prisma.newStudent.count({
        where: {
          isAttend: "CAME",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total new students PENDING
      prisma.newStudent.count({
        where: {
          isAttend: "PENDING",
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total new students
      prisma.newStudent.count({
        where: {
          createdAt: {
            gte: new Date(yearFilter, 0, 1),
            lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
          },
        },
      }),
      // total new students pending
      // prisma.student.count({
      //   where: {
      //     Group: {
      //       isActive: "PENDING",
      //     },
      //     createdAt: {
      //       gte: new Date(yearFilter, 0, 1),
      //       lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
      //     },
      //   },
      // }),
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
      // totalPendingStudent,
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
      // totalPendingStudent
    };
  } catch (error) {
    console.log(error);

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
