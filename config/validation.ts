import * as Joi from 'joi';
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  JWT_SECRET_KEY: Joi.string().required().default('secretkey'),
  JWT_EXPIRES_IN: Joi.string().required().default('1h'),
  PORT: Joi.number().default(3001),
  MONGO_DB: Joi.string().required(),
  EMAIL_PORT: Joi.number().default(25),
  STMP_HOST: Joi.string().required().default('smtp.freesmtpservers.com'),
  EMAIL_USER: Joi.string().required().default('emailtest@test.com'),
  CLIENTEID: Joi.string(),
  CLIENTESECRET: Joi.string(),
  REFRESH_TOKEN_GMAIL: Joi.string(),
  WEBAPP_URL: Joi.string().required().default('localhost:3000'),
});
