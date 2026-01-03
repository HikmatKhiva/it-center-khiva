export const messageSchema = {
  type: "object",
  properties: {
    fullName: { type: "string", minLength: 3, maxLength: 20 },
    message: { type: "string", minLength: 10 },
  },
  required: ["fullName", "message"],
  additionalProperties: false,
};
