import Ajv from "ajv";
import apply from "ajv-formats-draft2019";
const ajv = new Ajv({ allErrors: true });
apply(ajv);
export const validate = (schema) => {
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const isValid = validate(req.body);
    if (!isValid) {
      const error = validate.errors ? validate.errors : "Validation failed";
      return res
        .status(400)
        .json({ message: `${error[0].instancePath} ${error[0].message}` });
    }
    next();
  };
};