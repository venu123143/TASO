import express from "express"
import userController from "../controllers/userController"

const router = express.Router()

router.post("/create-account", userController.signUp)
router.post("/verify-otp", userController.verifyOtp)
router.post("/login", userController.login)


export default router