import { Model, Sequelize } from 'sequelize';

export interface IUser {
    id?: number;
    fullName: string;
    accountName: string;
    userType?: string;
    profilePicture?: string;
    coverPhoto?: string;
    countryCode?: string;
    phoneNumber: string;
    theme?: string;
    password: string;
    timeZone?: string;
    lastLogin?: number;
    createdAt?: Date

}
export interface UserInstance extends Model<IUser>, IUser { }

const UserModel = (sequelize: Sequelize, DataTypes: any) => {
    const User = sequelize.define<UserInstance>('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userType: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coverPhoto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        theme: {
            type: DataTypes.STRING,
            defaultValue: 'system'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        timeZone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastLogin: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

    }, {
        freezeTableName: true, timestamps: true, indexes: [{
            unique: false,
            fields: ['phoneNumber'],
            name: 'phoneNumber_index'
        }]
    });

    return User;
}


export default UserModel;
