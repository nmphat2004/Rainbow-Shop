const express = require('express')
const userController = require('../controller/user.controller')

const router = express.Router()

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post('/register', userController.register)

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post('/login', userController.login)

module.exports = router