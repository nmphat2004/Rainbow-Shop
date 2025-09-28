const express = require('express')
const checkoutController = require('../controller/checkout.controller')
const {
  protect
} = require('../middleware/auth')

const router = express.Router()

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post('/', protect, checkoutController.createCheckout)

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put('/:id/pay', protect, checkoutController.updateCheckout)

module.exports = router