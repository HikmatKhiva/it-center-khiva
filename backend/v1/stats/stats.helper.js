import { prisma } from "../../app.js";
export async function getTeacherMonthlyReport(teacherId, year, month) {
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
  // 5. Build report object
  return {
    teacherName: teacher.firstName + " " + teacher.secondName,
    month,
    totalPaid,
    totalSalary,
    expectedSalary,
    totalAmount,
  };
}
export async function calculateAllTeachersSalaries() {
  try {
    // Get current year and month from system date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() is zero-based
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
export async function calculateIncome() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // 1. Fetch active groups with their students
    const activeGroups = await prisma.group.findMany({
      where: { isGroupFinished: false },
      select: {
        price: true,
        Students: true, // fetch students array to get count
      },
    });

    // 2. Calculate expected income: sum of (group price * number of students)
    const expectedIncome = activeGroups.reduce(
      (acc, group) => acc + Number(group.price) * group.Students.length,
      0
    );

    // 3. Calculate total paid this month by summing payment amounts
    const paidAggregate = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    const paidThisMonth = Number(paidAggregate._sum.amount) ?? 0;
    const percentage = Math.floor((paidThisMonth / expectedIncome) * 100);
    return { expectedIncome, paidThisMonth, percentage };
  } catch (error) {
    throw error;
  }
}
export async function calculateIncomeForYear() {
  try {
    const results = [];
    const year = new Date().getFullYear();
    const activeGroups = await prisma.group.findMany({
      where: { isGroupFinished: false },
      select: {
        price: true,
        Students: true,
        createdAt: true,
        duration: true,
      },
    });

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

      // Calculate expected income for this month only from groups active in this month
      const expectedIncome = activeGroups.reduce((acc, group) => {
        const groupStart = new Date(group.createdAt);
        const groupEnd = new Date(groupStart);
        groupEnd.setMonth(groupEnd.getMonth() + group.duration);

        // Check if current month overlaps with group's active period
        if (startOfMonth < groupEnd && endOfMonth >= groupStart) {
          // Ensure duration is not zero to avoid division by zero
          const monthlyPrice = Number(group.price);
          return acc + monthlyPrice * (group.Students.length || 0); // Ensure Students is an array
        }
        return acc;
      }, 0);

      // Sum payments for this month
      const paidAggregate = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      const paidThisMonth = Number(paidAggregate._sum.amount) || 0; // Use || to default to 0
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