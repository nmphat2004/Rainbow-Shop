const express = require('express')
const {
  protect,
  admin
} = require('../middleware/auth')
const adminOrderController = require('../controller/adminOrder.controller')

const router = express.Router()

// @route GET /api/admin/orders
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get('/', protect, admin, adminOrderController.getAllOrders)

module.exports = router