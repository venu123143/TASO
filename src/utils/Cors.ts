import { CorsOptions } from "cors";

// cors and session
export const options: CorsOptions = {
    origin: [
        "http://localhost:8080",
        "http://localhost:4200",
        "http://localhost:3000",
    ],
    credentials: true,
    allowedHeaders: [
        "sessionid",
        "Content-Type",
        "Authorization",
    ],
    exposedHeaders: [
        "sessionId",
        "sessionid",
        "token",
    ],
};