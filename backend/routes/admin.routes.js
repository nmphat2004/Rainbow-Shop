const express = require('express')
const adminController = require('../controller/admin.controller')
const {
  protect,
  admin
} = require('../middleware/auth')

const router = express.Router()

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private
router.get('/users', protect, admin, adminController.getAllUsers)

// @route POST /api/admin/users
// @desc Add a new user (admin)
// @access Private
router.post('/users', protect, admin, adminController.addUser)

module.exports = router