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
export const newStudentUpdateSchema = {
  type: "object",
  properties: {
    courseId: { type: "string" },
    fullName: { type: "string", minLength: 3, maxLength: 20 },
    isAttend: {
      type: "string",
      enum: ["PENDING", "CAME", "NOT_CAME"], // Matnli variantlar
    },
    reason: { type: "string" },
  },
  required: ["fullName", "courseId", "isAttend"],
  additionalProperties: false,
};