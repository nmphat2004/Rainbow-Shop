const express = require('express')
const {
  protect
} = require('../middleware/auth')
const productController = require('../controller/product.controller')

const router = express.Router()

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post('/', protect, productController.createProduct)

module.exports = router