const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }]
});


module.exports = mongoose.model('Company', companySchema);