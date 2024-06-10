import { Model, Sequelize } from 'sequelize';

interface UserAttributes {
    id?: number;
    profilePicture?: string;
    coverPhoto?: string;
    firstname?: string;
    lastname?: string;
    countryCode: string;
    theme?: string;
    accentColor?: string;
    userType?: string;
    phoneNumber?: string;
    resetToken?: string | null;
    password?: string;
    timeZone?: string
    lastLogin?: number
    createdAt?: Date

}
export interface UserInstance extends Model<UserAttributes>, UserAttributes { }

const UserModel = (sequelize: Sequelize, DataTypes: any) => {
    const User = sequelize.define<UserInstance>('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userType: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
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
        accentColor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true
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
