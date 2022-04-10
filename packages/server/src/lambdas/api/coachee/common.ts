import Joi from '@hapi/joi';

const schema = Joi.object({
  email: Joi.string().required(),
  coacheeId: Joi.string().optional(),
  fullName: Joi.string().optional(),
  company: Joi.string().optional(),
});

export const validate = (entity: object): object => schema.validate(entity);
