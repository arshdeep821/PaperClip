import request from 'supertest';
import { expect } from 'chai';

const baseURL = 'http://localhost:3001';

describe('Messages API Endpoints', function() {
	let testUser1;
	let testUser2;
	let testUser3;
	let testMessageId;

	before(async function() {
		const unique = Date.now();

		const userRes1 = await request(baseURL)
			.post('/users')
			.send({
				username: 'messageuser1_' + unique,
				name: 'Message User 1',
				email: 'messageuser1_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 49.2827,
				lon: -123.1207
			});
		testUser1 = userRes1.body;

		const userRes2 = await request(baseURL)
			.post('/users')
			.send({
				username: 'messageuser2_' + unique,
				name: 'Message User 2',
				email: 'messageuser2_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 49.2827,
				lon: -123.1207
			});
		testUser2 = userRes2.body;

		const userRes3 = await request(baseURL)
			.post('/users')
			.send({
				username: 'messageuser3_' + unique,
				name: 'Message User 3',
				email: 'messageuser3_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 49.2827,
				lon: -123.1207
			});
		testUser3 = userRes3.body;
	});

	describe('POST /messages', function() {
		it('should create a new message', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send({
					from: testUser1._id,
					to: testUser2._id,
					message: 'Hello, this is a test message!'
				});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
			expect(res.body.from).to.equal(testUser1._id);
			expect(res.body.to).to.equal(testUser2._id);
			expect(res.body.message).to.equal('Hello, this is a test message!');
			expect(res.body).to.have.property('timestamp');

			testMessageId = res.body._id;
		});

		it('should fail to create message with missing from field', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send({
					to: testUser2._id,
					message: 'Hello, this is a test message!'
				});

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error');
		});

		it('should fail to create message with missing to field', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send({
					from: testUser1._id,
					message: 'Hello, this is a test message!'
				});

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error');
		});

		it('should fail to create message with missing message field', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send({
					from: testUser1._id,
					to: testUser2._id
				});

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error');
		});

		it('should create message with invalid from user ID (no validation)', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send({
					from: '111111111111111111111111',
					to: testUser2._id,
					message: 'Hello, this is a test message!'
				});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
			expect(res.body.from).to.equal('111111111111111111111111');
		});

		it('should create message with invalid to user ID (no validation)', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send({
					from: testUser1._id,
					to: '111111111111111111111111',
					message: 'Hello, this is a test message!'
				});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('_id');
			expect(res.body.to).to.equal('111111111111111111111111');
		});

		it('should create multiple messages between users', async function() {
			const messages = [
				{
					from: testUser2._id,
					to: testUser1._id,
					message: 'Hi there! How are you?'
				},
				{
					from: testUser1._id,
					to: testUser2._id,
					message: 'I am doing well, thank you!'
				},
				{
					from: testUser1._id,
					to: testUser3._id,
					message: 'Hello User 3!'
				},
				{
					from: testUser3._id,
					to: testUser1._id,
					message: 'Hello User 1! Nice to meet you!'
				}
			];

			for (const msg of messages) {
				const res = await request(baseURL)
					.post('/messages')
					.send(msg);

				expect(res.status).to.equal(201);
				expect(res.body).to.have.property('_id');
				expect(res.body.from).to.equal(msg.from);
				expect(res.body.to).to.equal(msg.to);
				expect(res.body.message).to.equal(msg.message);
			}
		});
	});

	describe('GET /messages/:user1/:user2', function() {
		it('should get messages between two users', async function() {
			const res = await request(baseURL)
				.get(`/messages/${testUser1._id}/${testUser2._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be.greaterThan(0);

			res.body.forEach(message => {
				expect(message).to.have.property('_id');
				expect(message).to.have.property('from');
				expect(message).to.have.property('to');
				expect(message).to.have.property('message');
				expect(message).to.have.property('timestamp');

				const fromId = message.from.toString();
				const toId = message.to.toString();
				const user1Id = testUser1._id.toString();
				const user2Id = testUser2._id.toString();

				expect(
					(fromId === user1Id && toId === user2Id) ||
					(fromId === user2Id && toId === user1Id)
				).to.be.true;
			});
		});

		it('should get messages in chronological order', async function() {
			const res = await request(baseURL)
				.get(`/messages/${testUser1._id}/${testUser2._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');

			for (let i = 1; i < res.body.length; i++) {
				const prevTimestamp = new Date(res.body[i - 1].timestamp);
				const currTimestamp = new Date(res.body[i].timestamp);
				expect(prevTimestamp.getTime()).to.be.at.most(currTimestamp.getTime());
			}
		});

		it('should return empty array for users with no messages', async function() {
			const res = await request(baseURL)
				.get(`/messages/${testUser2._id}/${testUser3._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});

		it('should work with reversed user order', async function() {
			const res1 = await request(baseURL)
				.get(`/messages/${testUser1._id}/${testUser2._id}`);

			const res2 = await request(baseURL)
				.get(`/messages/${testUser2._id}/${testUser1._id}`);

			expect(res1.status).to.equal(200);
			expect(res2.status).to.equal(200);
			expect(res1.body).to.deep.equal(res2.body);
		});

		it('should handle invalid user IDs gracefully', async function() {
			const res = await request(baseURL)
				.get('/messages/111111111111111111111111/222222222222222222222222');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});
	});

	describe('GET /messages/conversations/:userId', function() {
		it('should get conversations for a user', async function() {
			const res = await request(baseURL)
				.get(`/messages/conversations/${testUser1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be.greaterThan(0);

			res.body.forEach(conversation => {
				expect(conversation).to.have.property('otherUser');
				expect(conversation.otherUser).to.have.property('_id');
				expect(conversation.otherUser).to.have.property('username');
				expect(conversation).to.have.property('lastMessage');
				expect(conversation.lastMessage).to.have.property('_id');
				expect(conversation.lastMessage).to.have.property('message');
				expect(conversation.lastMessage).to.have.property('timestamp');
			});
		});

		it('should not include self-conversations', async function() {
			const res = await request(baseURL)
				.get(`/messages/conversations/${testUser1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');

			res.body.forEach(conversation => {
				expect(conversation.otherUser._id).to.not.equal(testUser1._id);
			});
		});

		it('should return only the latest message per conversation', async function() {
			const res = await request(baseURL)
				.get(`/messages/conversations/${testUser1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');

			const conversationMap = new Map();
			res.body.forEach(conversation => {
				const otherUserId = conversation.otherUser._id;
				if (conversationMap.has(otherUserId)) {
					throw new Error(`Duplicate conversation found for user ${otherUserId}`);
				}
				conversationMap.set(otherUserId, conversation);
			});
		});

		it('should return empty array for user with no conversations', async function() {
			const unique = Date.now();
			const newUserRes = await request(baseURL)
				.post('/users')
				.send({
					username: 'newuser_' + unique,
					name: 'New User',
					email: 'newuser_' + unique + '@example.com',
					password: 'password123',
					city: 'Test City',
					country: 'Test Country',
					lat: 49.2827,
					lon: -123.1207
				});

			const res = await request(baseURL)
				.get(`/messages/conversations/${newUserRes.body._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.equal(0);
		});

		it('should handle invalid user ID gracefully', async function() {
			const res = await request(baseURL)
				.get('/messages/conversations/111111111111111111111111');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be.at.least(0);
		});

		it('should include conversations where user is sender or receiver', async function() {
			const res = await request(baseURL)
				.get(`/messages/conversations/${testUser1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');

			const otherUserIds = res.body.map(conv => conv.otherUser._id);
			expect(otherUserIds).to.include(testUser2._id);
			expect(otherUserIds).to.include(testUser3._id);
		});
	});

	describe('Message ordering and timestamps', function() {
		it('should create messages with proper timestamps', async function() {
			const beforeTime = new Date();

			const res = await request(baseURL)
				.post('/messages')
				.send({
					from: testUser1._id,
					to: testUser2._id,
					message: 'Timestamp test message'
				});

			const afterTime = new Date();

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('timestamp');

			const messageTime = new Date(res.body.timestamp);
			expect(messageTime.getTime()).to.be.at.least(beforeTime.getTime());
			expect(messageTime.getTime()).to.be.at.most(afterTime.getTime());
		});

		it('should sort conversations by latest message timestamp', async function() {
			const res = await request(baseURL)
				.get(`/messages/conversations/${testUser1._id}`);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array');

			for (let i = 1; i < res.body.length; i++) {
				const prevTimestamp = new Date(res.body[i - 1].lastMessage.timestamp);
				const currTimestamp = new Date(res.body[i].lastMessage.timestamp);
				expect(prevTimestamp.getTime()).to.be.at.least(currTimestamp.getTime());
			}
		});
	});

	describe('Error handling', function() {
		it('should handle malformed request body', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send('invalid json');

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error');
		});

		it('should handle empty request body', async function() {
			const res = await request(baseURL)
				.post('/messages')
				.send({});

			expect(res.status).to.equal(500);
			expect(res.body).to.have.property('error');
		});
	});
});
