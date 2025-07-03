import request from 'supertest';
import { expect } from 'chai';

describe('Category API Endpoints', function() {
	const baseURL = 'http://localhost:3001';
	const unique = Date.now();
	let testCategory = {
		name: 'TestCategory' + unique
	};

	it('should create a new category', async function() {
		const res = await request(baseURL)
			.post('/categories')
			.send(testCategory);
		expect(res.status).to.equal(201);
		expect(res.body).to.have.property('_id');
		expect(res.body).to.have.property('name', testCategory.name);
	});

	it('should fail to create category with missing name', async function() {
		const res = await request(baseURL)
			.post('/categories')
			.send({});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('error', 'Category name is required.');
	});

	it('should fail to create duplicate category', async function() {
		const res = await request(baseURL)
			.post('/categories')
			.send(testCategory);
		expect(res.status).to.equal(409);
		expect(res.body).to.have.property('error', 'Category already exists.');
	});

	it('should get all categories', async function() {
		const res = await request(baseURL)
			.get('/categories');
		expect(res.status).to.equal(200);
		expect(res.body).to.be.an('array');
		expect(res.body.length).to.be.greaterThan(0);
	});

	it('should return categories in alphabetical order', async function() {
		const unique2 = Date.now();
		const category1 = { name: 'ZebraCategory' + unique2 };
		const category2 = { name: 'AlphaCategory' + unique2 };

		await request(baseURL).post('/categories').send(category1);
		await request(baseURL).post('/categories').send(category2);

		const res = await request(baseURL)
			.get('/categories');
		expect(res.status).to.equal(200);

		const categoryNames = res.body.map(cat => cat.name);
		const sortedNames = [...categoryNames].sort();
		expect(categoryNames).to.deep.equal(sortedNames);
	});

	it('should handle empty categories list', async function() {
		const res = await request(baseURL)
			.get('/categories');
		expect(res.status).to.equal(200);
		expect(res.body).to.be.an('array');
	});
});
