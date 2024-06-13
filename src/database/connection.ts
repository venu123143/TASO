import { Sequelize } from 'sequelize';
import UserModel from '../services/userService/models/userModel'; // Adjust the import path as necessary

const connection = new Sequelize(
    process.env.DB_DATABASE as string,
    process.env.DB_USERNAME as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST as string,
        dialect: 'postgres',
        logging: false,
    }
);

connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error: Error) => {
        console.error('Unable to connect to the database: ', error);
    });


const db = {
    Sequelize,
    connection,
    User: UserModel(connection),
};

// connection.sync({ alter: true })
//     .then(() => console.log('Database tables synced.'))
//     .catch((error: unknown) => console.error('Error syncing database:', error));

export default db;
