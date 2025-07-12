import * as Joi from 'joi';

export const validationSchema = Joi.object({
  THROTTLER_TTL: Joi.number().required(),
  THROTTLER_LIMIT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),
  DATABASE_URL: Joi.string().uri().required(),
});
