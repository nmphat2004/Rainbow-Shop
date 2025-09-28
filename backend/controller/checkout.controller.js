const Checkout = require('../models/Checkout')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Order = require('../models/Order')

const createCheckout = async (req, res) => {
  const {
    checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice
  } = req.body

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({
      message: 'No items in checkout'
    })
  }

  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending',
      isPaid: false
    })
    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout)
  } catch (error) {
    console.error('Error creating checkout session');
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

const updateCheckout = async (req, res) => {
  const {
    paymentStatus,
    paymentDetails
  } = req.body

  try {
    const checkout = await Checkout.findById(req.params.id)

    if (!checkout) return res.status(404).json({
      message: 'Checkout not found'
    })

    if (paymentStatus === 'paid') {
      checkout.isPaid = true
      checkout.paymentStatus = paymentStatus
      checkout.paymentDetails = paymentDetails
      checkout.paidAt = Date.now()

      await checkout.save()
      res.status(200).json(checkout)
    } else {
      res.status(400).json({
        message: 'Invalid Payment Status'
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

module.exports = {
  createCheckout,
  updateCheckout
}