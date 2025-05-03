import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign({ id }, "jwt_token", { expiresIn: "7d" });
};

export default generateToken;
