import express from "express";
import pino from "pino-http";
import cors from "cors";
import { getAllContacts, getContactById } from "./services/contacts.js";
import { ContactCollection } from "./db/Contact.js";
import { validateBody } from "./middlewares/validateBody.js";
import { isValidId } from "./middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "./validation/contactSchemas.js";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();
  
  app.use(express.json());
  app.use(cors());
    app.use(cookieParser());
  app.use(pino({ transport: { target: "pino-pretty" } }));
  app.use("/contacts", contactsRouter);
  app.use("/auth", authRouter);

  
  app.get("/contacts", async (req, res, next) => {
    try {
      let { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite } = req.query;
      page = parseInt(page);
      perPage = parseInt(perPage);

      const filter = {};
      if (type) filter.contactType = type;
      if (isFavourite !== undefined) filter.isFavourite = isFavourite === "true";

      const totalItems = await ContactCollection.countDocuments(filter);

      const contacts = await ContactCollection.find(filter)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: {
          data: contacts,
          page,
          perPage,
          totalItems,
          totalPages: Math.ceil(totalItems / perPage),
          hasPreviousPage: page > 1,
          hasNextPage: page * perPage < totalItems,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // GET /contacts/:id
  app.get("/contacts/:contactId", isValidId, async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  // POST /contacts
  app.post("/contacts", validateBody(createContactSchema), async (req, res, next) => {
    try {
      const contact = await ContactCollection.create(req.body);
      res.status(201).json({
        status: 201,
        message: "Successfully created contact!",
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  // PATCH /contacts/:id
  app.patch("/contacts/:contactId", isValidId, validateBody(updateContactSchema), async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await ContactCollection.findByIdAndUpdate(contactId, req.body, { new: true });
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({
        status: 200,
        message: "Successfully updated contact!",
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /contacts/:id
  app.delete("/contacts/:contactId", isValidId, async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await ContactCollection.findByIdAndDelete(contactId);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({
        status: 200,
        message: "Successfully deleted contact!",
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((req, res) => res.status(404).json({ message: "Not found" }));
  app.use((err, req, res, next) => res.status(500).json({ message: "Something went wrong", error: err.message }));

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
