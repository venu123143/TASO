import { CorsOptions } from "cors";

// cors and session
export const options: CorsOptions = {
    origin: [
        "http://localhost:8000",
        "http://localhost:4200",
        "http://localhost:3000",
    ],
    credentials: true,
    exposedHeaders: ["sessionid", "token",],
    allowedHeaders: ["sessionid", "Content-Type", "Authorization", "token"],
};