const express = require('express')
const {
  protect
} = require('../middleware/auth')
const cartController = require('../controller/cart.controller')

const router = express.Router()

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged in user
// @access Public
router.post('/', cartController.createCart)

// @route PUT /api/route
// @desc Update product quantity in the cart for a guest or logged-in user
// @access Public
router.put('/', cartController.updateQuantityProduct)

module.exports = router