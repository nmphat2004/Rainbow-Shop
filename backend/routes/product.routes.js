const express = require('express')
const {
  protect,
  admin
} = require('../middleware/auth')
const productController = require('../controller/product.controller')

const router = express.Router()

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post('/', protect, admin, productController.createProduct)

// @route PUT /api/products/:id
// @desc Update an existing product ID
// @access Private/Admin
router.put('/:id', protect, admin, productController.updateProduct)

// @route DELETE /api/products/:id
// @desc Delete a product by id
// @access Private/Admin
router.delete('/:id', protect, admin, productController.deleteProduct)

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get('/', productController.getAllProducts)

// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public
router.get('/best-seller', productController.getBestSellerProduct)

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get('/:id', productController.getProduct)

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on the current product's gender and category
// @access Public
router.get('/similar/:id', productController.getSimilarProducts)

module.exports = router