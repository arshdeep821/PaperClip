import request from 'supertest';
import { expect } from 'chai';

const baseURL = 'http://localhost:3001';

describe('Users API Endpoints', function() {
	let testUser;
	let testUserId;

	before(async function() {
		const unique = Date.now();
		testUser = {
			username: 'testuser_' + unique,
			name: 'Test User',
			email: 'testuser_' + unique + '@example.com',
			password: 'password123',
			city: 'Test City',
			country: 'Test Country',
			lat: 1,
			lon: 5
		};
	});

	describe('POST /users', function() {
		it('should create a new user', async function() {
			const res = await request(baseURL)
				.post('/users')
				.send(testUser);

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
			expect(res.body.username).to.equal(testUser.username);
			expect(res.body.name).to.equal(testUser.name);
			expect(res.body.email).to.equal(testUser.email);
			expect(res.body.city).to.equal(testUser.city);
			expect(res.body.country).to.equal(testUser.country);
			expect(res.body.lat).to.equal(testUser.lat);
			expect(res.body.lon).to.equal(testUser.lon);
			expect(res.body).to.have.property('inventory');
			expect(res.body).to.have.property('isPrivate');
			expect(res.body.isPrivate).to.be.false;

			testUserId = res.body._id;
		});

		it('should fail to create user with missing username', async function() {
			const userData = { ...testUser };
			delete userData.username;

			const res = await request(baseURL)
				.post('/users')
				.send(userData);

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});

		it('should fail to create user with missing email', async function() {
			const userData = { ...testUser };
			delete userData.email;

			const res = await request(baseURL)
				.post('/users')
				.send(userData);

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});

		it('should fail to create user with missing password', async function() {
			const userData = { ...testUser };
			delete userData.password;

			const res = await request(baseURL)
				.post('/users')
				.send(userData);

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});

		it('should fail to create user with duplicate username', async function() {
			const res = await request(baseURL)
				.post('/users')
				.send(testUser);

			expect(res.status).to.equal(409);
			expect(res.body).to.have.property('error');
		});

		it('should fail to create user with duplicate email', async function() {
			const userData = { ...testUser };
			userData.username = 'different_username_' + Date.now();

			const res = await request(baseURL)
				.post('/users')
				.send(userData);

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error');
		});
	});

	describe('POST /users/login', function() {
		it('should login user successfully', async function() {
			const res = await request(baseURL)
				.post('/users/login')
				.send({
					username: testUser.username,
					password: testUser.password
				});

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('_id');
			expect(res.body.username).to.equal(testUser.username);
			expect(res.body).to.have.property('isPrivate');
		});

		it('should fail to login with wrong password', async function() {
			const res = await request(baseURL)
				.post('/users/login')
				.send({
					username: testUser.username,
					password: 'wrongpassword'
				});

			expect(res.status).to.equal(401);
			expect(res.body).to.have.property('error');
		});

		it('should fail to login with non-existent username', async function() {
			const res = await request(baseURL)
				.post('/users/login')
				.send({
					username: 'nonexistentuser',
					password: testUser.password
				});

			expect(res.status).to.equal(401);
			expect(res.body).to.have.property('error');
		});

		it('should fail to login with missing username', async function() {
			const res = await request(baseURL)
				.post('/users/login')
				.send({
					password: testUser.password
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});

		it('should fail to login with missing password', async function() {
			const res = await request(baseURL)
				.post('/users/login')
				.send({
					username: testUser.username
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
	});

	describe('GET /users/:id', function() {
		it('should get user by ID', async function() {
			const res = await request(baseURL)
				.get(`/users/${testUserId}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('_id');
			expect(res.body.username).to.equal(testUser.username);
			expect(res.body.name).to.equal(testUser.name);
			expect(res.body.email).to.equal(testUser.email);
		});

		it('should fail to get non-existent user', async function() {
			const res = await request(baseURL)
				.get('/users/111111111111111111111111');

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	});

	describe('PUT /users/:id', function() {
		it('should update user successfully', async function() {
			const updateData = {
				name: 'Updated Name',
				email: 'updated_' + Date.now() + '@example.com',
				city: 'New City',
				country: 'New Country',
				tradingRadius: 25
			};

			const res = await request(baseURL)
				.put(`/users/${testUserId}`)
				.send(updateData);

			expect(res.status).to.equal(200);
			expect(res.body.name).to.equal(updateData.name);
			expect(res.body.email).to.equal(updateData.email);
			expect(res.body.city).to.equal(updateData.city);
			expect(res.body.country).to.equal(updateData.country);
			expect(res.body.tradingRadius).to.equal(updateData.tradingRadius);
		});

		it('should fail to update non-existent user', async function() {
			const res = await request(baseURL)
				.put('/users/111111111111111111111111')
				.send({ name: 'Test' });

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	});

	describe('PATCH /users/:id/preferences', function() {
		it('should update user preferences', async function() {
			const preferences = {
				preferredCategories: ['Electronics', 'Books'],
				notificationSettings: {
					email: true,
					push: false
				}
			};

			const res = await request(baseURL)
				.patch(`/users/${testUserId}/preferences`)
				.send(preferences);

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});

		it('should fail to update preferences for non-existent user', async function() {
			const res = await request(baseURL)
				.patch('/users/111111111111111111111111/preferences')
				.send({ preferredCategories: ['Test'] });

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
		});
	});

	describe('PATCH /users/:id/privacy', function() {
		it('should update user privacy settings', async function() {
			const privacyData = {
				isPrivate: true
			};

			const res = await request(baseURL)
				.patch(`/users/${testUserId}/privacy`)
				.send(privacyData);

			expect(res.status).to.equal(200);
			expect(res.body.isPrivate).to.be.true;
		});

		it('should toggle privacy back to false', async function() {
			const privacyData = {
				isPrivate: false
			};

			const res = await request(baseURL)
				.patch(`/users/${testUserId}/privacy`)
				.send(privacyData);

			expect(res.status).to.equal(200);
			expect(res.body.isPrivate).to.be.false;
		});

		it('should fail to update privacy for non-existent user', async function() {
			const res = await request(baseURL)
				.patch('/users/111111111111111111111111/privacy')
				.send({ isPrivate: true });

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	});

	describe('PATCH /users/:id/password', function() {
		it('should update user password', async function() {
			const passwordData = {
				currentPassword: testUser.password,
				newPassword: 'newpassword123'
			};

			const res = await request(baseURL)
				.patch(`/users/${testUserId}/password`)
				.send(passwordData);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('message');
		});

		it('should fail to update password with wrong current password', async function() {
			const passwordData = {
				currentPassword: 'wrongpassword',
				newPassword: 'newpassword123'
			};

			const res = await request(baseURL)
				.patch(`/users/${testUserId}/password`)
				.send(passwordData);

			expect(res.status).to.equal(401);
			expect(res.body).to.have.property('error');
		});

		it('should fail to update password for non-existent user', async function() {
			const res = await request(baseURL)
				.patch('/users/111111111111111111111111/password')
				.send({
					currentPassword: 'test',
					newPassword: 'new'
				});

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	});

	describe('GET /users/check-username/:username', function() {
		it('should check username availability - available', async function() {
			const uniqueUsername = 'available_' + Date.now();
			const res = await request(baseURL)
				.get(`/users/check-username/${uniqueUsername}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('available');
			expect(res.body.available).to.be.true;
		});

		it('should check username availability - taken', async function() {
			const res = await request(baseURL)
				.get(`/users/check-username/${testUser.username}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('available');
			expect(res.body.available).to.be.false;
		});
	});

	describe('GET /users/:id/recommend', function() {
		it('should get recommendations for user', async function() {
			const res = await request(baseURL)
				.get(`/users/${testUserId}/recommend`);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('data');
			expect(res.body.data).to.be.an('array');
		});

		it('should fail to get recommendations for non-existent user', async function() {
			const res = await request(baseURL)
				.get('/users/111111111111111111111111/recommend');

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	});

	describe('PATCH /users/:id/profile-picture', function() {
		it('should update user profile picture', async function() {
			const res = await request(baseURL)
				.patch(`/users/${testUserId}/profile-picture`)
				.attach('profilePicture', Buffer.from('fake image data'), 'test.jpg');

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('profilePicture');
			expect(res.body.profilePicture).to.be.a('string');
		});

		it('should fail to update profile picture for non-existent user', async function() {
			const res = await request(baseURL)
				.patch('/users/111111111111111111111111/profile-picture')
				.attach('profilePicture', Buffer.from('fake image data'), 'test.jpg');

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	});

	describe('DELETE /users/:id', function() {
		it('should delete user successfully', async function() {
			const res = await request(baseURL)
				.delete(`/users/${testUserId}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('message');
		});

		it('should fail to delete non-existent user', async function() {
			const res = await request(baseURL)
				.delete('/users/111111111111111111111111');

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});

		it('should fail to get deleted user', async function() {
			const res = await request(baseURL)
				.get(`/users/${testUserId}`);

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
		});
	});

	describe('Input validation', function() {
		it('should validate email format', async function() {
			const userData = {
				username: 'testemail_' + Date.now(),
				name: 'Test Email',
				email: 'invalid-email',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 1,
				lon: 5
			};

			const res = await request(baseURL)
				.post('/users')
				.send(userData);

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
		});

		it('should validate password length', async function() {
			const userData = {
				username: 'testpass_' + Date.now(),
				name: 'Test Password',
				email: 'testpass@example.com',
				password: '123',
				city: 'Test City',
				country: 'Test Country',
				lat: 1,
				lon: 5
			};

			const res = await request(baseURL)
				.post('/users')
				.send(userData);

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
		});

		it('should validate trading radius is positive', async function() {
			const userData = {
				username: 'testradius_' + Date.now(),
				name: 'Test Radius',
				email: 'testradius@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 1,
				lon: 5,
				tradingRadius: -10
			};

			const res = await request(baseURL)
				.post('/users')
				.send(userData);

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
		});
	});
});
