import { Router } from "express";
import {verifyJwt} from '../middlewares/auth.middleware.js';
import { Controllers } from "#controllers";

const contactRoutes = Router();
const contactControllers = Controllers.contactControllers;
contactRoutes.post("/sendRequest", verifyJwt, contactControllers.createRequest);
contactRoutes.post("/decideRequest",verifyJwt, contactControllers.acceptRequest);
contactRoutes.get("/getContacts", verifyJwt, contactControllers.getContacts);
contactRoutes.get("/getContactRequests",verifyJwt, contactControllers.getContactRequest);
contactRoutes.delete("/removeContact/:requestId", verifyJwt, contactControllers.removeContact);
export {contactRoutes};