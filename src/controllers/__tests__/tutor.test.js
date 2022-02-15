const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');

const userIds = ['6203f2015b8b83c4b99a1ee2', '6203f29bd418ecc175b73989'];
const chatIds = ['620ba249fbfc2e688b4ac178'];
const usernames = ['emirsagit'];
const names = ['ahmed', 'ammar'];
const messages = ['hello', 'testing'];

describe('Tutors endpoints /tutors', () => {
  describe('PUT /:id/edit', () => {
    it('should update the profile name from emir to ahmed', (done) => {
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

    it('should NOT change the username', (done) => {
      request(app)
        .put(`/tutors/${userIds[0]}/edit`)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .send({ username: names[1] })
        .expect(200, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.be.a('string');
          expect(res.body.username).to.be.equal(usernames[0]);
          return done();
        });
    });
  });

  describe('GET /:id/chat', () => {
    it('should check for the messaging channels structure', (done) => {
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
    it('should check for the single chat structure', (done) => {
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
    it('should create a chatroom and send "hello"', (done) => {
      request(app)
        .post(`/tutors/${userIds[0]}/chat`)
        .set('Content-Type', 'application/json')
        .send({ content: messages[0], receiver: userIds[1] })
        .expect(201, (err) => {
          if (err) return done(err);
          return done();
        });
    });

    it('should check for the chatroom and the message creation', (done) => {
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

    it('should send the message "hello" to an existing channel', (done) => {
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
