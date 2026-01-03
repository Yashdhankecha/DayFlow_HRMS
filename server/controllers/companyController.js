const Company = require('../models/companyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getCompanyProfile = catchAsync(async (req, res, next) => {
    let company = await Company.findOne();

    // If no company record exists, create a default one
    if (!company) {
        company = await Company.create({
            name: 'My Organization'
        });
    }

    res.status(200).json({
        status: 'success',
        data: company
    });
});

exports.updateCompanyProfile = catchAsync(async (req, res, next) => {
    let company = await Company.findOne();

    if (!company) {
        company = await Company.create(req.body);
    } else {
        company = await Company.findByIdAndUpdate(company._id, req.body, {
            new: true,
            runValidators: true
        });
    }

    res.status(200).json({
        status: 'success',
        data: company
    });
});
