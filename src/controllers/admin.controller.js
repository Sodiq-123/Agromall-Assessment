const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.models');
const Employee = require('../models/employees.models');
const Company = require('../models/company.models');
const { validateLogin, validateRegister, validateCompany } = require('../utils/validations');


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const validate = validateRegister(name, email, password);
        if (!validate) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        const admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({
                message: 'Admin already exists'
            });
        }
        const newAdmin = new Admin({
            name,
            email,
            password,
            role: 'Super Admin'
        });
        const salt = await bcrypt.genSalt(10);
        newAdmin.password = await bcrypt.hash(password, salt);
        await newAdmin.save();
        const payload = {
            admin: {
                id: newAdmin.id
            }
        }
        return res.json({
            msg: 'Successfully registered',
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({
            message: 'Not registered'
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validate = validateLogin(email, password);
        if (!validate) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                message: 'Admin does not exist'
            });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }
        const payload = {
            admin: {
                id: admin.id
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
                msg: 'Successfully logged in',
                token
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({
            message: 'Not logged in'
        });
    }
}

exports.createCompany = async (req, res) => {
    try {
        const { name, email, password, logo, url } = req.body;
        const validate = validateCompany(name, email, password, logo, url);
        if (!validate) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }
        // check if company exists
        const company = await Company.findOne({ email });
        if (company) {
            return res.status(400).json({
                message: 'Company already exists'
            });
        }
        const newCompany = new Company({
            name,
            email,
            password,
            logo,
            url
        });
        const salt = await bcrypt.genSalt(10);
        newCompany.password = await bcrypt.hash(password, salt);
        await newCompany.save();
        const payload = {
            company: {
                id: newCompany.id
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
                msg: 'Successfully registered',
                token
            });
        });
    } catch (err) {
        res.status(400).json({
            message: 'Not registered'
        });
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                message: 'Admin does not exist'
            });
        }
        admin.role = 'Admin';
        await admin.save();
        return res.json({
            msg: 'Successfully made user admin'
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({
            message: 'Not made admin'
        });
    }
}

// Add employee to company
exports.addEmployee = async (req, res) => {
    try {
        const { email } = req.body;
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({
                message: 'Employee does not exist'
            });
        }
        employee.company = req.company.id;
        await employee.save();
        return res.json({
            msg: 'Successfully added employee to company'
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({
            message: 'Not added employee to company'
        });
    }
}

// get all companies
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        return res.json({
            companies: companies.map(company => {
                return {
                    id: company.id,
                    name: company.name,
                    email: company.email,
                    logo: company.logo,
                    url: company.url
                }
            })
        });
    } catch (err) {
        console.error(err.message);
        res.status(404).json({
            message: 'Not found'
        });
    }
}