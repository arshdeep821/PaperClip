import request from 'supertest';
import { expect } from 'chai';

const baseURL = 'http://localhost:3001';

describe('Trades API Endpoints', function() {
	let testUser1;
	let testUser2;
	let testUser3;
	let testCategory;
	let testItem1;
	let testItem2;
	let testItem3;
	let testItem4;
	let testTradeId;

	before(async function() {
		const unique = Date.now();

		const userRes1 = await request(baseURL)
			.post('/users')
			.send({
				username: 'tradeuser1_' + unique,
				name: 'Trade User 1',
				email: 'tradeuser1_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 1,
				lon: 5
			});
		testUser1 = userRes1.body;

		const userRes2 = await request(baseURL)
			.post('/users')
			.send({
				username: 'tradeuser2_' + unique,
				name: 'Trade User 2',
				email: 'tradeuser2_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 2,
				lon: 6
			});
		testUser2 = userRes2.body;

		const userRes3 = await request(baseURL)
			.post('/users')
			.send({
				username: 'tradeuser3_' + unique,
				name: 'Trade User 3',
				email: 'tradeuser3_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 3,
				lon: 7
			});
		testUser3 = userRes3.body;

		const catRes = await request(baseURL)
			.post('/categories')
			.send({
				name: 'Test Category ' + unique,
				description: 'A test category for trades'
			});
		testCategory = catRes.body;

		const itemRes1 = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item 1')
			.field('description', 'A test item for user 1')
			.field('category', testCategory._id)
			.field('owner', testUser1._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test1.jpg');
		testItem1 = itemRes1.body;

		const itemRes2 = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item 2')
			.field('description', 'A test item for user 1')
			.field('category', testCategory._id)
			.field('owner', testUser1._id)
			.field('condition', 'Used')
			.attach('image', Buffer.from('fake image data'), 'test2.jpg');
		testItem2 = itemRes2.body;

		const itemRes3 = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item 3')
			.field('description', 'A test item for user 2')
			.field('category', testCategory._id)
			.field('owner', testUser2._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test3.jpg');
		testItem3 = itemRes3.body;

		const itemRes4 = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item 4')
			.field('description', 'A test item for user 2')
			.field('category', testCategory._id)
			.field('owner', testUser2._id)
			.field('condition', 'Used')
			.attach('image', Buffer.from('fake image data'), 'test4.jpg');
		testItem4 = itemRes4.body;

		await request(baseURL)
			.put(`/users/${testUser1._id}`)
			.send({
				inventory: [testItem1._id, testItem2._id]
			});

		await request(baseURL)
			.put(`/users/${testUser2._id}`)
			.send({
				inventory: [testItem3._id, testItem4._id]
			});
	});

	describe('POST /trades', function() {
		it('should create a new trade', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [testItem1._id],
					items2: [testItem3._id]
				});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
			expect(res.body.user1).to.have.property('_id');
			expect(res.body.user2).to.have.property('_id');
			expect(res.body.items1).to.be.an('array');
			expect(res.body.items2).to.be.an('array');
			expect(res.body.status).to.equal('pending');
			expect(res.body.items1[0]._id).to.equal(testItem1._id);
			expect(res.body.items2[0]._id).to.equal(testItem3._id);

			testTradeId = res.body._id;
		});

		it('should fail to create trade with missing user1', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user2: testUser2._id,
					items1: [testItem1._id],
					items2: [testItem3._id]
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.include('user1, user2, items1, and items2 are required');
		});

		it('should fail to create trade with missing user2', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					items1: [testItem1._id],
					items2: [testItem3._id]
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.include('user1, user2, items1, and items2 are required');
		});

		it('should fail to create trade with missing items1', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items2: [testItem3._id]
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.include('user1, user2, items1, and items2 are required');
		});

		it('should fail to create trade with missing items2', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [testItem1._id]
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.include('user1, user2, items1, and items2 are required');
		});

		it('should fail to create trade with empty items1 array', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [],
					items2: [testItem3._id]
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.include('user1, user2, items1, and items2 are required');
		});

		it('should fail to create trade with empty items2 array', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [testItem1._id],
					items2: []
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.include('user1, user2, items1, and items2 are required');
		});

		it('should create trade with multiple items', async function() {
			const res = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [testItem1._id, testItem2._id],
					items2: [testItem3._id, testItem4._id]
				});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
			expect(res.body.items1).to.have.length(2);
			expect(res.body.items2).to.have.length(2);
		});
	});

	describe('GET /trades/:userId', function() {
		it('should get trades by user1 ID', async function() {
			const res = await request(baseURL)
				.get(`/trades/${testUser1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be.greaterThan(0);

			res.body.forEach(trade => {
				expect(trade).to.have.property('_id');
				expect(trade).to.have.property('user1');
				expect(trade).to.have.property('user2');
				expect(trade).to.have.property('items1');
				expect(trade).to.have.property('items2');
				expect(trade).to.have.property('status');
				expect(trade.user1._id).to.equal(testUser1._id);
			});
		});

		it('should return empty array for user with no trades', async function() {
			const res = await request(baseURL)
				.get(`/trades/${testUser3._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});

		it('should handle invalid user ID', async function() {
			const res = await request(baseURL)
				.get('/trades/111111111111111111111111');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});
	});

	describe('GET /trades/user2/:id', function() {
		it('should get trades by user ID (user1 or user2)', async function() {
			const res = await request(baseURL)
				.get(`/trades/user2/${testUser1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be.greaterThan(0);

			res.body.forEach(trade => {
				expect(trade).to.have.property('_id');
				expect(trade).to.have.property('user1');
				expect(trade).to.have.property('user2');
				expect(trade).to.have.property('items1');
				expect(trade).to.have.property('items2');
				expect(trade).to.have.property('status');

				const user1Id = trade.user1._id;
				const user2Id = trade.user2._id;
				expect(
					user1Id === testUser1._id || user2Id === testUser1._id
				).to.be.true;
			});
		});

		it('should return empty array for user with no trades', async function() {
			const res = await request(baseURL)
				.get(`/trades/user2/${testUser3._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});
	});

	describe('PATCH /trades/:tradeId', function() {
		it('should update trade status to accepted', async function() {
			const res = await request(baseURL)
				.patch(`/trades/${testTradeId}`)
				.send({ status: 'accepted' });

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('_id');
			expect(res.body.status).to.equal('accepted');
			expect(res.body).to.have.property('tradeConfirmation');
			expect(res.body.tradeConfirmation.user1Confirmation).to.be.false;
			expect(res.body.tradeConfirmation.user2Confirmation).to.be.false;
		});

		it('should update trade status to rejected', async function() {
			const res = await request(baseURL)
				.patch(`/trades/${testTradeId}`)
				.send({ status: 'rejected' });

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('_id');
			expect(res.body.status).to.equal('rejected');
		});

		it('should fail to update with invalid status', async function() {
			const res = await request(baseURL)
				.patch(`/trades/${testTradeId}`)
				.send({ status: 'invalid_status' });

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.include('Invalid status');
		});

		it('should fail to update non-existent trade', async function() {
			const res = await request(baseURL)
				.patch('/trades/111111111111111111111111')
				.send({ status: 'accepted' });

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Trade not found.');
		});
	});

	describe('GET /trades/one/:tradeId', function() {
		it('should get trade by ID', async function() {
			const res = await request(baseURL)
				.get(`/trades/one/${testTradeId}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('_id');
			expect(res.body._id).to.equal(testTradeId);
			expect(res.body).to.have.property('user1');
			expect(res.body).to.have.property('user2');
			expect(res.body).to.have.property('items1');
			expect(res.body).to.have.property('items2');
			expect(res.body).to.have.property('status');
		});

		it('should fail to get non-existent trade', async function() {
			const res = await request(baseURL)
				.get('/trades/one/111111111111111111111111');

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Trade not found.');
		});
	});

	describe('GET /trades/:id1/:id2', function() {
		it('should get trades between two users', async function() {
			const res = await request(baseURL)
				.get(`/trades/${testUser1._id}/${testUser2._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be.greaterThan(0);

			res.body.forEach(trade => {
				expect(trade).to.have.property('_id');
				expect(trade).to.have.property('user1');
				expect(trade).to.have.property('user2');

				const user1Id = trade.user1._id;
				const user2Id = trade.user2._id;
				expect(
					(user1Id === testUser1._id && user2Id === testUser2._id) ||
					(user1Id === testUser2._id && user2Id === testUser1._id)
				).to.be.true;
			});
		});

		it('should return empty array for users with no trades', async function() {
			const res = await request(baseURL)
				.get(`/trades/${testUser1._id}/${testUser3._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});
	});

	describe('GET /trades', function() {
		it('should get all pending trades', async function() {
			const res = await request(baseURL)
				.get('/trades');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');

			res.body.forEach(trade => {
				expect(trade).to.have.property('_id');
				expect(trade).to.have.property('status');
				expect(trade.status).to.equal('pending');
			});
		});
	});

	describe('PATCH /trades/:tradeId/confirmation', function() {
		before(async function() {
			await request(baseURL)
				.patch(`/trades/${testTradeId}`)
				.send({ status: 'accepted' });
		});

		it('should update user1 confirmation status', async function() {
			const res = await request(baseURL)
				.patch(`/trades/${testTradeId}/confirmation`)
				.send({
					userId: testUser1._id,
					updatedUserConfirmation: true
				});

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('_id');
			expect(res.body).to.have.property('tradeConfirmation');
			expect(res.body.tradeConfirmation.user1Confirmation).to.be.true;
			expect(res.body.tradeConfirmation.user2Confirmation).to.be.false;
		});

		it('should update user2 confirmation status', async function() {
			const res = await request(baseURL)
				.patch(`/trades/${testTradeId}/confirmation`)
				.send({
					userId: testUser2._id,
					updatedUserConfirmation: true
				});

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('_id');
			expect(res.body).to.have.property('tradeConfirmation');
			expect(res.body.tradeConfirmation.user1Confirmation).to.be.true;
			expect(res.body.tradeConfirmation.user2Confirmation).to.be.true;
		});

		it('should fail to update confirmation for non-existent trade', async function() {
			const res = await request(baseURL)
				.patch('/trades/111111111111111111111111/confirmation')
				.send({
					userId: testUser1._id,
					updatedUserConfirmation: true
				});

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Trade not found.');
		});

		it('should fail to update confirmation for non-accepted trade', async function() {
			const newTradeRes = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [testItem2._id],
					items2: [testItem4._id]
				});

			const res = await request(baseURL)
				.patch(`/trades/${newTradeRes.body._id}/confirmation`)
				.send({
					userId: testUser1._id,
					updatedUserConfirmation: true
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Trades current status must be accepted.');
		});

		it('should fail to update confirmation for user not in trade', async function() {
			const res = await request(baseURL)
				.patch(`/trades/${testTradeId}/confirmation`)
				.send({
					userId: testUser3._id,
					updatedUserConfirmation: true
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('User is not associated with this trade.');
		});
	});

	describe('PATCH /trades/execute', function() {
		before(async function() {
			await request(baseURL)
				.patch(`/trades/${testTradeId}/confirmation`)
				.send({
					userId: testUser1._id,
					updatedUserConfirmation: true
				});

			await request(baseURL)
				.patch(`/trades/${testTradeId}/confirmation`)
				.send({
					userId: testUser2._id,
					updatedUserConfirmation: true
				});
		});

		it('should execute trade successfully', async function() {
			const res = await request(baseURL)
				.patch('/trades/execute')
				.send({
					user1Id: testUser1._id,
					user2Id: testUser2._id,
					items1Id: [testItem1._id],
					items2Id: [testItem3._id],
					tradeId: testTradeId
				});

			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('message');
			expect(res.body.message).to.equal('Trade executed successfully.');
			expect(res.body).to.have.property('user1Inventory');
			expect(res.body).to.have.property('user2Inventory');
		});

		it('should fail to execute trade with missing user1Id', async function() {
			const res = await request(baseURL)
				.patch('/trades/execute')
				.send({
					user2Id: testUser2._id,
					items1Id: [testItem1._id],
					items2Id: [testItem3._id],
					tradeId: testTradeId
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Invalid request body');
		});

		it('should fail to execute non-existent trade', async function() {
			const res = await request(baseURL)
				.patch('/trades/execute')
				.send({
					user1Id: testUser1._id,
					user2Id: testUser2._id,
					items1Id: [testItem1._id],
					items2Id: [testItem3._id],
					tradeId: '111111111111111111111111'
				});

			expect(res.status).to.equal(404);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Trade not found.');
		});

		it('should fail to execute trade that is not accepted', async function() {
			const newTradeRes = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [testItem2._id],
					items2: [testItem4._id]
				});

			const res = await request(baseURL)
				.patch('/trades/execute')
				.send({
					user1Id: testUser1._id,
					user2Id: testUser2._id,
					items1Id: [testItem2._id],
					items2Id: [testItem4._id],
					tradeId: newTradeRes.body._id
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Trades current status must be accepted.');
		});

		it('should fail to execute trade without both confirmations', async function() {
			const newTradeRes = await request(baseURL)
				.post('/trades')
				.send({
					user1: testUser1._id,
					user2: testUser2._id,
					items1: [testItem2._id],
					items2: [testItem4._id]
				});

			await request(baseURL)
				.patch(`/trades/${newTradeRes.body._id}`)
				.send({ status: 'accepted' });

			const res = await request(baseURL)
				.patch('/trades/execute')
				.send({
					user1Id: testUser1._id,
					user2Id: testUser2._id,
					items1Id: [testItem2._id],
					items2Id: [testItem4._id],
					tradeId: newTradeRes.body._id
				});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error');
			expect(res.body.error).to.equal('Both users must confirm the trade swap.');
		});
	});

	describe('GET /trades/history/:itemId', function() {
		it('should get trade history for an item', async function() {
			const res = await request(baseURL)
				.get(`/trades/history/${testItem1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');

			res.body.forEach(trade => {
				expect(trade).to.have.property('_id');
				expect(trade).to.have.property('status');
				expect(trade.status).to.equal('successful');
				expect(
					trade.items1.some(item => item._id === testItem1._id) ||
					trade.items2.some(item => item._id === testItem1._id)
				).to.be.true;
			});
		});

		it('should return empty array for item with no trade history', async function() {
			const res = await request(baseURL)
				.get(`/trades/history/${testItem2._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});
	});

	describe('Trade status validation', function() {
		it('should accept all valid trade statuses', async function() {
			const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled', 'renegotiated', 'successful'];

			for (const status of validStatuses) {
				const tradeRes = await request(baseURL)
					.post('/trades')
					.send({
						user1: testUser1._id,
						user2: testUser2._id,
						items1: [testItem2._id],
						items2: [testItem4._id]
					});

				const res = await request(baseURL)
					.patch(`/trades/${tradeRes.body._id}`)
					.send({ status });

				expect(res.status).to.equal(200);
				expect(res.body.status).to.equal(status);
			}
		});
	});
});
