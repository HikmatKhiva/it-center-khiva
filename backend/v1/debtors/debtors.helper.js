const totalPaidThisMonth = (student) => {
  return student.Payments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount), 
    0
  );
};
const latestPaymentDate = (student) => {
  if (student?.Payments.length === 0) return null;
  return student?.Payments.reduce(
    (latest, payment) =>
      new Date(payment.createdAt) > new Date(latest)
        ? payment.createdAt
        : latest, 
    student?.Payments[0].createdAt
  );
};
export const filterStudents = async (students, name) => {
  try {
    const newArray = students
      .map((student) => {
        const group = student.Group;
        const totalPaid = totalPaidThisMonth(student);
        const discountFactor = 1 - Number(student.discount) / 100;
        const expectedPayment = Number(group.price) * discountFactor;
        const lastPayment = latestPaymentDate(student);
        return {
          id: student.id,
          fullName: `${student.firstName} ${student.secondName}`,
          passportId: student.passportId,
          debt: Number(student.debt),
          discount: Number(student.discount),
          groupPrice: Number(group.price) * discountFactor,
          expectedPayment,
          groupName: group.name,
          courseName: student.course.name,
          teacherName: `${group.teacher.firstName} ${group.teacher.secondName}`,
          lastPaymentDate: lastPayment
            ? new Date(lastPayment).toLocaleDateString("en-GB")
            : "No payments",
          totalPaidThisMonth: totalPaid,
          createdAt: student.createdAt,
        };
      })
      .filter((student) =>
        student?.fullName?.toLowerCase()?.includes(name?.toLowerCase() || "")
      );

    return newArray.filter(
      (student) => student.totalPaidThisMonth < student.expectedPayment
    );
  } catch (error) {
    throw error;
  }
};
