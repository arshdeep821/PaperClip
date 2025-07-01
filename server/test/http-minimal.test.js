import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp.default ? chaiHttp.default : chaiHttp);

describe('HTTP minimal', () => {
	it('should GET /users (or any endpoint)', async () => {
		const res = await chai.request('http://localhost:3001').get('/users');
		chai.expect(res).to.have.status(200);
	});
});
