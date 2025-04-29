export const paymentSchema = {
  type: "object",
  properties: {
    studentId: { type: "number" },
    amount: { type: "number" },
  },
  required: ["studentId", "amount"],
  additionalProperties: false,
};
