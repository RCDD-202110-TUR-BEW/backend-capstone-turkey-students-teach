/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');

const jwt = require('jsonwebtoken');
const app = require('../../app');

const { onlyAuthenticated } = require('../../middleware/onlyAuthenticated');

const question = [
  {
    title: 'new question',
    content: 'question content',
    subjects: ['math'],
    isSolved: false,
    student: '61fdde6a0699c9e26619b5a6',
  },
  {
    title: 'new question',
    content: 'question content',
    student: '61fdde6a0699c9e26619b5a6',
  },
  {
    title: 'new question',
  },
];

const comment = {
  content: 'new comment',
};
const studentId = '61fdde6a0699c9e26619b5a6';
const questionId = '61fde3daa7b0e2fbd623b975';
const commentId = '61fde3daa7b0e2fbd623b975';

describe('Creating new question', () => {
  it('PUT /question/:id should update the question and return the updated question in the response', (done) => {
    const spyOnVerify = jest.spyOn(jwt, 'verify');
    spyOnVerify.mockImplementation((a, b) => ({
      id: studentId,
    }));
    request(app)
      .put(`/questions/${questionId}`)
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
        expect(res.body.subjects).to.deep.equal(question[0].subjects);
        expect(res.body.isSolved).to.equal(question[0].isSolved);
        done();
      });
    spyOnVerify.mockRestore();
  });
});
