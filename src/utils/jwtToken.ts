import { IUser } from "../services/userService/models/userModel";
// import { CookieOptions } from "express";
import jwt from "jsonwebtoken";

const jwtToken = async (user: IUser): Promise<{ token: string } | undefined> => {
  const token = jwt.sign({ id: user.id, phoneNumber: user.phoneNumber }, process.env.SECRET_KEY as jwt.Secret, {
    expiresIn: "3d"
  });

  if (!token) {
    console.log('token is undefined');
    return undefined;
  }

  // const options: CookieOptions = {
  //   maxAge: 3 * 24 * 60 * 60 * 1000,
  //   secure: true,
  //   httpOnly: true,
  //   sameSite: "none",
  // };

  return { token };
};

export default jwtToken;