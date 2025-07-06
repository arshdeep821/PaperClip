// import request from 'supertest';
// import { expect } from 'chai';

// const baseURL = 'http://localhost:3001';

// describe('Trade API Endpoints', function() {
// 	let user1, user2, item1, item2, tradeId;

// 	before(async function() {
// 		const unique = Date.now();
// 		const userRes1 = await request(baseURL)
// 			.post('/users')
// 			.send({
// 				username: 'tradeuser1_' + unique,
// 				name: 'Trade User 1',
// 				email: 'tradeuser1_' + unique + '@example.com',
// 				password: 'password123',
// 				city: 'Test City',
// 				country: 'Test Country'
// 			});
// 		user1 = userRes1.body;

// 		const userRes2 = await request(baseURL)
// 			.post('/users')
// 			.send({
// 				username: 'tradeuser2_' + unique,
// 				name: 'Trade User 2',
// 				email: 'tradeuser2_' + unique + '@example.com',
// 				password: 'password123',
// 				city: 'Test City',
// 				country: 'Test Country'
// 			});
// 		user2 = userRes2.body;

// 		const catRes = await request(baseURL)
// 			.post('/categories')
// 			.send({
// 				name: 'Trade Category ' + unique,
// 				description: 'A trade test category'
// 			});
// 		const category = catRes.body;

// 		const itemRes1 = await request(baseURL)
// 			.post('/items')
// 			.field('name', 'Trade Item 1')
// 			.field('description', 'Item for trade 1')
// 			.field('category', category._id)
// 			.field('owner', user1._id)
// 			.field('condition', 'New')
// 			.attach('image', Buffer.from('fake image data'), 'trade1.jpg');
// 		item1 = itemRes1.body;

// 		const itemRes2 = await request(baseURL)
// 			.post('/items')
// 			.field('name', 'Trade Item 2')
// 			.field('description', 'Item for trade 2')
// 			.field('category', category._id)
// 			.field('owner', user2._id)
// 			.field('condition', 'New')
// 			.attach('image', Buffer.from('fake image data'), 'trade2.jpg');
// 		item2 = itemRes2.body;
// 	});

// 	it('should create a new trade', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				user2: user2._id,
// 				items1: [item1._id],
// 				items2: [item2._id]
// 			});
// 		expect(res.status).to.equal(201);
// 		expect(res.body).to.have.property('_id');
// 		expect(res.body.user1).to.have.property('_id');
// 		expect(res.body.user2).to.have.property('_id');
// 		expect(res.body.items1).to.be.an('array').that.is.not.empty;
// 		expect(res.body.items2).to.be.an('array').that.is.not.empty;
// 		tradeId = res.body._id;
// 	});

// 	it('should fail to create trade with missing user1', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user2: user2._id,
// 				items1: [item1._id],
// 				items2: [item2._id]
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail to create trade with missing user2', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				items1: [item1._id],
// 				items2: [item2._id]
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail to create trade with missing items1', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				user2: user2._id,
// 				items2: [item2._id]
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail to create trade with missing items2', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				user2: user2._id,
// 				items1: [item1._id]
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail to create trade with empty items1 array', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				user2: user2._id,
// 				items1: [],
// 				items2: [item2._id]
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail to create trade with empty items2 array', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				user2: user2._id,
// 				items1: [item1._id],
// 				items2: []
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail to create trade with non-array items1', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				user2: user2._id,
// 				items1: item1._id,
// 				items2: [item2._id]
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should fail to create trade with non-array items2', async function() {
// 		const res = await request(baseURL)
// 			.post('/trades')
// 			.send({
// 				user1: user1._id,
// 				user2: user2._id,
// 				items1: [item1._id],
// 				items2: item2._id
// 			});
// 		expect(res.status).to.equal(400);
// 		expect(res.body).to.have.property('error');
// 	});

// 	it('should get trades by user1 id', async function() {
// 		const res = await request(baseURL)
// 			.get(`/trades/${user1._id}`);
// 		expect(res.status).to.equal(200);
// 		expect(res.body).to.be.an('array');
// 		if (res.body.length > 0) {
// 			expect(res.body[0]).to.have.property('_id');
// 		}
// 	});

// 	it('should fail to get trades with missing user id', async function() {
// 		const res = await request(baseURL)
// 			.get('/trades/');
// 		expect(res.status).to.equal(404);
// 	});

// 	it('should handle empty trades list for user', async function() {
// 		const unique = Date.now();
// 		const newUserRes = await request(baseURL)
// 			.post('/users')
// 			.send({
// 				username: 'newuser_' + unique,
// 				name: 'New User',
// 				email: 'newuser_' + unique + '@example.com',
// 				password: 'password123',
// 				city: 'Test City',
// 				country: 'Test Country'
// 			});
// 		const newUser = newUserRes.body;

// 		const res = await request(baseURL)
// 			.get(`/trades/${newUser._id}`);
// 		expect(res.status).to.equal(200);
// 		expect(res.body).to.be.an('array');
// 		expect(res.body.length).to.equal(0);
// 	});

// 	it('should fail to get trades with invalid user id format', async function() {
// 		const res = await request(baseURL)
// 			.get('/trades/invalidid123');
// 		expect(res.status).to.equal(500);
// 	});
// });
