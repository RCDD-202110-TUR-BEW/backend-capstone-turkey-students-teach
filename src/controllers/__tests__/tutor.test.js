const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');

/* eslint no-underscore-dangle: 0 */

describe('GET /tutors', () => {
  test('GET /tutors should get all users or return empty array if there is no users', (done) => {
    request(app)
      .get('/tutors')
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        res.body.forEach((element) => {
          expect(element.isTutor).to.equal(true);
        });
        return done();
      });
  });

  test('GET /tutors/:id should get user with id', (done) => {
    const id = '6203f29bd418ecc175b73989';
    request(app)
      .get(`/tutors/${id}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal(id);
        return done();
      });
  });

  test('GET /tutors/filter/:tagId should get users with tag equal to tagId', (done) => {
    const id = '6203f29bd418ecc175b7398a';
    request(app)
      .get(`/tutors/filter/${id}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.not.equal(0);
        res.body.forEach((element) => {
          expect(
            element.subjects.filter((e) => e._id === id).length
          ).to.greaterThanOrEqual(1);
        });
        return done();
      });
  });

  test('GET /tutors/search should get users with given firstName ', (done) => {
    const name = 'emir';
    request(app)
      .get(`/tutors/search?tutorName=${name}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.not.equal(0);
        res.body.forEach((element) => {
          expect(element.firstName).to.equal(name);
        });
        return done();
      });
  });

  test('GET /tutors/search should get users with given lastName ', (done) => {
    const name = 'sagit';
    request(app)
      .get(`/tutors/search?tutorName=${name}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.not.equal(0);
        res.body.forEach((element) => {
          expect(element.lastName).to.equal(name);
        });
        return done();
      });
  });

  test('GET /tutors/search should get users with given fullName ', (done) => {
    const name = 'emir sagit';
    request(app)
      .get(`/tutors/search?tutorName=${name}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.not.equal(0);
        res.body.forEach((element) => {
          expect(element.fullName).to.equal(name);
        });
        return done();
      });
  });
});
