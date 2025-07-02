import request from 'supertest';
import { expect } from 'chai';

const baseURL = 'http://localhost:3001';

describe('Item API Endpoints', function() {
	let testUser;
	let testCategory;
	let testItemId;

	before(async function() {
		const unique = Date.now();
		const userRes = await request(baseURL)
			.post('/users')
			.send({
				username: 'itemuser_' + unique,
				name: 'Item User',
				email: 'itemuser_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country'
			});
		testUser = userRes.body;

		const catRes = await request(baseURL)
			.post('/categories')
			.send({
				name: 'Test Category ' + unique,
				description: 'A test category'
			});
		testCategory = catRes.body;
	});

	it('should create a new item', async function() {
		const itemData = {
			name: 'Test Item',
			description: 'A test item for testing',
			category: testCategory._id,
			owner: testUser._id,
			condition: 'New'
		};

		const res = await request(baseURL)
			.post('/items')
			.field('name', itemData.name)
			.field('description', itemData.description)
			.field('category', itemData.category)
			.field('owner', itemData.owner)
			.field('condition', itemData.condition)
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(201);
		expect(res.body).to.have.property('_id');
		expect(res.body.name).to.equal(itemData.name);
		expect(res.body.description).to.equal(itemData.description);
		expect(res.body.condition).to.equal(itemData.condition);
		expect(res.body).to.have.property('imagePath');
		expect(res.body.category).to.have.property('_id');
		expect(res.body.category._id).to.equal(testCategory._id);

		testItemId = res.body._id;
	});
});
