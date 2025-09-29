const express = require('express')
const orderController = require('../controller/order.controller')
const {
  protect
} = require('../middleware/auth')

const router = express.Router()


module.exports = router