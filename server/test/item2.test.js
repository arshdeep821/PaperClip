import request from 'supertest';
import { expect } from 'chai';

const baseURL = 'http://localhost:3001';

describe('Item API Endpoints', function() {
	let testUser;
	let testCategory;
	let testItemId;
	let testUser2;

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
				country: 'Test Country',
				lat: 49.2827,
				lon: -123.1207
			});
		testUser = userRes.body;

		const userRes2 = await request(baseURL)
			.post('/users')
			.send({
				username: 'itemuser2_' + unique,
				name: 'Item User 2',
				email: 'itemuser2_' + unique + '@example.com',
				password: 'password123',
				city: 'Test City',
				country: 'Test Country',
				lat: 49.2827,
				lon: -123.1207
			});
		testUser2 = userRes2.body;

		const catRes = await request(baseURL)
			.post('/categories')
			.send({
				name: 'Test Category ' + unique,
				description: 'A test category'
			});
		testCategory = catRes.body;
	});

	it('should create a new item', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('description', 'A test item for testing')
			.field('category', testCategory._id)
			.field('owner', testUser._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(201);
		expect(res.body).to.have.property('_id');
		expect(res.body.name).to.equal('Test Item');
		expect(res.body.description).to.equal('A test item for testing');
		expect(res.body.condition).to.equal('New');
		expect(res.body).to.have.property('imagePath');
		expect(res.body.category).to.have.property('_id');
		expect(res.body.category._id).to.equal(testCategory._id);

		testItemId = res.body._id;
	});

	it('should fail to create item with missing name', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('description', 'A test item')
			.field('category', testCategory._id)
			.field('owner', testUser._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error');
		expect(res.body.error).to.include('name, description, category, owner and condition are required');
	});

	it('should fail to create item with missing description', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('category', testCategory._id)
			.field('owner', testUser._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error');
		expect(res.body.error).to.include('name, description, category, owner and condition are required');
	});

	it('should fail to create item with missing category', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('description', 'A test item')
			.field('owner', testUser._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error');
		expect(res.body.error).to.include('name, description, category, owner and condition are required');
	});

	it('should fail to create item with missing owner', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('description', 'A test item')
			.field('category', testCategory._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error');
		expect(res.body.error).to.include('name, description, category, owner and condition are required');
	});

	it('should fail to create item with missing condition', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('description', 'A test item')
			.field('category', testCategory._id)
			.field('owner', testUser._id)
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error');
		expect(res.body.error).to.include('name, description, category, owner and condition are required');
	});

	it('should fail to create item with missing image', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('description', 'A test item')
			.field('category', testCategory._id)
			.field('owner', testUser._id)
			.field('condition', 'New');

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error', 'Image file is required.');
	});

	it('should fail to create item with invalid category', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('description', 'A test item')
			.field('category', '111111111111111111111111')
			.field('owner', testUser._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(404);
		expect(res.body).to.have.property('error', 'Category not found.');
	});

	it('should fail to create item with invalid owner', async function() {
		const res = await request(baseURL)
			.post('/items')
			.field('name', 'Test Item')
			.field('description', 'A test item')
			.field('category', testCategory._id)
			.field('owner', '111111111111111111111111')
			.field('condition', 'New')
			.attach('image', Buffer.from('fake image data'), 'test.jpg');

		expect(res.status).to.equal(404);
		expect(res.body).to.have.property('error', 'Owner (User) not found.');
	});

	it('should get all products', async function() {
		const res = await request(baseURL)
			.get('/items');

		expect(res.status).to.equal(200);
		expect(res.body).to.be.an('array');
		expect(res.body.length).to.be.greaterThan(0);
	});

	it('should get products excluding user', async function() {
		const res = await request(baseURL)
			.get(`/items/${testUser._id}`);

		expect(res.status).to.equal(200);
		expect(res.body).to.be.an('array');
		const userItems = res.body.filter(item => item.owner._id === testUser._id);
		expect(userItems).to.have.length(0);
	});

	it('should fail to get products with missing user ID', async function() {
		const res = await request(baseURL)
			.get('/items/');

		expect(res.status).to.equal(404);
	});

	it('should update item successfully', async function() {
		const updateData = {
			name: 'Updated Test Item',
			description: 'Updated description',
			condition: 'Used'
		};

		const res = await request(baseURL)
			.patch(`/items/${testItemId}`)
			.field('name', updateData.name)
			.field('description', updateData.description)
			.field('condition', updateData.condition);

		expect(res.status).to.equal(200);
		expect(res.body.name).to.equal(updateData.name);
		expect(res.body.description).to.equal(updateData.description);
		expect(res.body.condition).to.equal(updateData.condition);
	});

	it('should update item with new image', async function() {
		const res = await request(baseURL)
			.patch(`/items/${testItemId}`)
			.field('name', 'Item with New Image')
			.attach('image', Buffer.from('new fake image data'), 'newtest.jpg');

		expect(res.status).to.equal(200);
		expect(res.body.name).to.equal('Item with New Image');
		expect(res.body).to.have.property('imagePath');
	});

	it('should fail to update non-existent item', async function() {
		const res = await request(baseURL)
			.patch('/items/111111111111111111111111')
			.field('name', 'Updated Name');

		expect(res.status).to.equal(404);
		expect(res.body).to.have.property('error', 'Item not found.');
	});

	it('should fail to update item with invalid category', async function() {
		const res = await request(baseURL)
			.patch(`/items/${testItemId}`)
			.field('category', '111111111111111111111111');

		expect(res.status).to.equal(404);
		expect(res.body).to.have.property('error', 'Category not found.');
	});

	it('should delete item successfully', async function() {
		const res = await request(baseURL)
			.delete(`/items/${testItemId}`);

		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('message', 'Item deleted successfully.');
	});

	it('should fail to delete non-existent item', async function() {
		const res = await request(baseURL)
			.delete('/items/111111111111111111111111');

		expect(res.status).to.equal(404);
		expect(res.body).to.have.property('error', 'Item not found.');
	});

	it('should fail to delete item with invalid ID format', async function() {
		const res = await request(baseURL)
			.delete('/items/invalidid123');

		expect(res.status).to.equal(500);
	});

	it('should search products successfully', async function() {
		const searchItemRes = await request(baseURL)
			.post('/items')
			.field('name', 'Searchable Item')
			.field('description', 'This item can be searched')
			.field('category', testCategory._id)
			.field('owner', testUser2._id)
			.field('condition', 'New')
			.attach('image', Buffer.from('searchable image data'), 'searchable.jpg');

		const searchItemId = searchItemRes.body._id;

		const res = await request(baseURL)
			.get(`/items/search/${testUser._id}?query=Searchable`);

		expect(res.status).to.equal(200);
		expect(res.body).to.be.an('array');

		await request(baseURL).delete(`/items/${searchItemId}`);
	});

	it('should fail to search products with missing query', async function() {
		const res = await request(baseURL)
			.get(`/items/search/${testUser._id}`);

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error', 'Search query is required.');
	});

	it('should fail to search products with empty query', async function() {
		const res = await request(baseURL)
			.get(`/items/search/${testUser._id}?query=`);

		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error', 'Search query is required.');
	});
});
