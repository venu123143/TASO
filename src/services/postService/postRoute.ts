import multer from 'multer';

import express from "express";
import postController from "./postController";

import { uploadImage } from "../../middleware/Multer";
const router = express.Router()

const upload = multer({ dest: 'uploads/' });

router.post("/postfile", upload.single('chunk'), postController.uploadPost)




export default router

