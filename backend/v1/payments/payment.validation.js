export const paymentSchema = {
  type: "object",
  properties: {
    studentId: { type: "number" },
    amount: { type: "number" },
    paymentDate: { type: "string" },
  },
  required: ["studentId", "amount", "paymentDate"],
  additionalProperties: false,
};
