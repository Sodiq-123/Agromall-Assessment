const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.models');
const auth = require('../middleware/auth');
const { register, login, createCompany, makeAdmin, getCompanies, addEmployee } = require('../controllers/admin.controller');

router.post('/register', register)
router.post('/login', login)
router.post('/company-create', auth.verifyToken, createCompany)
router.post('/makeAdmin', auth.verifyToken, makeAdmin)
router.post('/add-employee', auth.verifyToken, addEmployee)
router.get('/get-companies', auth.verifyToken, getCompanies)

module.exports = router;