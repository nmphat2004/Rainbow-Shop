const express = require('express')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

require('dotenv').config()

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Multer setup using memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage
})

const router = express.Router()

module.exports = router