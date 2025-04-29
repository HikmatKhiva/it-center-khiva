import * as crypto from "crypto";
import pkg from "hi-base32";
const { encode } = pkg;
export const generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};