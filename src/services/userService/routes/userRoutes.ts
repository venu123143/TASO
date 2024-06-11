import express from "express"
import userController from "../controllers/userController"

const router = express.Router()

router.post("/create-account", userController.signUp)


export default router