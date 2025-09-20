const userRoutes = require('./user.routes')
const productRoutes = require('./product.routes')

module.exports.routes = (app) => {
  app.use('/api/users', userRoutes)
  app.use('/api/products', productRoutes)
}