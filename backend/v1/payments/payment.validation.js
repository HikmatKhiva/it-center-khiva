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

export const refundSchema = {
  type: "object",
  properties: {
    amount: { type: "number" },
    reason: { type: "string" },
  },
  required: ["amount", "reason"],
  additionalProperties: false,
};
