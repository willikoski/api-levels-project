const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/userLevels');
const Location = require('../models/location');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Remove all users before each test to avoid duplicate key errors
    await User.deleteMany({});
});

describe('User Controller Tests', () => {
    // /register (createUser)
    test('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'JohnDoe',
                email: 'john.doe@example.com',
                password: 'password123',
                level: 1,
            });

        console.log(response.body.user.password)

        expect(response.statusCode).toBe(200)
        expect(response.body.user.username).toEqual('JohnDoe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body.user.password).toEqual(response.body.user.password); // CHECKS if hash is truthy
        expect(response.body.user.level).toEqual(1)
        expect(response.body).toHaveProperty('token')
    });

    // /login (loginUser)
    test('should login a user', async () => {
        const user = new User({
            username: 'JohnDoe',
            email: 'john.doe@example.com',
            password: 'password123',
            level: 1,
        });
        await user.save();

        const response = await request(app)
            .post('/login')
            .send({ email: 'john.doe@example.com', password: 'password123' })

        expect(response.statusCode).toBe(200)
        expect(response.body.user.username).toEqual('JohnDoe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body).toHaveProperty('token')
    });

    // /:id (updateUser)
    test('should update a user', async () => {
        const user = new User({
            username: 'JohnDoe',
            email: 'john.doe@example.com',
            password: 'password123',
            level: 1,
        });
        await user.save();
        const token = await user.generateAuthToken();

        const response = await request(app)
            .put(`/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'JaneDoe', email: 'jane.doe@example.com' })

        expect(response.statusCode).toBe(200)
        expect(response.body.username).toEqual('JaneDoe')
        expect(response.body.email).toEqual('jane.doe@example.com')
    });

// /:id (deleteUser)
test('It should delete a user', async () => {
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