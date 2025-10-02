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
      message: 'User created successfully',
      user
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error'
    })
  }
}

const updateUser = async (req, res) => {
  const {
    name,
    email,
    role
  } = req.body

  try {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = name || user.name
      user.email = email || user.email
      user.role = role || user.role
    }

    await user.save()
    res.json({
      message: 'User updated successfully',
      user
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
  addUser,
  updateUser
}