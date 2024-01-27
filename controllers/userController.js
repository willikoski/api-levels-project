const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userLevels'); // Importing user model
const Location = require('../models/location'); // /models/locatin MODEL

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')

        if (!token) {
            throw new Error('Authorization header missing')
        }

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        const user = await User.findById(decoded._id)

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message)
        res.status(401).json({ message: 'Not authorized' })
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, level, location } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8)
        // creating new user
        const user = new User({ username, email, password: hashedPassword, level })

        // check the location model schema
        if (location) {
            const newLocation = new Location({ location })
            await newLocation.save()
            user.location = newLocation._id; // Assuming your User model has a location field
        }

        // Save the user
        await user.save();

        const token = await user.generateAuthToken()
        res.status(200).json({ user, token })
    } catch (error) {
        console.error(error.message) // Log the error message
        res.status(400).json({ message: error.message })
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).send('Invalid login credentials')
        } else {
            const token = await user.generateAuthToken()
            res.json({ user, token })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const user = await User.findOne({ _id: req.params.id })
        updates.forEach(update => (user[update] = req.body[update]))
        await user.save()
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

exports.deleteUser = async (req, res) => {
    try{
      await req.user.deleteOne()
      res.json({ message: 'User deleted' })
    }catch(error){
      res.status(400).json({message: error.message})
    }
  }
  
