/* eslint-disable no-undef */
const request = require('supertest');
const chai = require('chai').expect;

const { app } = require('../../app');
const { server } = require('../../app');

const QuestionModel = require('../../models/question');
const StudentModel = require('../../models/student');

const loggeStudentId = '61fde3daa7f0f2fbd623b97a';

jest.mock('../../middleware/onlyAuthenticated', () =>
  jest.fn((req, res, next) => {
    req.user = { id: loggeStudentId };
    next();
  })
);
jest.mock('../../middleware/validateQuestion', () =>
  jest.fn((req, res, next) => {
    next();
  })
);
const questionId = [];
const commentId = [];

const question = [
  {
    title: 'new question',
    content: 'question content',
    subjects: [{ title: 'Math' }],
    isSolved: false,
    student: '61fde3daa7f0f2fbd623b97a',
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
    student: '61fde3daa7f0f2fbd623b97a',
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
        expect(res.body.title).toEqual(question[0].title);
        expect(res.body.content).toEqual(question[0].content);
        expect(res.body.student).toEqual(question[0].student);
        chai(res.body.subjects[0].title).to.deep.equal(
          question[0].subjects[0].title
        );
        expect(res.body.isSolved).toEqual(question[0].isSolved);
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
        expect(res.body.title).toEqual(question[1].title);
        expect(res.body.content).toEqual(question[1].content);
        expect(res.body.student).not.toEqual(question[1].student);
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
        expect(res.body.comments[0].content).toEqual(comment[0].content);
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
        expect(res.body.comments.length).toEqual(2);
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
        expect(res.body.comments[0].content).toEqual(comment[1].content);
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
        expect(res.body._id).toEqual(questionId[0]);
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
const mockQuestions = [
  {
    _id: '61ade3daa7f0f2fbd623b97a',
    title: 'Mathematics Question',
    content: 'algebra question content',
    isSolved: false,
    comments: [],
    subjects: { title: 'Math' },
    student: '61fde3daa7f0f2fbd623b97a',
  },
  {
    _id: '61bde3daa7f0f2fbd623b97a',
    title: 'Math Question',
    content: 'Math question content',
    isSolved: false,
    comments: [],
    subjects: { title: 'Math' },
    student: '61fde3daa7f0f2fbd623b97b',
  },
  {
    _id: '61cde3daa7f0f2fbd623b97a',
    title: 'Programming Question',
    content: 'Programming content',
    isSolved: false,
    comments: [],
    subjects: { title: 'Programming' },
    student: '61fde3daa7f0f2fbd623b97c',
  },
];
const missedTitleQuestion = {
  _id: '61dde3daa7f0f2fbd623b97a',
  content: 'Any content',
  isSolved: false,
  comments: [],
  subjects: { title: 'Programming' },
  student: '61fde3daa7f0f2fbd623b98e',
};
const mockError = new Error();
const mockUser = {
  _id: '61fde3daa7f0f2fbd623b97a',
  username: 'inas',
  firstName: 'inas',
  lastName: 'alarabi',
  passwordHash: 'jfkjmdshfkds',
  email: 'email@gmail.com',
  isTutor: true,
};

// 1. Test getAllQuestions function
describe('Get /questions', () => {
  test('should return all questions related to the logged user', async () => {
    mockUser.subjects = { title: 'Math' };
    StudentModel.findById = jest.fn().mockReturnValue(mockUser);
    QuestionModel.find = jest.fn().mockReturnValue(mockQuestions.slice(0, 2));
    await request(app)
      .get('/questions')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining(mockQuestions.slice(0, 2))
        );
      });
    expect(StudentModel.findById).toHaveBeenCalledTimes(1);
    expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  });
  test('should return all the questions if the logeed user has no subjects', async () => {
    StudentModel.findById = jest.fn().mockReturnValue(mockUser);
    QuestionModel.find = jest.fn().mockReturnValue(mockQuestions);
    await request(app)
      .get('/questions')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(mockQuestions));
        expect(res.body.length).toEqual(3);
      });
    expect(StudentModel.findById).toHaveBeenCalledTimes(1);
    expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  });
  test('should return all questions does exist in the database when no logged in user', async () => {
    QuestionModel.find = jest.fn().mockReturnValue(mockQuestions);
    await request(app)
      .get('/questions')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(mockQuestions));
        expect(res.body.length).toEqual(3);
      });
    expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  });
  test('should return message if no questions found in the database', async () => {
    QuestionModel.find = jest.fn().mockReturnValue([]);
    await request(app)
      .get('/questions')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('No questions found');
      });
    expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  });
});

