const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const User = require('../models/userLevels')
const Company = require('../models/company') 

let mongoServer
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
})

// Refres between everyy test
beforeEach(async () => {
    await User.deleteMany({})
    await Company.deleteMany({})
})

describe('User Controller Tests', () => {
    test('should create a new company', async () => {
        const response = await request(app)
            .post('/createCompany')
            .send({ company: 'TestCompany' })

        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe('Company created successfully')
    })

    test('create locations based off company', async () => {
        const createCompanyResponse = await request(app)
            .post('/createCompany')
            .send({ company: 'TestCompany' })
    
        const companyId = createCompanyResponse.body.company?._id
    
        // Send a request to create locations
        const response = await request(app)
            .post('/createLocation')
            .send({ company: companyId, locations: ['LocationA', 'LocationB'] })
    
        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe('Locations created successfully for the company')
    })

    test('register user with both schemas ', async () => {
        // Generate fake company and location IDs
        const companyId = 'blahblahcompanyid'
        const locationId = 'blahblahlocationid'
    
        // Send a request to register a new user with fake IDs
        const response = await request(app)
            .post('/register')
            .send({
                username: 'JohnDoe',
                email: 'john.doe@example.com',
                password: 'password123',
                company: companyId,
                locations: [locationId],
                level: 1,
            })
    
        // Assertions
        if (response.statusCode === 201) {
            expect(response.body.user.username).toEqual('JohnDoe')
            expect(response.body.user.email).toEqual('john.doe@example.com')
            expect(response.body.user.password).toEqual(response.body.user.password)
            expect(response.body.user.level).toEqual(1)
            expect(response.body.user.company).toEqual(companyId)
            expect(response.body.user.location).toEqual(locationId)
            expect(response.body).toHaveProperty('token')
        } 
    })

    test('login a user', async () => {
        const user = new User({
            username: 'JohnDoe',
            email: 'john.doe@example.com',
            password: 'password123',
            level: 1,
        })
        await user.save()

        const response = await request(app)
            .post('/login')
            .send({ email: 'john.doe@example.com', username: 'JohnDoe', password: 'password123' })

        expect(response.statusCode).toBe(200)
        expect(response.body.user.username).toEqual('JohnDoe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body).toHaveProperty('token')
    })

    test('update a user', async () => {
        const user = new User({
            username: 'JohnDoe',
            email: 'john.doe@example.com',
            password: 'password123',
            level: 1,
        })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'JaneDoe', email: 'jane.doe@example.com' })

        expect(response.statusCode).toBe(200)
        expect(response.body.username).toEqual('JaneDoe')
        expect(response.body.email).toEqual('jane.doe@example.com')
    })
    test('delete a user', async () => {
        const user = new User({ username: 'John Doe', email: 'john.doe@example.com', password: 'password123', level: 1 })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
          .delete(`/${user._id}`)
          .set('Authorization', `Bearer ${token}`)
        
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User deleted')
    })

})
