const userRoutes = require('./user.routes')

module.exports.routes = (app) => {
  app.use('/api/users', userRoutes)
}