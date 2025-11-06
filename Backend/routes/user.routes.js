import {Router} from 'express';
import {upload} from '../middlewares/multer.middleware.js'
import { loginUser, registerUser } from '../controllers/userController/index.js';
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
userRoutes.post("/login",
    loginUser
)
export {userRoutes};