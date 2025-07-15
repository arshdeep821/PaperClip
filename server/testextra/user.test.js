// import request from 'supertest';
// import { expect } from 'chai';

// // added these tests
// describe('User API Endpoints', function() {
// 	const baseURL = 'http://localhost:3001';
// 	const unique = Date.now();
// 	let testUser = {
// 		username: 'test' + unique,
// 		name: 'Test',
// 		email: 'test' + unique + '@example.com',
// 		password: 'password123',
// 		city: 'vancouver',
// 		country: 'canada'
// 	};
// 	let createdUserId;

// 	it('should create a new user', async function() {
// 		const res = await request(baseURL)
// 			.post('/users')
// 			.send(testUser);
// 		console.log('Create user response:', res.status, res.body);
// 		expect(res.status).to.equal(201);
// 		expect(res.body).to.have.property('_id');
// 		expect(res.body.username).to.equal(testUser.username);
// 		expect(res.body.email).to.equal(testUser.email);
// 		createdUserId = res.body._id;
// 	});

// 	it('should login the user', async function() {
// 		const res = await request(baseURL)
// 			.post('/users/login')
// 			.send({ username: testUser.username, password: testUser.password });
// 		console.log('Login user response:', res.status, res.body);
// 		expect(res.status).to.equal(200);
// 		expect(res.body).to.have.property('username');
// 	});

// 	it('should get user by ID', async function() {
// 		const res = await request(baseURL)
// 			.get(`/users/${createdUserId}`);
// 		expect(res.status).to.equal(200);
// 		expect(res.body).to.have.property('_id', createdUserId);
// 		expect(res.body).to.have.property('username', testUser.username);
// 		expect(res.body).to.have.property('email', testUser.email);
// 		expect(res.body).to.not.have.property('password');
// 	});

// 	it('should fail to get user with invalid ID', async function() {
// 		const res = await request(baseURL)
// 			.get('/users/invalidid123');
// 		expect(res.status).to.equal(500);
// 	});

// 	it('should fail to get non-existent user', async function() {
// 		const res = await request(baseURL)
// 			.get('/users/507f1f77bcf86cd799439011');
// 		expect(res.status).to.equal(404);
// 		expect(res.body).to.have.property('error', 'User not found.');
// 	});

// 	it('should update user successfully', async function() {
// 		const updateData = {
// 			name: 'Updated Name',
// 			city: 'Toronto',
// 			tradingRadius: 15
// 		};
// 		const res = await request(baseURL)
// 			.put(`/users/${createdUserId}`)
// 			.send(updateData);
// 		expect(res.status).to.equal(200);
// 		expect(res.body).to.have.property('name', 'Updated Name');
// 		expect(res.body).to.have.property('city', 'Toronto');
// 		expect(res.body).to.have.property('tradingRadius', 15);
// 		expect(res.body).to.have.property('username', testUser.username);
// 	});

// 	it('should update user email successfully', async function() {
// 		const newEmail = 'updated' + unique + '@example.com';
// 		const res = await request(baseURL)
// 			.put(`/users/${createdUserId}`)
// 			.send({ email: newEmail });
// 		expect(res.status).to.equal(200);
// 		expect(res.body).to.have.property('email', newEmail);
// 	});

// 	it('should fail to update user with duplicate username', async function() {
// 		const unique2 = Date.now();
// 		const testUser2 = {
// 			username: 'test2' + unique2,
// 			name: 'Test2',
// 			email: 'test2' + unique2 + '@example.com',
// 			password: 'password123',
// 			city: 'vancouver',
// 			country: 'canada'
// 		};
// 		await request(baseURL).post('/users').send(testUser2);

// 		const res = await request(baseURL)
// 			.put(`/users/${createdUserId}`)
// 			.send({ username: testUser2.username });
// 		expect(res.status).to.equal(409);
// 		expect(res.body).to.have.property('error', 'Username already exists.');
// 	});

// 	it('should fail to update user with duplicate email', async function() {
// 		const unique3 = Date.now();
// 		const testUser3 = {
// 			username: 'test3' + unique3,
// 			name: 'Test3',
// 			email: 'test3' + unique3 + '@example.com',
// 			password: 'password123',
// 			city: 'vancouver',
// 			country: 'canada'
// 		};
// 		await request(baseURL).post('/users').send(testUser3);

// 		const res = await request(baseURL)
// 			.put(`/users/${createdUserId}`)
// 			.send({ email: testUser3.email });
// 		expect(res.status).to.equal(409);
// 		expect(res.body).to.have.property('error', 'Email already exists.');
// 	});

// 	it('should fail to update non-existent user', async function() {
// 		const res = await request(baseURL)
// 			.put('/users/507f1f77bcf86cd799439011')
// 			.send({ name: 'New Name' });
// 		expect(res.status).to.equal(404);
// 		expect(res.body).to.have.property('error', 'User not found.');
// 	});

// 	it('should fail with missing password', async function() {
// 		const res = await request(baseURL)
// 			.post('/users/login')
// 			.send({ username: testUser.username });
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail with invalid username', async function() {
// 		const res = await request(baseURL)
// 			.post('/users/login')
// 			.send({ username: 'nonexistentuser', password: 'password123' });
// 		expect(res.status).to.equal(401);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail with invalid password', async function() {
// 		const res = await request(baseURL)
// 			.post('/users/login')
// 			.send({ username: testUser.username, password: 'wrongpassword' });
// 		expect(res.status).to.equal(401);
// 		expect(res.body).to.have.property('error');
// 	});
// });
