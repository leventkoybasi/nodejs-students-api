import Joi from 'joi';

export const validatorSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  age: Joi.number().integer().min(6).max(16).required().messages({
    'number.min': "Yas 6'dan kucuk olamaz.",
    'number.max': "Yas 16'dan buyuk olamaz.",
    'number.integer': 'Yas bir sayi olmalidir.',
    'any.required': 'Yas alanı zorunludur.',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean().required(),
});

const exampleStudemt = {
  name: 'Levent',
  age: 6,
  gender: 'male',
  avgMark: 10,
  onDuty: false,
};

const validationResult = validatorSchema.validate(exampleStudemt, {
  abortEarly: false, // option olarak abortEarly gonderiyoruz cunku hem nam,e hem asge field'larini kontrol etsin
});

console.log(validationResult.error);
console.log(validationResult.value);
console.log(validationResult.warning);
