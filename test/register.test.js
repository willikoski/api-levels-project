const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/userLevels');
const Location = require('../models/location');

describe('Register Controller Tests', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'testpassword',
            level: 1,
        });

        await Location.create({
            location: ['AC Bethesda', 'AC DC', 'AC National Harbor'],
        });
    });

    afterEach(async () => {
        await User.deleteMany();
        await Location.deleteMany();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'willy',
                email: 'useratga@somethingemail.com',
                password: '123456789',
                level: 1,
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should handle registration errors for existing username', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'newuser@example.com',
                password: '123456789',
                level: 1,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User with this username already exists');
    });

    it('should handle registration errors for existing email', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'newuser',
                email: 'testuser@example.com',
                password: '123456789',
                level: 1,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User with this email already exists');
    });

    it('should handle registration errors for missing fields', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                // Missing required fields
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required fields');
        expect(response.body.details).toBeDefined(); // Additional details for missing fields
    });

    it('should handle registration errors for missing username', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                email: 'newuser@example.com',
                password: '123456789',
                level: 1,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required fields');
        expect(response.body.details).toHaveProperty('username', 'Username is required');
    });

    it('should handle registration errors for missing email', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'newuser',
                password: '123456789',
                level: 1,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required fields');
        expect(response.body.details).toHaveProperty('email', 'Email is required');
    });

    // Add similar tests for missing password and level fields
});
