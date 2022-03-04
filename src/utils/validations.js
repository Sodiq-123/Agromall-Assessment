const joi = require('joi');

exports.validateLogin = (email, password) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const validate = schema.validate({ email, password });
    if (validate.error) {
        return validate.error.details[0].message;
    }
    return true
}


exports.validateRegister = (name, email, password) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const validate = schema.validate({ name, email, password });
    if (validate.error) {
        return validate.error.details[0].message;
    }
    return true
}

exports.validateCompany = (name, email, password, logo, url) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        logo: joi.string().required(),
        url: joi.string().required()
    })
    const validate = schema.validate({ name, email, password, logo, url });
    if (validate.error) {
        return validate.error.details[0].message;
    }
    return true
}