const express = require('express')
const orderController = require('../controller/order.controller')
const {
  protect
} = require('../middleware/auth')

const router = express.Router()

// @route GET /api/orders/my-order
// @desc Get logged-in user's orders
// @access Private
router.get('/my-orders', protect, orderController.getMyOrders)

// @route GET /api/orders/:id
// @desc Get order detail by id
// @access Private
router.get('/:id', protect, orderController.getOrderById)

module.exports = router