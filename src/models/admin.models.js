const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const adminSchema = new Schema({
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
    role: {
        type: String,
        default: 'Admin'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
})


module.exports = mongoose.model('Admin', adminSchema);