const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const QuestionModel = require('../../models/question');
// const StudentModel = require('../../models/student');

const mockQuestions = [
  {
    _id: mongoose.Types.ObjectId().toString(),
    title: 'Mathematics Question',
    content: 'algebra question content',
    isSolved: false,
    comments: [],
    subjects: { title: 'Math' },
    student: '61fde3daa7f0f2fbd623b97a',
  },
  {
    _id: mongoose.Types.ObjectId().toString(),
    title: 'Math Question',
    content: 'Math question content',
    isSolved: false,
    comments: [],
    subjects: { title: 'Math' },
    student: '61fde3daa7f0f2fbd623b97b',
  },
  {
    _id: mongoose.Types.ObjectId().toString(),
    title: 'Programming Question',
    content: 'Programming content',
    isSolved: false,
    comments: [],
    subjects: { title: 'Programming' },
    student: '61fde3daa7f0f2fbd623b97c',
  },
];
const missedTitleQuestion = {
  _id: mongoose.Types.ObjectId().toString(),
  content: 'Any content',
  isSolved: false,
  comments: [],
  subjects: { title: 'Programming' },
  student: '61fde3daa7f0f2fbd623b98e',
};
const mockError = new Error();

const user = {
  id: '61fde3daa7f0f2fbd623b97b',
  email: 'user@gmail.com',
  password: 'userpasswordI',
};
// 1. Test getAllQuestions function
describe('Get /questions', () => {
  // it('should return all questions does exist in the database and related to specific users', async () => {
  //   const subject = { title: 'Maht' };
  //   QuestionModel.find = jest.fn().mockReturnValue(mockQuestions[1]);
  //   StudentModel.findById = jest.fn().mockReturnValue(subject);
  //   await request(app)
  //     .get('/questions')
  //     .set('Content-Type', 'application/json')
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body).toEqual(expect.objectContaining(mockQuestions[1]));
  //     });
  //   expect(QuestionModel.find).toHaveBeenCalledTimes(1);
  // expect(StudentModel.findById).toHaveBeenCalledTimes(1);
  // });
  it('should return all questions does exist in the database when no logged in user', async () => {
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
  it('should return message when no questions found in the database', async () => {
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
  it('should create new question', async () => {
    QuestionModel.create = jest.fn().mockReturnValue(mockQuestions[0]);
    await request(app)
      .post('/questions')
      .set('Content-Type', 'application/json')
      .send(mockQuestions[0])
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(mockQuestions[0]));
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
