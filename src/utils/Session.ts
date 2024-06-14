import connectSessionSequelize from 'connect-session-sequelize';
import session from "express-session";
import db from "../database/connection"

const SequelizeStore = connectSessionSequelize(session.Store);
export const store = new SequelizeStore({
    db: db.connection,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 3600 * 1000
});
const ses = session({
    name: 'loginSession',
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        secure: false,
        sameSite: "lax",
        // httpOnly: true,
        maxAge: 3600 * 1000
    }
});

// 10 * 60 * 1000 // 10 minutes
export async function getSession(sessionId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        store.get(sessionId, (err, ses) => {
            if (err) {
                reject(err);
            } else {
                resolve(ses);
            }
        });
    });
}

export async function setSession(sessionId: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
        store.set(sessionId, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function removeSession(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        store.destroy(sessionId, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export default ses