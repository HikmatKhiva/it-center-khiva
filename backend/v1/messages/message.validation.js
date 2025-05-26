export const messageSchema = {
  type: "object",
  properties: {
    fullName: { type: "string", minLength: 3, maxLength: 20 },
    message: { type: "string" },
  },
  required: ["fullName", "message"],
  additionalProperties: false,
};