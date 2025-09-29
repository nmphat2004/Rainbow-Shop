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

module.exports = {
  getMyOrders
}