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

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete('/', cartController.deleteProductFromCart)

// @route GET /api/cart
// @desc Get logged-in user's or guest user's cart
// @access Public
router.get('/', cartController.getCartDetail)

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post('/merge', protect, cartController.mergeCart)

module.exports = router