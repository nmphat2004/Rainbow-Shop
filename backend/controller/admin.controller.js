const User = require('../models/user')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

const addUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role
  } = req.body

  try {
    let user = await User.findOne({
      email
    })
    if (user) return res.status(400).json({
      message: 'User already exists'
    })

    user = new User({
      name,
      email,
      password,
      role: role || 'customer'
    })

    await user.save()
    res.status(201).json({
      message: 'User created successfully'
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

module.exports = {
  getAllUsers,
  addUser
}