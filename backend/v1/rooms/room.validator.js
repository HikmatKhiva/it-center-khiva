export const roomBaseSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 20 },
    capacity: { type: "number", maximum : 30, minimum: 5 },
  },
  required: ["name", "capacity"],
  additionalProperties: false,
};
