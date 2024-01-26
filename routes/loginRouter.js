const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')

// Get all users
router.get('/', userController.index)

// Create a new user
router.post('/', userController.create)

// Update user by ID
router.put('/:id', userController.update)

// Delete user by ID
router.delete('/:id', userController.destroy)

// Get user by ID
router.get('/:id', userController.show)

module.exports = router;