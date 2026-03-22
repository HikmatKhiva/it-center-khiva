import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
export const validate = (schema) => {
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const isValid = validate(req.body);
    if (!isValid) {
      const error = validate.errors ? validate.errors : "Validation failed";
      console.log(error);

      return res
        .status(400)
        .json({ message: `${error[0].instancePath} ${error[0].message}` });
    }
    next();
  };
};
