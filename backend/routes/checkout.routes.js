const express = require('express')
const checkoutController = require('../controller/checkout.controller')
const {
  protect
} = require('../middleware/auth')

const router = express.Router()

module.exports = router