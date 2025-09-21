import { Router } from "express";
import * as contactsController from "../controllers/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contactSchemas.js";
import { isValidId } from "../middlewares/isValidId.js";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authenticate);

router.get("/", contactsController.getAllContacts);
router.get("/:contactId", isValidId, contactsController.getContactById);
router.post("/", upload.single("photo"), validateBody(createContactSchema), contactsController.createContact);
router.patch("/:contactId", isValidId, upload.single("photo"), validateBody(updateContactSchema), contactsController.updateContact);
router.delete("/:contactId", isValidId, contactsController.deleteContact);

export default router;
