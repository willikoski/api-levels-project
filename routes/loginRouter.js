const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.auth, userController.deleteUser)

// creating routes for company and location
router.post('/createCompany', userController.createCompany)
router.post('/createLocation', userController.createLocation)

module.exports = router;
