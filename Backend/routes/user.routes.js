import {Router} from 'express';
import {upload} from '../middlewares/multer.middleware.js'
const userRoutes = Router();

userRoutes.post("/register",
    upload.fields([
        {
            name:"avatar",
            maxCount: 1,
        },
    ]),
    registerUser
)