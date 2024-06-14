import { Request, Response } from "express";
// import { IUser, UserInstance } from "../models/userModel";
import userValidations from "../validations/userValidations";
import { UserDatabase } from "../dbCalls/userDbCalls";
import RESPONSE from "../../../utils/Response";
import bcrypt from 'bcrypt';
import jwtToken from "../../../utils/jwtToken"
import { getSession } from "../../../utils/Session";
import { MemoryStore, SessionData, Session } from "express-session";
import { IUser } from "../models/userModel";
interface UserDetails extends IUser {
    otpCreatedAt: number;
    userOtp: number;
}
declare module 'express-serve-static-core' {
    interface Request {
        session: SessionData & Session & CookieOptions & MemoryStore & { userDetails?: UserDetails };
    }

}

const signUp = async (req: Request, res: Response) => {
    try {
        const { error, value } = await userValidations.RegisterValidation.validate(req.body)
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, '');
            RESPONSE.FailureResponse(res, 401, { message: errorMessage });
            return;
        }
        const { accountName, phoneNumber, countryCode, fullName } = value;

        const existingUser = await UserDatabase.findUserExists(accountName, phoneNumber);
        if (existingUser) {
            if (existingUser.phoneNumber === phoneNumber) {
                RESPONSE.FailureResponse(res, 409, { message: 'Phone number already exists' });
                return
            }
            if (existingUser.accountName === accountName) {
                RESPONSE.FailureResponse(res, 409, { message: 'Account name already taken' });
                return;
            }
        }
        // Hash the password
        const saltRounds = 10
        value.password = await bcrypt.hash(value.password, saltRounds);

        const otpCreatedAt = new Date().getTime();
        const userOtp = Math.floor(100000 + Math.random() * 900000);
        req.session.userDetails = { accountName, fullName, phoneNumber, countryCode, password: value.password, userOtp, otpCreatedAt }
        res.setHeader('sessionid', req.sessionID);

        RESPONSE.SuccessResponse(res, 201, {
            message: `Hi! ${fullName}, please verify the OTP.`,
            otp: userOtp
        });
        return

    } catch (error: any) {
        console.error('Error creating user:', error);
        RESPONSE.FailureResponse(res, 500, { message: 'Internal server error', });
        return
    }
};
const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { error, value } = await userValidations.VerifyOtpValidation.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, '');
            RESPONSE.FailureResponse(res, 401, { message: errorMessage });
            return;
        }
        const session = await getSession(req.headers.sessionid as string);
        if (!session && !session?.userDetails) {
            RESPONSE.FailureResponse(res, 401, { message: 'Session expired please try again.' });
            return;
        }
        const { otp } = value
        const currentTime = new Date().getTime();
        const otpValidityDuration = 10 * 60 * 1000;
        const timeDifference = currentTime - session?.userDetails?.otpCreatedAt
        const isValidOTP = parseInt(otp) == session?.userDetails?.userOtp && timeDifference <= otpValidityDuration;

        if (!isValidOTP) {
            RESPONSE.FailureResponse(res, 401, { message: "Invalid or expired OTP." });
            return;
        }
        // create user
        const user = await UserDatabase.createUser(value)
        console.log(user);

        const token = await jwtToken(user) as string
        res.setHeader('token', token);
        RESPONSE.SuccessResponse(res, 201, { message: 'User created successfully', user: user });

    } catch (error: any) {
        console.error('Error creating user:', error);
        RESPONSE.FailureResponse(res, 500, { message: 'Internal server error', });
        return
    }
}
const login = async (req: Request, res: Response) => {
    const { phoneNumber, password } = req.body;

    try {
        // Check if the user exists
        const existingUser = await UserDatabase.findUserByPhone(phoneNumber)
        if (!existingUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the password matches
        const passwordMatch = await bcrypt.compare(password, existingUser.password as string);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = await jwtToken(existingUser)
        res.setHeader('token', token);
        RESPONSE.SuccessResponse(res, 201, { message: 'Login successful', user: existingUser });
    } catch (error: any) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: error.message });
    }
};





export default {
    signUp,
    verifyOtp,
    login
}

