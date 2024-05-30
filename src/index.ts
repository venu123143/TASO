import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

// env, db connection and Response
import "dotenv/config";
// import "./database/connection";

import swagOptions from "./utils/swagger";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";
import RESPONSE from "./utils/Response";
import { options } from "./utils/Cors";
import ErrorHandler from "./utils/errors";
import { multerMiddleWare } from "./middleware/Multer";

// import session from "./utils/Session";

// Handle uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught Exception`);
});

const app: Application = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:8080", "http://localhost:4200",], credentials: true },
});
app.use(cors(options));
// app.use(session);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public/images"));

app.get("/", async (req, res) => {
  RESPONSE.SuccessResponse(res, { message: "Server started sucessfully" });
});
const chatNamespace = io.of("/chat");
// const notificationNamespace = io.of("/notification")

// chatNamespace.use(socketMiddleware)
chatNamespace.on("connection", (socket) => {
  console.log(socket.id, ' connected')
});

// routes
// app.use("/api/v1/user", userRouter);

app.use(multerMiddleWare);
app.use(ErrorHandler);
const swags = swaggerjsdoc(swagOptions);
app.use("/api/v1", swaggerui.serve, swaggerui.setup(swags));

const port: number = parseInt(process.env.PORT as string) || 5000;
const newServer = server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

// const ip = process.env.IP as string;
// const newServer = server.listen(port, ip, () => {
//   console.log(`server is running on port http://${ip}:${port}`);
// });
// unhandled promise rejection
process.on("unhandledRejection", (err: Error) => {
  console.log(`${err.stack}`);
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting down the server for unhandle promise rejection`);
  newServer.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown on process termination
process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully.");
  newServer.close(() => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down gracefully.");
  newServer.close(() => {
    process.exit(0);
  });
});
