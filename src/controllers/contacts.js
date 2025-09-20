import * as contactsService from "../services/contacts.js";
import createHttpError from "http-errors";

export const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await contactsService.getAllContacts({ userId, ...req.query });
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: {
        data: result.contacts,
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById({ userId: req.user._id, contactId: req.params.contactId });
    if (!contact) return next(createHttpError(404, "Contact not found"));
    res.status(200).json({ status: 200, message: `Successfully found contact with id ${req.params.contactId}!`, data: contact });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = await contactsService.createContact({ userId: req.user._id, body: req.body });
    res.status(201).json({ status: 201, message: "Successfully created contact!", data: contact });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updated = await contactsService.updateContact({ userId: req.user._id, contactId: req.params.contactId, body: req.body });
    if (!updated) return next(createHttpError(404, "Contact not found"));
    res.status(200).json({ status: 200, message: "Successfully updated contact!", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deleted = await contactsService.deleteContact({ userId: req.user._id, contactId: req.params.contactId });
    if (!deleted) return next(createHttpError(404, "Contact not found"));
    res.status(200).json({ status: 200, message: "Successfully deleted contact!", data: deleted });
  } catch (err) {
    next(err);
  }
};