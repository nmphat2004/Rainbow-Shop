const userRoutes = require('./user.routes')
const productRoutes = require('./product.routes')
const cartRoutes = require('./cart.routes')
const checkoutRoutes = require('./checkout.routes')
const orderRoutes = require('./order.routes')

module.exports.routes = (app) => {
  app.use('/api/users', userRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/cart', cartRoutes)
  app.use('/api/checkout', checkoutRoutes)
  app.use('/api/orders', orderRoutes)
}