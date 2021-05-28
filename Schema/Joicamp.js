const Joi = require("joi");

module.exports.Camopschema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(200),
  description: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.string().required(),
}).required();
