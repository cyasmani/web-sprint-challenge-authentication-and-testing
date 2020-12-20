// Write your tests here
test('sanity', () => {
  expect(true).toBe(false)
})

const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const testUser = {username: 'practice', password: 'testing'}

describe('server.js', () => {
    describe('Get request for  them jokes', () => {
        it('return a status 400 when not logged in', async () => {
            const res = await request(server).get('/api/jokes')
        expect(res.status).toBe(400);
        });
        it('return json', async() => {
            const res = await request(server).get('/api/jokes');
            expect(res.type).toBe('application/json')
        });
    });
describe("register", () => {
        it('should return a status code of 201 when adding a new user', async () => {
            await db('users').truncate()
            const res = await request(server)
            .post('/api/auth/register')
            .send(testUser);
            expect(res.status).toBe(201)
        });
        it('should return a status code of 500 with an invalid user', async () => {
            const res = await request(server)
            .post('/api/auth/register')
            .send({user: "test", pass: "1234*"});
            expect(res.status).toBe(500);
        });
    });
describe("loging in", ()=> {
        it('should return status of 200 with test user', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send(testUser);
            expect(res.status).toBe(200)
        })
        it('should return 401 with invalid user', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send({ username: 'The', password: 'Bed' })
            expect(res.status).toBe(401)
        })
    });
});
