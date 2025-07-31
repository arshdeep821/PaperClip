import request from 'supertest';
import { expect } from 'chai';

describe('Logout API Endpoints', function() {
	const baseURL = 'http://localhost:3001';
	const unique = Date.now();
	let testUser = {
		username: 'testuser' + unique,
		name: 'Test User',
		email: 'testuser' + unique + '@example.com',
		password: 'password123',
		city: 'vancouver',
		country: 'canada',
		lat: 49.2827,
		lon: -123.1207
	};
	let agent;
	let createdUserId;

	before(async function() {
		agent = request.agent(baseURL);

		const createRes = await agent
			.post('/users')
			.send(testUser);
		expect(createRes.status).to.equal(201);
		createdUserId = createRes.body._id;

		const loginRes = await agent
			.post('/users/login')
			.send({
				username: testUser.username,
				password: testUser.password
			});
		expect(loginRes.status).to.equal(200);
	});

	it('should maintain session before logout', async function() {
		const sessionRes = await agent
			.get('/users/session');
		expect(sessionRes.status).to.equal(200);
		expect(sessionRes.body).to.have.property('username', testUser.username);
	});

	it('should successfully logout user', async function() {
		const res = await agent
			.post('/users/logout');
		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('message', 'Logged out successfully.');
	});

	it('should verify session is removed after logout', async function() {
		const res = await agent
			.get('/users/session');
		expect(res.status).to.not.equal(200);
	});

	it('should handle logout without being logged in', async function() {
		const newAgent = request.agent(baseURL);
		const res = await newAgent
			.post('/users/logout');
		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('message', 'Logged out successfully.');
	});

	it('should verify cookies are cleared after logout', async function() {
		const logoutAgent = request.agent(baseURL);

		await logoutAgent
			.post('/users/login')
			.send({
				username: testUser.username,
				password: testUser.password
			});

		const res = await logoutAgent
			.post('/users/logout');
		expect(res.status).to.equal(200);

		const cookies = res.headers['set-cookie'];
		if (cookies) {
			const connectSidCookie = cookies.find(cookie => cookie.includes('connect.sid'));
			if (connectSidCookie) {
				expect(connectSidCookie).to.include('Expires=');
			}
		}
	});

	it('should handle multiple logout calls gracefully', async function() {
		const multiAgent = request.agent(baseURL);

		await multiAgent
			.post('/users/login')
			.send({
				username: testUser.username,
				password: testUser.password
			});

		const res1 = await multiAgent
			.post('/users/logout');
		expect(res1.status).to.equal(200);

		const res2 = await multiAgent
			.post('/users/logout');
		expect(res2.status).to.equal(200);
	});
});
