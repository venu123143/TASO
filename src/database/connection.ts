
import { Sequelize } from "sequelize"
// DataTypes, ModelCtor,
const connection = new Sequelize(
    process.env.DB_DATABASE as string,
    process.env.DB_USERNAME as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST as string,
        dialect: 'postgres',
        logging: false
    }
);

connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error: Error) => {
        console.error('Unable to connect to the database: ', error);
    });

interface Connection {
    Sequelize: typeof Sequelize;
    connection: Sequelize;
}

const db: Connection = {
    Sequelize,
    connection: connection,
}
// emails relations

// {alter:true}
// // { force: false }
// connection.sync({ alter: true, }).then(() => console.log('Database tables synced.'))
//     .catch((error: unknown) => console.error('Error syncing database:', error));

export default db;
