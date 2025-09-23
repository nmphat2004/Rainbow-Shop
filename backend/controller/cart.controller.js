const Cart = require('../models/Cart')
const Product = require('../models/Product')

const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({
    user: userId
  })
  else if (guestId) return await Cart.findOne({
    guestId
  })
  return null
}

const createCart = async (req, res) => {
  const {
    productId,
    quantity,
    size,
    color,
    guestId,
    userId
  } = req.body

  try {
    const product = await Product.findById(productId)

    if (!product) return res.status(404).json({
      message: 'Product not found'
    })

    // Determine if the user is logged in or guest
    let cart = await getCart(userId, guestId)

    // If the cart exists, update it
    if (cart) {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId && p.size === size && p.color === color)

      if (productIndex > -1) {
        // if the product already exists, update the quantity
        cart.products[productIndex].quantity += quantity
      } else {
        // add new product
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity
        })
      }

      // Recalculate the total price
      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)

      await cart.save()

      return res.status(200).json(cart)
    } else {
      // Create a new cart for the guest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : 'guest_' + new Date().getTime(),
        products: [{
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity
        }],
        totalPrice: product.price * quantity
      })
      return res.status(201).json(newCart)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error')
  }
}

const updateQuantityProduct = async (req, res) => {
  const {
    productId,
    quantity,
    size,
    color,
    guestId,
    userId
  } = req.body

  try {
    let cart = await getCart(userId, guestId)

    if (!cart) res.status(404).json({
      message: 'Cart not found'
    })

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId && p.size === size && p.color === color)

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity
      } else {
        cart.products.splice(productIndex, 1) // Remove product if quantity is 0
      }

      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)

      await cart.save()
      return res.status(200).json(cart)
    } else {
      return res.status(404).json({
        message: 'Product not found in cart'
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

const deleteProductFromCart = async (req, res) => {
  const {
    productId,
    size,
    color,
    guestId,
    userId
  } = req.body


  try {
    let cart = await getCart(userId, guestId)

    if (!cart) return res.status(404).json({
      message: 'Cart not found'
    })

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId && p.size === size && p.color === color)

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1)

      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)

      await cart.save()
      return res.status(200).json(cart)
    } else {
      return res.status(404).json({
        message: 'Product not found in the cart'
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
  createCart,
  updateQuantityProduct,
  deleteProductFromCart
}