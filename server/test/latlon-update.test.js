import request from 'supertest';
import { expect } from 'chai';

describe('Lat/Lon Update Functionality', function() {
	const baseURL = 'http://localhost:3001';
	const unique = Date.now();
	let testUser = {
		username: 'testlatlon' + unique,
		name: 'Test LatLon',
		email: 'testlatlon' + unique + '@example.com',
		password: 'password123',
		city: 'Vancouver',
		country: 'Canada',
		lat: 49.2827,
		lon: -123.1207
	};
	let createdUserId;

	it('should create a new user with initial lat/lon', async function() {
		const res = await request(baseURL)
			.post('/users')
			.send(testUser);

		expect(res.status).to.equal(201);
		expect(res.body).to.have.property('_id');
		expect(res.body).to.have.property('lat', 49.2827);
		expect(res.body).to.have.property('lon', -123.1207);
		expect(res.body).to.have.property('city', 'Vancouver');
		expect(res.body).to.have.property('country', 'Canada');
		createdUserId = res.body._id;
	});

	it('should update user city and lat/lon successfully', async function() {
		const updateData = {
			city: 'Toronto',
			country: 'Canada',
			lat: 43.651,
			lon: -79.347
		};

		const res = await request(baseURL)
			.put(`/users/${createdUserId}`)
			.send(updateData);

		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('city', 'Toronto');
		expect(res.body).to.have.property('country', 'Canada');
		expect(res.body).to.have.property('lat', 43.651);
		expect(res.body).to.have.property('lon', -79.347);
		expect(res.body).to.have.property('username', testUser.username);
	});

	it('should update only lat/lon without changing other fields', async function() {
		const updateData = {
			lat: 45.5017,
			lon: -73.5673
		};

		const res = await request(baseURL)
			.put(`/users/${createdUserId}`)
			.send(updateData);

		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('city', 'Toronto');
		expect(res.body).to.have.property('country', 'Canada');
		expect(res.body).to.have.property('lat', 45.5017);
		expect(res.body).to.have.property('lon', -73.5673);
	});

		it('should handle zero lat/lon values', async function() {
		const updateData = {
			city: 'Unknown City',
			country: 'Unknown Country',
			lat: 0,
			lon: 0
		};

		const res = await request(baseURL)
			.put(`/users/${createdUserId}`)
			.send(updateData);

		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('city', 'Unknown City');
		expect(res.body).to.have.property('country', 'Unknown Country');
		expect(res.body).to.have.property('lat', 0);
		expect(res.body).to.have.property('lon', 0);
	});

		it('should update multiple fields including lat/lon', async function() {
		const updateData = {
			name: 'Updated Name',
			email: 'updated' + unique + '@example.com',
			city: 'Montreal',
			country: 'Canada',
			tradingRadius: 25,
			lat: 45.5017,
			lon: -73.5673
		};

		const res = await request(baseURL)
			.put(`/users/${createdUserId}`)
			.send(updateData);

		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('name', 'Updated Name');
		expect(res.body).to.have.property('email', 'updated' + unique + '@example.com');
		expect(res.body).to.have.property('city', 'Montreal');
		expect(res.body).to.have.property('country', 'Canada');
		expect(res.body).to.have.property('tradingRadius', 25);
		expect(res.body).to.have.property('lat', 45.5017);
		expect(res.body).to.have.property('lon', -73.5673);
	});

	it('should not update lat/lon when not provided', async function() {
		const updateData = {
			name: 'Name Without Coords',
			city: 'New City'
		};

		const res = await request(baseURL)
			.put(`/users/${createdUserId}`)
			.send(updateData);

		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('name', 'Name Without Coords');
		expect(res.body).to.have.property('city', 'New City');
		expect(res.body).to.have.property('lat', 45.5017);
		expect(res.body).to.have.property('lon', -73.5673);
	});
});
