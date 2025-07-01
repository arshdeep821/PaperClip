import chai from 'chai';
import chaiHttp from 'chai-http';

const expect = chai.expect;
chai.use(chaiHttp);

const baseURL = 'http://localhost:3001';

describe('User API Endpoints', function() {
	let testUser = {
		username: 'testuser_' + Date.now(),
		email: 'testuser_' + Date.now() + '@example.com',
		password: 'password123'
	};

	it('should create a new user', function(done) {
		chai.request(baseURL)
			.post('/users')
			.send(testUser)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('_id');
				expect(res.body.username).to.equal(testUser.username);
				expect(res.body.email).to.equal(testUser.email);
				done();
			});
	});

	it('should login the user', function(done) {
		chai.request(baseURL)
			.post('/users/login')
			.send({ email: testUser.email, password: testUser.password })
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('token');
				done();
			});
	});
});
