// Test the routing for the application
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../btapp');

const expect = chai.expect;
// Configure chai
chai.use(chaiHttp);
chai.should();

let token

describe('User API routing testing', () => {

    before((done) => {
        chai.request(app)
            .post('/auth/gettoken')
            .send({
                username: "dolemite",
                password: "dolemitexmas",
            })
            .end((err, response) => {
                token = response.body.token; // save the token!
                done();
            });
    });

    describe('Access user API via /GET requests', () => {
        it('Test: Should get an unauthorized response(401) if we do not send the token', (done) => {
            chai.request(app)
                .get('/api/user/list')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('TEST: Get all user records', (done) => {
            chai.request(app)
                .get('/api/user/list')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('TEST: GET one user by their id', (done) => {
            chai.request(app)
                .get('/api/user/5df24fe5a151d95809659a2e')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body).to.have.property('name', 'Commander Data');
                    done();
                });
        });

    });

    describe('Access user API via /POST requests', () => {
        it('TEST: Retrieve persons from database based on criteria', (done) => {
            let data = {"criteria" : {"address": "USS Enterprise"}};

            chai.request(app)
                .post('/api/user/catalog')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('TEST: Enroll person to the database ', (done) => {
            let data = {"id": "5deb33aee9567c7b7e77c8f8",
                        "name": "Lieutenant Hikara Sulu",
                        "dob": new Date(158034734833),
                        "address": "USS Enterprise",
                        "position": { "coordinates": [121.5874, 31.3481]},
                        "description": "Coolest helmsman anywhere"};

            chai.request(app)
                .post('/api/user/enroll')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('TEST: Find persons in a range ', (done) => {
            let data = {"position": {"coordinates": [121.5874, 31.3481]},
                        "distance": 5000};

            chai.request(app)
                .post('/api/user/radar')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('TEST: Find persons in a range from another person ', (done) => {
            let data = {"id": "5debb71eac1cb28342888aba",
                        "distance": 5000};

            chai.request(app)
                .post('/api/user/rangeid')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });


        it('TEST: Do Not update exiting user in the database with data alone', (done) => {
            let data = { 'criteria': {
                                      "name": "Lieutenant Hikara Sulu",
                                      "address": "USS Enterprise"
                                     },
                         'update': {"dob": new Date(-158034734833)}
                       };

            chai.request(app)
                .post('/api/user/update')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.errors.should.be.a('array').include("Must have an id to change user");
                    done();
                });
        });

        it('TEST: Do not update any user in database if criteria applies to more than one user', (done) => {
            let data = { 'criteria': { "_id" : { $in: ["5deb33aee9567c7b7e77c8f8", "5df24fe5a151d95809659a2e"] } },
                         'update': {"address": "USS Reliant"}
                       };

            chai.request(app)
                .post('/api/user/update')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.message.should.be.equal("Error: One and only one person can be updated at a time");
                    done();
                });
        });

        it('TEST: Update exiting user in the database by id', (done) => {
            let data = { 'criteria': {"id": "5deb33aee9567c7b7e77c8f8"},
                         'update': {"dob": new Date(-158034734833)}
                       };

            chai.request(app)
                .post('/api/user/update')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.dob.should.be.not.equal('1975-01-04T02:32:14.833Z');
                    done();
                });
        });


        it('TEST: Remove a user from the database', (done) => {
            let data = {"id": "5deb33aee9567c7b7e77c8f8"};

            chai.request(app)
                .post('/api/user/remove')
                .set('content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('string').that.include("has been deleted.");
                    done();
                });
        });

        after(() => {

            const udac = require('../controllers/dataAccessController');
            const data = {};

            udac.removePersonByCriteria(data)
                .then((result) => {
                    console.log(result.deletedCount + " records deleted");
                })
                .catch((err) => {
                    console.log('Error deleting people.' + err);
                    expect(err).is.defined
                });
        });

    });
});
