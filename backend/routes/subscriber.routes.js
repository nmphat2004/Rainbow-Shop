const express = require('express')
const subscriberController = require('../controller/subscriber.controller')

const router = express.Router()

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public
router.post('/', subscriberController.createSubscriber)

module.exports = router