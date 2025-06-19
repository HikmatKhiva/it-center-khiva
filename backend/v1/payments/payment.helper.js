export const calculateTotalPrice = (price, duration) => {
  return parseInt(price) * duration;
};
export const calculateTotalPaid = (payments) => {
  return payments.reduce((accumulator, payment) => {
    return accumulator + parseInt(payment.amount);
  }, 0);
};
export const calculateCourseDuration = async (student) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const paymentsArray = [];
    const startDate = student.createdAt;
    const duration = student.Group.duration;
    const monthlyPayment = student.Group.price;
    for (let i = 0; i < duration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setMonth(startDate.getMonth() + i);
      paymentsArray.push({
        month: monthNames[currentDate.getMonth()],
        year: currentDate.getFullYear(),
        payment: monthlyPayment,
        paid: 0,
        percentage: 0,
      });
    }
    if (student.Payments.length === 0) return paymentsArray;
    student.Payments.forEach((payment) => {
      const payDate = new Date(payment.paymentDate);
      const payMonth = payDate.getMonth();
      const payYear = payDate.getFullYear();
      const monthRecord = paymentsArray.find(
        (m) => m.month === monthNames[payMonth] && m.year === payYear
      );
      if (monthRecord) {
        monthRecord.paid += Number(payment.amount);
        monthRecord.percentage = (monthRecord.paid / monthRecord.payment) * 100;
      }
    });
    const result = paymentsArray.map(
      ({ month, payment, paid, percentage }) => ({
        month,
        payment,
        paid,
        percentage,
      })
    );
    return result;
  } catch (error) {
    throw error;
  }
};
