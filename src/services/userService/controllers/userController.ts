import { Request, Response } from "express";

import { IUser, UserInstance } from "../models/userModel";
// import bcrypt from 'bcrypt';


const signUp = async (req: Request, res: Response) => {
    try {
        // const { error, value } = await userSchema.validate(req.body)
        // if (error) {
        //     return res.status(400).json({ message: error });
        // }
        // const { firstname, lastname, countryCode, phoneNumber, password, email, username } = value;
        // // Check if the phone number already exists
        // const existingUser = await UserDatabase.findUserByAttributes({ phoneNumber, username, email });
        // if (existingUser) {
        //     if (existingUser.phoneNumber === phoneNumber) {
        //         return res.status(400).json({ message: 'Phone number already exists' });
        //     }
        //     if (existingUser.username === username) {
        //         return res.status(400).json({ message: 'Username already exists' });
        //     }
        //     if (existingUser.email === email) {
        //         return res.status(400).json({ message: 'Email already exists' });
        //     }
        // }
        // // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // // Create a new user
        // const newUser = await UserDatabase.createUser(firstname as string, lastname as string, countryCode as string, phoneNumber as string, hashedPassword as string, email as string, username as string)
        // const token = await jwtToken(newUser)

        // return res.status(201).json({ message: 'User created successfully', user: newUser, token: token });
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

