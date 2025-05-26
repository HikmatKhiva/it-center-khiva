export const userLoginSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3, maxLength: 20 },
    password: { type: "string", minLength: 6 },
  },
  required: ["username", "password"],
  additionalProperties: false,
};
export const userVerifySchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3, maxLength: 20 },
    token: { type: "string" },
  },
  required: ["username", "token"],
  additionalProperties: false,
};