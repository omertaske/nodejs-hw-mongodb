import { Router } from "express";
import * as contactsController from "../controllers/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();


router.use(authenticate);

router.get("/", contactsController.getAllContacts);
router.get("/:contactId", contactsController.getContactById);
router.post("/", contactsController.createContact);
router.patch("/:contactId", contactsController.updateContact);
router.delete("/:contactId", contactsController.deleteContact);

export default router;