// 2. Test getOneQuestions function
describe('Get /questions/:id', () => {
  it('should return single question defined by its id', async () => {
    QuestionModel.findById = jest.fn().mockReturnValue(mockQuestions[0]);
    await request(app)
      .get('/questions/id')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(mockQuestions[0]));
      });
    expect(QuestionModel.findById).toHaveBeenCalledTimes(1);
  });
  it('should return message when no question found in the database', async () => {
    QuestionModel.findById = jest.fn().mockReturnValue(null);
    await request(app)
      .get('/questions/id')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual(
          'The question you are looking for not found'
        );
      });
    expect(QuestionModel.findById).toHaveBeenCalledTimes(1);
  });
});

// 3. Test addNewQuestion function
describe('Post /questions', () => {
  it('should create new question and assign it to the current user', async () => {
    const { title, content, subjects } = mockQuestions[0];
    QuestionModel.create = jest.fn().mockReturnValue(mockQuestions[0]);
    await request(app)
      .post('/questions')
      .set('Content-Type', 'application/json')
      .send({ title, content, subjects })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(mockQuestions[0]));
        expect(res.body.student).toEqual(loggeStudentId);
      });
    expect(QuestionModel.create).toHaveBeenCalledTimes(1);
  });
  it('should throw an error in case of any error occured in database', async () => {
    QuestionModel.create = jest.fn().mockRejectedValue(mockError);
    await request(app)
      .post('/questions')
      .set('Content-Type', 'application/json')
      .send(mockQuestions[0])
      .expect(422)
      .expect((res) => {
        expect(res.body.message).toEqual(mockError.message);
      });
    expect(QuestionModel.create).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if any required data is missing', async () => {
    const missingDataError = new Error('Question Title is required');
    QuestionModel.create = jest.fn().mockRejectedValue(missingDataError);
    await request(app)
      .post('/questions')
      .set('Content-Type', 'application/json')
      .send(missedTitleQuestion)
      .expect(422)
      .expect((res) => {
        expect(res.body.message).toEqual(missingDataError.message);
      });
    expect(QuestionModel.create).toHaveBeenCalledTimes(1);
  });
});

// 4. Test getQuestiosWithSimilarTags function
describe('Get /questions/filter/:tags', () => {
  it('should return all question tagged with choosen subjects', async () => {
    QuestionModel.find = jest.fn().mockReturnValue(mockQuestions.slice(0, 2));
    await request(app)
      .get('/questions/filter/:tags')
      .set('Content-Type', 'application/json')
      .query({ tags: { title: 'Math' } })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining(mockQuestions.slice(0, 2))
        );
        expect(res.body.length).toEqual(2);
      });
    expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  });
  it('should throw an error with message if tags are missed', async () => {
    const tags = {};
    await request(app)
      .get('/questions/filter/:tags')
      .set('Content-Type', 'application/json')
      .query(tags)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Make sure you choose subjects');
      });
  });
});

// 5. Test searchForQuestions function
describe('Get /questions/search', () => {
  it(`should return all question that its title or content contain 'que' text`, async () => {
    QuestionModel.find = jest.fn().mockReturnValue(mockQuestions);
    await request(app)
      .get('/questions/search')
      .set('Content-Type', 'application/json')
      .query({ text: 'que' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(mockQuestions));
        expect(res.body.length).toEqual(3);
      });
    expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  });
  it('should throw an error with message if text is missed', async () => {
    await request(app)
      .get('/questions/search')
      .set('Content-Type', 'application/json')
      .query({})
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Make sure you type search text');
      });
  });
});
