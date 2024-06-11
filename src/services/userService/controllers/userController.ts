import { Request, Response } from "express";
import { IUser, UserInstance } from "../models/userModel";
import userValidations from "../validations/userValidations";
import { UserDatabase } from "../dbCalls/userDbCalls";
import RESPONSE from "../../../utils/Response";
import bcrypt from 'bcrypt';

const signUp = async (req: Request, res: Response) => {
    try {
        const { error, value } = userValidations.RegisterValidation.validate(req.body)
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, '');
            RESPONSE.FailureResponse(res, 401, { message: errorMessage });
            return;
        }
        const { accountName, phoneNumber } = value;
        let { password } = value;

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
        password = await bcrypt.hash(password, saltRounds);

        // create user
        await UserDatabase.createUser(value)

        RESPONSE.SuccessResponse(res, 201, { message: 'User created successfully' });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req: Request, res: Response) => {
    const { userInput, password } = req.body;

    try {
        // // Check if the user exists
        // const existingUser = await UserDatabase.findUserByUserInput(userInput)
        // if (!existingUser) {
        //     return res.status(400).json({ message: 'User not found' });
        // }

        // // Check if the password matches
        // const passwordMatch = await bcrypt.compare(password, existingUser.password as string);
        // if (!passwordMatch) {
        //     return res.status(400).json({ message: 'Invalid password' });
        // }
        // const token = await jwtToken(existingUser)

        // return res.status(200).json({ message: 'Login successful', user: existingUser, token: token });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





export default {
    signUp,
    login
}

