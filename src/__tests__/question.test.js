/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');

const { app } = require('../app');
const { server } = require('../app');

const studentId = '61fdde6a0699c9e26619b5a6';
const questionId = [];
const commentId = [];

jest.mock('../middleware/onlyAuthenticated', () =>
  jest.fn((req, res, next) => {
    req.user = { id: studentId };
    next();
  })
);

const question = [
  {
    title: 'new question',
    content: 'question content',
    subjects: [{ title: 'Math' }],
    isSolved: false,
    student: '61fdde6a0699c9e26619b5a6',
  },
  {
    title: 'new question',
    content: 'question content',
    student: 'z1fdde6a0699c9e26610c5ac',
  },
  {
    title: 'should not be updated',
    content: 'should not be updated',
    subjects: [{ title: 'Math' }],
    isSolved: false,
    student: '61fdde6a0699c9e26619b5a6',
  },
];

const comment = [
  {
    content: 'new comment',
  },
  {
    content: 'updated comment',
  },
];
async function initializeDatabase() {
  const agentUser1 = request.agent(app);
  const res = await agentUser1
    .post('/questions')
    .type('form')
    .send(question[0]);
  // eslint-disable-next-line no-underscore-dangle
  questionId.push(res.body._id);
  questionId.push(`${questionId[0].substring(0, questionId[0].length - 3)}asd`);
}

beforeAll(async () => {
  await initializeDatabase();
});

afterAll(() => {
  server.close();
});
describe('update a question', () => {
  test('PUT /question/:id should update the question and return the updated question in the response', (done) => {
    request(app)
      .put(`/questions/${questionId[0]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .send(question[0])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body.title).to.equal(question[0].title);
        expect(res.body.content).to.equal(question[0].content);
        expect(res.body.student).to.equal(question[0].student);
        expect(res.body.subjects[0].title).to.deep.equal(
          question[0].subjects[0].title
        );
        expect(res.body.isSolved).to.equal(question[0].isSolved);
        done();
      });
  });
  test('PUT /question/:id should update question with one or more attributes and should not update student reference', (done) => {
    request(app)
      .put(`/questions/${questionId[0]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .send(question[1])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body.title).to.equal(question[1].title);
        expect(res.body.content).to.equal(question[1].content);
        expect(res.body.student).not.to.equal(question[1].student);
        done();
      });
  });
  test('PUT /question/:id should not update question if there is no authorization', (done) => {
    request(app)
      .put(`/questions/${questionId[1]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .send(question[1])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(401, (err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('create a comment', () => {
  test('POST /:id/comments should create a new comment and return the question in the response', (done) => {
    request(app)
      .post(`/questions/${questionId[0]}/comments`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .send(comment[0])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body.comments[0].content).to.equal(comment[0].content);
        done();
      });
  });
  test('POST /:id/comments should create more than one comments on a question and return the question in the response', (done) => {
    request(app)
      .post(`/questions/${questionId[0]}/comments`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .send(comment[0])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body.comments.length).to.equal(2);
        // eslint-disable-next-line no-underscore-dangle
        commentId.push(res.body.comments[0]._id);
        commentId.push(
          `${commentId[0].substring(0, commentId[0].length - 3)}asd`
        );
        done();
      });
  });
});

describe('update a comment', () => {
  test('PUT /:id/comments/:commentid should update the comment and return the updated question in the response', (done) => {
    request(app)
      .put(`/questions/${questionId[0]}/comments/${commentId[0]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .send(comment[1])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.body.comments[0].content).to.equal(comment[1].content);
        done();
      });
  });
  test('PUT /:id/comments/:commentid should not update cooment if there is no authorization', (done) => {
    request(app)
      .put(`/questions/${questionId[0]}/comments/${commentId[1]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .send(comment[1])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(401, (err) => {
        if (err) return done(err);
        done();
      });
  });
});
describe('delete a comment', () => {
  test('DELETE /:id/comments/:commentid should delete the comment and return the updated question in the response', (done) => {
    request(app)
      .delete(`/questions/${questionId[0]}/comments/${commentId[0]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(200, (err) => {
        if (err) return done(err);
        done();
      });
  });
  test('DELETE /:id/comments/:commentid should not update cooment if there is no authorization', (done) => {
    request(app)
      .delete(`/questions/${questionId[0]}/comments/${commentId[1]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(401, (err) => {
        if (err) return done(err);
        done();
      });
  });
});
describe('delete a question', () => {
  test('DELETE /question/:id should delete the question and return the deleted question in the response', (done) => {
    request(app)
      .delete(`/questions/${questionId[0]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(200, (err, res) => {
        if (err) return done(err);
        // eslint-disable-next-line no-underscore-dangle
        expect(res.body._id).to.equal(questionId[0]);
        done();
      });
  });
  test('DELETE /question/:id should not DELETE question if there is no authorization', (done) => {
    request(app)
      .put(`/questions/${questionId[1]}`)
      .set('Content-Type', 'application/json')
      .set('Cookie', ['accessToken=12345667'])
      .expect('Content-Type', /json/)
      // eslint-disable-next-line consistent-return
      .expect(401, (err) => {
        if (err) return done(err);
        done();
      });
  });
});
