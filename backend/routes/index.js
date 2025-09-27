const userRoutes = require('./user.routes')
const productRoutes = require('./product.routes')
const cartRoutes = require('./cart.routes')

module.exports.routes = (app) => {
  app.use('/api/users', userRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/cart', cartRoutes)
}