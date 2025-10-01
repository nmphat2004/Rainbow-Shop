const express = require('express')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const uploadController = require('../controller/upload.controller')

require('dotenv').config()

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const router = express.Router()

// Multer setup using memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage
})

router.post('/', upload.single('image'), uploadController.uploadImage)

module.exports = router