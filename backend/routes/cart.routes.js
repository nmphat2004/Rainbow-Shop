const express = require('express')
const {
  protect
} = require('../middleware/auth')
const cartController = require('../controller/cart.controller')

const router = express.Router()

module.exports = router