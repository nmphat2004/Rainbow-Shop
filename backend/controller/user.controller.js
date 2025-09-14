const User = require('../models/user')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body

  try {
    // Registration logic
    let user = await User.findOne({
      email
    })

    if (user) return res.status(400).json({
      message: 'User already exists'
    })

    user = new User({
      name,
      email,
      password
    })
    await user.save()

    // Create JWT Payload
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    }

    // Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '40h'
    }, (err, token) => {
      if (err) throw err

      // Send the user and token in response
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role
        },
        token
      })
    })
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error')
  }
}

const login = async (req, res) => {
  const {
    email,
    password
  } = req.body

  try {
    // Find the user by email
    let user = await User.findOne({
      email
    })

    if (!user) return res.status(400).json({
      message: 'Invalid Credentials'
    })

    const isMatch = await user.matchPassword(password)
    if (!isMatch) return res.status(400).json({
      message: 'Invalid Credentials'
    })

    // Create JWT Payload
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    }

    // Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '40h'
    }, (err, token) => {
      if (err) throw err

      // Send the user and token in response
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role
        },
        token
      })
    })
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error')
  }
}

module.exports = {
  register,
  login
}