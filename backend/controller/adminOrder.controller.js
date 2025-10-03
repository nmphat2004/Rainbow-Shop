const Order = require('../models/Order')

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email')
    res.json(orders)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.status = req.body.status || order.status
      order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered
      order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt

      await order.save()
      res.json(order)
    } else {
      res.status(404).json({
        message: 'Order not found'
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
  getAllOrders,
  updateOrderStatus
}