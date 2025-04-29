export const groupCreateSchema = {
  type: "object",
  properties: {
    teacherId: { type: "string" },
    name: { type: "string", minLength: 4 },
    courseId: { type: "string" },
    duration: { type: "number" },
    price: { type: "number" },
    groupTime: { type: "string" },
  },
  required: ["teacherId", "name", "courseId", "duration", "price", "groupTime"],
  additionalProperties: false,
};
export const groupUpdateSchema = {
  type: "object",
  properties: {
    teacherId: { type: "string" },
    name: { type: "string", minLength: 4 },
    groupTime: { type: "string" },
  },
  required: ["teacherId", "name", "groupTime"],
  additionalProperties: false,
};
