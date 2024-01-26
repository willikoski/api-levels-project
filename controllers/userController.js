const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userLevel'); // Importing user model
const Location = require('../models/location'); // Importing location model

const createUser = async (req, res) => {
    try {
        const { username, email, password, level, location } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create a new user
        const user = new User({ username, email, password: hashedPassword, level });

        // Check if location is provided and create a new location
        if (location) {
            const newLocation = new Location({ location });
            await newLocation.save();
            user.location = newLocation._id; // Assuming your User model has a location field
        }

        // Save the user
        await user.save();

        const token = await user.generateAuthToken();
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user has a location, delete it
        if (user.location) {
            await Location.findByIdAndDelete(user.location);
        }

        // Delete the user
        await user.delete();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, deleteUser };
