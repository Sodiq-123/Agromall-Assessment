const express = require('express');
const { register, login, updateProfile, viewEmployees } = require('../controllers/employees.controllers');
const router = express.Router();
const auth = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login)
router.post('/update-profile', auth.verifyToken, updateProfile)
router.get('/view-employee', auth.verifyToken, viewEmployees)


module.exports = router;