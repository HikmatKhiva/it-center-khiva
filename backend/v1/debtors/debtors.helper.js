const totalPaidThisMonth = (student) => {
  return student.Payments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount), // Use parseFloat for better precision
    0
  );
};
const latestPaymentDate = (student) => {
  if (student?.Payments.length === 0) return null;
  return student?.Payments.reduce(
    (latest, payment) =>
      new Date(payment.createdAt) > new Date(latest)
        ? payment.createdAt
        : latest, // Ensure comparison is done with Date objects
    student?.Payments[0].createdAt
  );
};
export const filterStudents = async (students, name) => {
  try {
    const newArray = students
      .map((student) => {
        const group = student.Group;
        const totalPaid = totalPaidThisMonth(student);
        let lastPayment = latestPaymentDate(student);
        return {
          id: student.id,
          fullName: `${student.firstName} ${student.secondName}`,
          passportId: student.passportId,
          debt: student.debt,
          groupPrice: group.price,
          groupName: group.name,
          courseName: student.course.name,
          teacherName: `${group.teacher.firstName} ${group.teacher.secondName}`,
          lastPaymentDate: lastPayment
            ? new Date(lastPayment).toLocaleDateString("en-GB") // Ensure lastPayment is a Date object
            : "No payments",
          totalPaidThisMonth: totalPaid,
          createdAt: student.createdAt,
        };
      })
      .filter((student) =>
        student?.fullName?.toLowerCase()?.includes(name?.toLowerCase())
      );
    // Filter students whose total payments are less than the group price
    return newArray.filter(
      (student) => student.totalPaidThisMonth < student.groupPrice
    );
  } catch (error) {
    throw error;
  }
};