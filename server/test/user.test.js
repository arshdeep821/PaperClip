import request from 'supertest';
import { expect } from 'chai';

describe('User API Endpoints', function() {
	const baseURL = 'http://localhost:3001';
	let testUser = {
		username: 'testuser_' + Date.now(),
		name: 'Test User',
		email: 'testuser_' + Date.now() + '@example.com',
		password: 'password123',
		city: 'Test City',
		country: 'Test Country'
	};

	it('should create a new user', async function() {
		const res = await request(baseURL)
			.post('/users')
			.send(testUser);
		console.log('Create user response:', res.status, res.body);
		expect(res.status).to.equal(201);
		expect(res.body).to.have.property('_id');
		expect(res.body.username).to.equal(testUser.username);
		expect(res.body.email).to.equal(testUser.email);
	});

	// it('should login the user', async function() {
	// 	const res = await request(baseURL)
	// 		.post('/users/login')
	// 		.send({ email: testUser.email, password: testUser.password });
	// 	console.log('Login user response:', res.status, res.body);
	// 	expect(res.status).to.equal(200);
	// 	expect(res.body).to.have.property('token');
	// });
});
