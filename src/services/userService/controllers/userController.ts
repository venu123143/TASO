import { Request, Response } from "express";
import userValidations from "../validations/userValidations";
import { UserDatabase } from "../dbCalls/userDbCalls";
import RESPONSE from "../../../utils/Response";
import bcrypt from 'bcrypt';
import jwtToken from "../../../utils/jwtToken"
import { getSession, setSession } from "../../../utils/Session";
import { MemoryStore, SessionData, Session } from "express-session";
import { IUser } from "../models/userModel";
import crypto from "crypto"
interface UserDetails extends IUser {
    otpCreatedAt: number;
    userOtp: number;
    resetToken?: string;
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
                RESPONSE.FailureResponse(res, 409, { message: 'Phone number already exists.' });
                return
            }
            if (existingUser.accountName === accountName) {
                RESPONSE.FailureResponse(res, 409, { message: 'Account name already taken.' });
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
        if (session?.userDetails?.accountName && session?.userDetails?.fullName) {
            const userData = {
                accountName: session?.userDetails?.accountName,
                phoneNumber: session?.userDetails?.phoneNumber,
                password: session?.userDetails?.password,
                fullName: session?.userDetails?.fullName,
                countryCode: session?.userDetails?.countryCode
            }
            // create user
            const user = await UserDatabase.createUser(userData)

            const token = await jwtToken(user) as string
            res.setHeader('token', token);
            RESPONSE.SuccessResponse(res, 201, { message: 'User created successfully', user: user });
        } else {
            const token = crypto.randomBytes(32).toString('hex');
            const data = { ...session, userDetails: { ...session.userDetails, resetToken: token } }
            await setSession(req.headers.sessionid as string, data);
            res.setHeader('resettoken', token);
            RESPONSE.SuccessResponse(res, 200, { message: 'User otp verified successfully', });
        }

    } catch (error: any) {
        RESPONSE.FailureResponse(res, 500, { message: 'Internal server error', error: error?.message });
        return
    }
}
const login = async (req: Request, res: Response) => {
    const { phoneNumber, password } = req.body;
    try {
        const { error } = await userValidations.LoginValidation.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, '');
            RESPONSE.FailureResponse(res, 401, { message: errorMessage });
            return;
        }
        // Check if the user exists
        const existingUser = await UserDatabase.findUserByPhone(phoneNumber)
        if (!existingUser) {
            RESPONSE.FailureResponse(res, 400, { message: 'User not found' });
            return
        }

        // Check if the password matches
        const passwordMatch = await bcrypt.compare(password, existingUser.password as string);
        if (!passwordMatch) {
            RESPONSE.FailureResponse(res, 400, { message: 'Invalid password' });
            return
        }
        const token = await jwtToken(existingUser)
        res.setHeader('token', token);
        RESPONSE.SuccessResponse(res, 201, { message: 'Login successful', user: existingUser });
    } catch (error: any) {
        console.error('Error logging in:', error);
        RESPONSE.FailureResponse(res, 500, { message: 'Internal server error', error: error.message });
        return
    }
};


const forgotPassword = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    const user = await UserDatabase.findUserByPhone(phoneNumber)
    if (!user) {
        RESPONSE.FailureResponse(res, 500, { message: 'User not found' });
        return
    }
    const otpCreatedAt = new Date().getTime();
    const userOtp = Math.floor(100000 + Math.random() * 900000);
    req.session.userDetails = { phoneNumber, userOtp, otpCreatedAt } as any
    res.setHeader('sessionid', req.sessionID);
    RESPONSE.SuccessResponse(res, 201, {
        message: `Hi! ${user.fullName}, please verify the OTP.`,
        otp: userOtp
    });
    return
}

const resetPassword = async (req: Request, res: Response) => {

    const { error, value } = userValidations.ResetPassValidation.validate(req.body)
    if (error) {
        const errorMessage = error?.message?.replace(/["\\]/g, '');
        RESPONSE.FailureResponse(res, 401, { message: errorMessage });
        return;
    }
    const session = await getSession(req.headers.sessionid as string);
    if (!session && !session?.userDetails) {
        RESPONSE.FailureResponse(res, 401, { message: 'Session expired, please try again.' });
        return;
    }
    if (req.session.userDetails?.resetToken !== req.params.token) {
        RESPONSE.FailureResponse(res, 401, { message: 'Invalid or expired token.' });
        return;
    }
    const saltRounds = 10
    value.password = await bcrypt.hash(value.password, saltRounds);
    await UserDatabase.updateUserPassword(session?.userDetails?.phoneNumber as string, value.password)
    RESPONSE.SuccessResponse(res, 201, { message: 'Password reset successful.' });
    return
}


export default {
    signUp,
    verifyOtp,
    login,
    forgotPassword,
    resetPassword
}

