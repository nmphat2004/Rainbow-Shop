const express = require('express')
const userController = require('../controller/user.controller')
const {
  protect
} = require('../middleware/auth')

const router = express.Router()

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post('/register', userController.register)

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post('/login', userController.login)

// @route GET /api/users/profile
// @desc Get logged-in user's profile {Protected route}
// @access Private
router.get('/profile', protect, userController.profile)

module.exports = router