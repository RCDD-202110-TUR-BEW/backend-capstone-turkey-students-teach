/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const app = require('../../app');
const QuestionModel = require('../../models/question');
const StudentModel = require('../../models/student');

const loggeStudentId = '61fde3daa7f0f2fbd623b97a';
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

jest.mock('../../middleware/onlyAuthenticated', () =>
  jest.fn((req, res, next) => {
    req.user = { id: loggeStudentId };
    next();
  })
);

// 1. Test getAllQuestions function
describe('Get /questions', () => {
  it('should return all questions related to the logged user', async () => {
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
  it('should return all the questions if the logeed user has no subjects', async () => {
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
  it('should return all questions does exist in the database when no logged in user', async () => {
    QuestionModel.find = jest.fn().mockReturnValue(mockQuestions);
    await request(app)
      .get('/questions')
      .set('Content-Type', 'application/json')
      // .set('Cookies', '12345667ghgfhythjyj')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(mockQuestions));
        expect(res.body.length).toEqual(3);
      });
    expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  });
  it('should return message if no questions found in the database', async () => {
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
    QuestionModel.findById = jest.fn().mockReturnValue([]);
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
