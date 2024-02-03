const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    location: { type: String, required: true },
}, {
    timestamps: true
});

const companySchema = new mongoose.Schema({
    company: { type: String, required: true },
    locations: [locationSchema],  // ARRAY may be needed beacause people may work at multiple locations
}, {
    timestamps: true
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;