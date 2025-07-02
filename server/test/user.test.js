import request from 'supertest';
import { expect } from 'chai';

describe('User API Endpoints', function() {
	const baseURL = 'http://localhost:3001';
	const unique = Date.now();
	let testUser = {
		username: 'test' + unique,
		name: 'Test',
		email: 'test' + unique + '@example.com',
		password: 'password123',
		city: 'vancouver',
		country: 'canada'
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

	it('should login the user', async function() {
		const res = await request(baseURL)
			.post('/users/login')
			.send({ username: testUser.username, password: testUser.password });
		console.log('Login user response:', res.status, res.body);
		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('username');
	});

	it('should fail with missing password', async function() {
		const res = await request(baseURL)
			.post('/users/login')
			.send({ username: testUser.username });
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error');
	});

	it('should fail with invalid username', async function() {
		const res = await request(baseURL)
			.post('/users/login')
			.send({ username: 'nonexistentuser', password: 'password123' });
		expect(res.status).to.equal(401);
		expect(res.body).to.have.property('error');
	});

	it('should fail with invalid password', async function() {
		const res = await request(baseURL)
			.post('/users/login')
			.send({ username: testUser.username, password: 'wrongpassword' });
		expect(res.status).to.equal(401);
		expect(res.body).to.have.property('error');
	});
});
