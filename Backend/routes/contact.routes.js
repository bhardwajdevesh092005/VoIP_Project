import { Router } from "express";
import {verifyJwt} from '../middlewares/auth.middleware.js';
import {
    createRequest,

} from '../controllers/contactController/index.js'
const contactRoutes = Router();
contactRoutes.post("/sendRequest", verifyJwt, createRequest);
export {contactRoutes};