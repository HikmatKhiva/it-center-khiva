export const studentSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    secondName: { type: "string" },
    passportId: { type: "string" },
    groupId: { type: "number" },
    courseId: { type: "number" },
    discount: { type: "string" },
    gender: { type: "string" },
    phone: { type: "string" },
  },
  required: [
    "firstName",
    "secondName",
    "passportId",
    "groupId",
    "courseId",
    "discount",
    "gender",
  ],
  additionalProperties: false,
};
export const studentUpdateSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    secondName: { type: "string" },
    passportId: { type: "string" },
    gender: { type: "string" },
    phone: { type: "string" },
  },
  required: ["firstName", "secondName", "passportId", "gender"],
  additionalProperties: false,
};