export const courseSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 30 },
    teacherId: { type: "string" },
    nameCertificate: { type: "string", minLength: 6 },
  },
  required: ["name", "teacherId", "nameCertificate"],
  additionalProperties: false,
};
