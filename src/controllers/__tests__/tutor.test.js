/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const { expect } = require('chai');
const { app, server } = require('../../app');

const userIds = ['6203f29bd418ecc175b73989', '62053f1e90c6987a613c1658'];
const chatIds = ['620ba249fbfc2e688b4ac178'];
const names = ['ahmed', 'ammar'];
const messages = ['hello', 'testing'];
const successMessage = 'Updated successfully';

afterAll(async () => {
  await server.close();
});

describe('Tutors endpoints /tutors', () => {
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
        // eslint-disable-next-line no-underscore-dangle
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
            // eslint-disable-next-line no-underscore-dangle
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
        res.body.forEach((element, index) => {
          if (index !== 0) {
            expect(element.fullName).to.equal(name);
          }
        });
        return done();
      });
  });

  describe('PUT /:id/edit', () => {
    test('should update the profile name from emir to ahmed', (done) => {
      request(app)
        .put(`/tutors/${userIds[0]}/edit`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .send({ firstName: names[0] })
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body.firstName).to.be.a('string');
          expect(res.body.firstName).to.be.equal(names[0]);
          return done();
        });
    });

    test('should NOT change the username', (done) => {
      request(app)
        .put(`/tutors/${userIds[0]}/edit`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .send({ username: names[1] })
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal(successMessage);
          return done();
        });
    });
  });

  describe('GET /:id/chat', () => {
    test('should check for the messaging channels structure', (done) => {
      request(app)
        .get(`/tutors/${userIds[0]}/chat`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          res.body.forEach((messagingChannel) => {
            expect(messagingChannel).to.be.an('object');
            expect(messagingChannel.contacts.length).to.be.equal(2);
            expect(messagingChannel.messages).to.be.an('array');
          });
          return done();
        });
    });
  });

  describe('GET /:id/chat/:chatId', () => {
    test('should check for the single chat structure', (done) => {
      request(app)
        .get(`/tutors/${userIds[0]}/chat/${chatIds[0]}`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body.contacts.length).to.be.equal(2);
          expect(res.body.messages).to.be.an('array');
          res.body.messages.forEach((message) => {
            expect(message).to.be.an('object');
            expect(message.content).to.be.a('string');
            expect(message.sender).to.be.a('string');
            expect(message.isRead).to.be.a('boolean');
          });
          return done();
        });
    });
  });

  describe('POST /:id/chat', () => {
    test('should create a chatroom and send "hello"', (done) => {
      request(app)
        .post(`/tutors/${userIds[0]}/chat`)
        .set('Content-Type', 'application/json')
        .send({ content: messages[0], receiver: userIds[1] })
        .expect(201, (err) => {
          if (err) return done(err);
          return done();
        });
    });

    test('should check for the chatroom and the message creation', (done) => {
      request(app)
        .get(`/tutors/${userIds[0]}/chat`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body.at(-1).messages).to.be.an('array');
          expect(res.body.at(-1).messages[0].content).to.be.a('string');
          expect(res.body.at(-1).messages[0].content).to.be.equal(messages[0]);
          return done();
        });
    });

    test('should send the message "hello" to an existing channel', (done) => {
      request(app)
        .post(`/tutors/${userIds[0]}/chat`)
        .set('Content-Type', 'application/json')
        .send({
          chatId: chatIds[0],
          content: messages[0],
        })
        .expect(201, (err, res) => {
          if (err) return done(err);
          expect(res.body.messages).to.be.an('array');
          expect(res.body.messages.at(-1).content).to.be.a('string');
          expect(res.body.messages.at(-1).content).to.be.equal(messages[0]);
          return done();
        });
    });
  });
});
