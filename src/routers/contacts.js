import { Router } from "express";
import * as contactsController from "../controllers/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contactSchemas.js";

const router = Router();

router.use(authenticate);

router.get("/", contactsController.getAllContacts);
router.get("/:contactId", contactsController.getContactById);
router.post("/", validateBody(createContactSchema), contactsController.createContact);
router.patch("/:contactId", validateBody(updateContactSchema), contactsController.updateContact);
router.delete("/:contactId", contactsController.deleteContact);

export default router;