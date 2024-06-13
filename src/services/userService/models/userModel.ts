import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface IUser {
    id?: number;
    fullName: string;
    accountName: string;
    userType?: string;
    profilePicture?: string | null;
    coverPhoto?: string | null;
    countryCode?: string | null;
    phoneNumber: string;
    theme?: string;
    password: string;
    timeZone?: string | null;
    lastLogin?: number | null;
    tags?: string[];
    about: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
}

// These attributes will be optional when calling UserModel.create()
export interface UserModel extends Optional<IUser, 'id' | 'userType' | 'profilePicture' |
    'coverPhoto' | 'countryCode' | 'theme' | 'timeZone' | 'lastLogin'> { }

class User extends Model<IUser, UserModel> implements IUser {
    public id!: number;
    public fullName!: string;
    public accountName!: string;
    public userType!: string;
    public profilePicture!: string | null;
    public coverPhoto!: string | null;
    public countryCode!: string | null;
    public phoneNumber!: string;
    public theme!: string;
    public password!: string;
    public timeZone!: string | null;
    public lastLogin!: number | null;
    public tags!: string[];
    public about!: string;
    public followersCount!: number;
    public followingCount!: number;
    public postsCount!: number;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const UserModel = (sequelize: Sequelize): typeof User => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        about: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userType: {
            type: DataTypes.STRING,
            defaultValue: 'user',
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
            allowNull: false,
            unique: true,
        },
        theme: {
            type: DataTypes.STRING,
            defaultValue: 'system',
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeZone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastLogin: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        followersCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        followingCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        postsCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'users',
        freezeTableName: true,
        timestamps: true,
        indexes: [{
            unique: false,
            fields: ['phoneNumber'],
            name: 'phoneNumber_index',
        }],
    });

    return User;
};

export default UserModel;
