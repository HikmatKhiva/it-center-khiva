export const newsSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 3 },
    description: { type: "string", minLength: 6 },
  },
  required: ["title", "description"],
};