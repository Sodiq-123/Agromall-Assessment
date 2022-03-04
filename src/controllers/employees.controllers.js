const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employees.models');
const Company = require('../models/company.models');
const { validateLogin } = require('../utils/validations');


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({
                message: 'Employee already exists'
            });
        }
        const newEmployee = new Employee({
            name,
            email,
            password
        });
        const salt = await bcrypt.genSalt(10);
        newEmployee.password = await bcrypt.hash(password, salt);
        await newEmployee.save();
        const payload = {
            employee: {
                id: newEmployee.id
            }
        }
        return res.json({
            msg: 'Successfully registered',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validate = validateLogin(email, password);
        if (!validate) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({
                message: 'Employee does not exist'
            });
        }
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }
        const payload = {
            employee: {
                id: employee.id
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                return res.json({
                    msg: 'Successfully logged in',
                    token: token 
                });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            msg: 'Server error'
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, password } = req.body;
        const validate = validateLogin(name, password);
        if (!validate) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({
                message: 'Employee does not exist'
            });
        }
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(password, salt);
        await employee.save();
        const payload = {
            employee: {
                id: employee.id
            }
        }
        return res.json({
            msg: 'Successfully updated',
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).send({
            msg: 'Not successfully updated'
        });
    }
}

// view all employees associated with a company
exports.viewEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ company: req.user.company });
        return res.json({
            employees
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({
            msg: 'An error occured'
        });
    }
}