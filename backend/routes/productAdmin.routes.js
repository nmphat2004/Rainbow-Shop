const express = require('express')
const {
  protect,
  admin
} = require('../middleware/auth')
const productAdminController = require('../controller/productAdmin.controller')

const router = express.Router()

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get('/', protect, admin, productAdminController.getAllProducts)

module.exports = router