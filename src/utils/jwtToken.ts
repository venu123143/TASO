import { IUser } from "../services/userService/models/userModel";
// import { CookieOptions } from "express";
import jwt from "jsonwebtoken";

const jwtToken = async (user: IUser) => {
  const token = jwt.sign({ id: user.id, phoneNumber: user.phoneNumber }, process.env.SECRET_KEY as jwt.Secret, {
    expiresIn: "3d"
  });
  return token
};

export default jwtToken;