import Joi from 'joi';

export const subAdminSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phoneNo: Joi.string().pattern(/^\d{3}-\d{3}-\d{4}$/).required(),
  company: Joi.object({
    companyName: Joi.string().required(),
    employeeId: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).required(),
  }).required(),
});

export const updateSubAdminSchema = Joi.object({
  firstName: Joi.string().min(1),
  lastName: Joi.string().min(1),
  email: Joi.string().email(),
  phoneNo: Joi.string().pattern(/^\d{3}-\d{3}-\d{4}$/),
  company: Joi.object({
    companyName: Joi.string(),
    employeeId: Joi.string(),
    skills: Joi.array().items(Joi.string()),
  }),
});

const validate = (schema, data) => {
  const { error } = schema.validate(data);
  if (error) {
    throw new Error(error.details.map(detail => detail.message).join(', '));
  }
};

export default validate;
