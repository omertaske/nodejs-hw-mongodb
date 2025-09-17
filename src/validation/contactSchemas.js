import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().allow(null, ""),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal").default("personal")
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string(),
  email: Joi.string().email().allow(null, ""),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal")
});
