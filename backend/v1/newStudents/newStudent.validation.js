export const newStudentSchema = {
  type: "object",
  properties: {
    fullName: { type: "string", minLength: 3, maxLength: 20 },
    phone: { type: "string" },
    courseId: { type: "string" },
    courseTime: { type: "string" },
  },
  required: ["fullName", "phone", "courseId", "courseTime"],
  additionalProperties: false,
};
export const newStudentStatusSchema = {
  type: "object",
  properties: {
    status: { type: "string" },
  },
  required: ["status"],
  additionalProperties: false,
};