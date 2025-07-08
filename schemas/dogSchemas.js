import Joi from "joi";

export const dogRequestSchema = Joi.object({
  breed: Joi.string().trim().required(),
  subBreeds: Joi.array().items(Joi.string().trim()).default([]),
});

export const dogResponseSchema = Joi.object({
  id: Joi.string().required(),
  breed: Joi.string().required(),
  subBreeds: Joi.array().items(Joi.string()).required(),
});
