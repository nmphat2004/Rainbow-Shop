const express = require('express')
const orderController = require('../controller/order.controller')
const {
  protect
} = require('../middleware/auth')

const router = express.Router()

// @route GET /api/order/my-order
// @desc Get logged-in user's orders
// @access Private
router.get('/my-orders', protect, orderController.getMyOrders)


module.exports = router