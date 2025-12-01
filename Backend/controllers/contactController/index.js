import { createRequest } from "./createRequest.js";
import { acceptRequest } from "./acceptRequest.js";
import { getContacts } from "./getContacts.js";
import { getContactRequest } from "./getContactRequests.js";
import { removeContact } from "./removeContact.js";
export const contactControllers = {
    createRequest,
    acceptRequest,
    getContacts,
    getContactRequest,
    removeContact
};