import db from "../../../database/connection"
import { Op } from "sequelize"
interface UserData {
    accountName: string;
    phoneNumber: string;
    password: string;
    fullName: string;
    countryCode: string;
}

async function findUserExists(userName: string, phoneNumber: string) {
    const exists = await db.User.findOne({
        where: {
            [Op.or]: [{ accountName: userName }, { phoneNumber: phoneNumber }]
        }
    })
    return exists
}

async function createUser(userData: UserData) {
    const user = await db.User.create({
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        accountName: userData.accountName,
        countryCode: userData.countryCode
    })
    return user
}

async function findUserByPhone(phoneNumber: string) {
    const existingUser = await db.User.findOne({ where: { phoneNumber } });
    return existingUser
}
async function updateUserPassword(phoneNumber: string, password: string) {
    const result = await db.User.update({ password }, { where: { phoneNumber } });
    return result
}
export const UserDatabase = {
    findUserExists,
    createUser,
    findUserByPhone,
    updateUserPassword
}