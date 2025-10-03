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

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put('/:id', protect, admin, adminOrderController.updateOrderStatus)

module.exports = router