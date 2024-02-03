const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userLevels')
const Company = require('../models/company') 

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')

        if (!token) {
            throw new Error('Authorization header missing')
        }

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        const user = await User.findById(decoded._id)

        if (!user) {
            throw new Error('User not found')
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message)
        res.status(401).json({ message: 'Not authorized' })
    }
}

exports.createCompany = async (req, res) => {
    try {
        const { company } = req.body;
        const newCompany = new Company({ company })
        const savedCompany = await newCompany.save()

        // console.log('Request Body:', req.body)
        // console.log('Saved Company:', savedCompany) // wheres the error at

        // print creating so you can crab id
        res.status(201).json({ company: savedCompany, message: 'Company created successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
};

exports.createLocation = async (req, res) => {
    try {
        const { company, locations } = req.body;

        if (!company || !locations || locations.length === 0) {
            throw new Error('Invalid request data')
        }

        // Check if the company exists
        const existingCompany = await Company.findOne({ _id: company })

        if (!existingCompany) {
            throw new Error('Company not found')
        }

        // Add new locations to the existing company
        for (const loc of locations) {
            existingCompany.locations.push({ location: loc })
        }

        // Save the updated company with new locations
        await existingCompany.save()

        // Send the company ID in the response
        res.status(201).json({
            company: {
                company: existingCompany.company,
                _id: existingCompany._id,
                locations: existingCompany.locations,
                createdAt: existingCompany.createdAt,
                updatedAt: existingCompany.updatedAt,
                __v: existingCompany.__v
            },
            message: 'Locations created successfully for the company'
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, company, locations, level } = req.body;

        // check if the company exists
        let existingCompany = await Company.findOne({ company })

        if (!existingCompany) {
            existingCompany = await Company.findOne({ company: 'N/A' }) // Default For if company doesnt exists

            if (!existingCompany) {
                existingCompany = new Company({ company: 'N/A' })
                await existingCompany.save()
            }
        }
        // We need at Least one location to categorize our new user
        if (!locations || locations.length === 0) {
            throw new Error('No locations provided')
        }

        // Check if the specified locations exist for the company
        const existingLocations = existingCompany.locations.filter(loc => locations.includes(loc._id.toString()))
        if (existingLocations.length !== locations.length) {
            throw new Error('One or more locations not found in the specified company')
        }
        // Create a new user with references to company and locations
        const user = new User({
            username,
            email,
            password,
            company: existingCompany._id,
            locations: existingLocations.map(loc => loc._id),
            level,
        })

        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).json({ user, token })
    } catch (error) {
        console.error(error.message)
        res.status(400).json({ message: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).populate('company')

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid login credentials' })
        }

        const token = await user.generateAuthToken()

        res.json({ user, token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const user = await User.findOne({ _id: req.params.id })
        updates.forEach(update => (user[update] = req.body[update]))
        await user.save()
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await req.user.deleteOne()
        res.json({ message: 'User deleted' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
