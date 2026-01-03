const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        default: 'DayFlow Systems'
    },
    address: {
        type: String,
        default: '123 Tech Park'
    },
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: 'admin@dayflow.com'
    },
    website: String,
    taxId: String,
    logoUrl: String,
    foundedYear: String,

    // Additional configurations can go here
    timezone: {
        type: String,
        default: 'Asia/Kolkata'
    }
}, { timestamps: true });

// We typically only have one company document
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
