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

module.exports = router