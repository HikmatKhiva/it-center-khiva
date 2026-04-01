import * as crypto from "crypto";
import pkg from "hi-base32";
const { encode } = pkg;
export const generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

export const paymentsFormatter = (payments) => {
  return payments.map((payment) => {
    return {
      id: payment?.id,
      studentId: payment?.Student?.id,
      amount: Number(payment.amount),
      paymentDate: payment.paymentDate,
      confirmedAt: payment.confirmedAt,
      confirmedStatus: payment?.confirmedStatus,
      fullName: `${payment?.Student?.firstName} ${payment?.Student?.secondName}`,
      groupName: payment?.Student?.Group?.name,
      courseName: payment?.Student?.course?.name,
      teacherName: `${payment?.Student?.Group?.teacher.firstName} ${payment?.Student?.Group?.teacher.secondName}`,
    };
  });
};
