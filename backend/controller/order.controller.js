const Order = require('../models/Order')

const getMyOrders = async (req, res) => {
  try {
    // Find orders for the authenticated user
    const orders = await Order.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    })
    res.json(orders)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) return res.status(404).json({
      message: 'Order not found'
    })

    // Return the full order details
    res.json(order)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

module.exports = {
  getMyOrders,
  getOrderById
}