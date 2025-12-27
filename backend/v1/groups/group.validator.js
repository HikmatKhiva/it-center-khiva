export const groupCreateSchema = {
  type: "object",
  properties: {
    teacherId: { type: "string" },
    name: { type: "string", minLength: 4 },
    courseId: { type: "string" },
    duration: { type: "string" },
    price: { type: "number" },
    schedules: {
      type: "object", // Changed from "array" to "object"
      properties: {
        weekType: {
          type: "string",
          enum: ["ODD", "EVEN"],
        },
        time: {
          type: "string",
          pattern: "^T\\d{2}_\\d{2}$",
        },
        roomId: {
          type: "string",
        },
      },
      required: ["weekType", "time", "roomId"],
      additionalProperties: false,
    },
  },
  required: ["teacherId", "name", "courseId", "duration", "price", "schedules"],
  additionalProperties: false,
};

export const groupUpdateSchema = {
  type: "object",
  properties: {
    teacherId: { type: "string" },
    schedules: {
      type: "object", // Changed from "array" to "object"
      properties: {
        weekType: {
          type: "string",
          enum: ["ODD", "EVEN"],
        },
        time: {
          type: "string",
          pattern: "^T\\d{2}_\\d{2}$",
        },
        roomId: {
          type: "string",
        },
      },
      required: ["weekType", "time", "roomId"],
      additionalProperties: false,
    },
  },
  required: ["teacherId"],
  additionalProperties: false,
};
//  teacherId: data?.teacher.id.toString() || "",
//       schedules: {
//         weekType: "",
//         time: "",
//         roomId: "",
//       },
