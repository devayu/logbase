import crypto from "crypto";

export const hashPassword = (password: string, salt?: string) => {
  return new Promise<string>((resolve, reject) => {
    crypto.scrypt(
      password.normalize(),
      salt ?? generateSalt(),
      64,
      (err, hashedPassword) => {
        if (err) reject(err);
        resolve(hashedPassword.toString("hex").normalize());
      }
    );
  });
};

export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex").normalize();
};

export const passwordCompare = async (
  hashedPassword: string,
  inputPassword: string,
  salt?: string
) => {
  const inputHasedPassword = await hashPassword(inputPassword, salt);
  return crypto.timingSafeEqual(
    Buffer.from(hashedPassword, "hex"),
    Buffer.from(inputHasedPassword, "hex")
  );
};
