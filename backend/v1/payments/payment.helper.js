export const calculateTotalPrice = (price, duration) => {
  return parseInt(price) * duration;
};
export const calculateTotalPaid = (payments) => {
  return payments.reduce((accumulator, payment) => {
    return accumulator + parseInt(payment.amount);
  }, 0);
};

