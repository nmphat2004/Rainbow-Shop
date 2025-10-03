const Order = require('../models/Order')

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
    res.json(orders)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

module.exports = {
  getAllOrders
}