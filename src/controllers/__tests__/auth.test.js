/** mocked dependencies */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { StudentModel } = require('../../models/student');
const authController = require('../auth');
const { server } = require('../../app');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('google-auth-library');
jest.mock('../../models/student');
/** end mocked dependencies */

/** data */
const token = 'token';
const id = '6203f29bd418ecc175b73989';
const firstName = 'emir';
const lastName = 'sağıt';

const studentData = {
  id,
  firstName,
  lastName,
  password: 'Es412412',
  avatar: 'avatar_url',
  email: 'emirsagitt@gmail.com',
  isTutor: 'true',
  subjects: [{ title: 'Math' }],
  token,
};
const googlePayload = {
  email: 'emirsagitt@gmail.com',
  picture: 'url',
  given_name: 'emir',
  family_name: 'sağıt',
};
const hashedPassword = 'hashedPassword';
/** end data */

/** mocked functions */
const req = {
  body: studentData,
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest
  .spyOn(OAuth2Client.prototype, 'verifyIdToken')
  .mockResolvedValue({ getPayload: jest.fn().mockReturnValue(googlePayload) });

const client = new OAuth2Client();

StudentModel.findOne = jest.fn();
StudentModel.create = jest.fn().mockReturnValue(studentData);

bcrypt.compare = jest.fn();
bcrypt.hash = jest.fn().mockReturnValue(hashedPassword);

jwt.sign = jest.fn().mockReturnValue(token);
/** end mocked functions */

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  server.close();
});

describe('Sign in method', () => {
  test('should send token as json', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce(studentData);
    bcrypt.compare.mockReturnValueOnce(true);
    // end prapare mocks for testing
    await authController.signin(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      studentData.passwordHash
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { student: studentData },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token,
      firstName,
      lastName,
    });
  });

  test('should give an error if email does not exist on database', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce(undefined);
    // end prapare mocks for testing
    await authController.signin(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'wrong email or password' });
  });

  test('should give an error if given password is not correct', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce(studentData);
    bcrypt.compare.mockReturnValueOnce(false);
    // end prapare mocks for testing
    await authController.signin(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      studentData.passwordHash
    );
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'wrong email or password' });
  });

  test('should give an error if given student signed up via google before', async () => {
    StudentModel.findOne.mockReturnValueOnce({ isSignUpWithGoogle: true });
    // end prapare mocks for testing
    await authController.signin(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'This account is linked to Google. Please log in via Google',
    });
  });
});

describe('Signup method', () => {
  test('should send token as json', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce(false);
    jest
      .spyOn(StudentModel.prototype, 'save')
      .mockImplementationOnce(() => Promise.resolve(studentData));
    const studentInstance = new StudentModel();
    // end prapare mocks for testing
    await authController.signup(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(studentInstance.save).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith(
      { student: studentData },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token,
      firstName,
      lastName,
    });
  });
  test('should give an error if email existed', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce(studentData);
    // end prapare mocks for testing
    await authController.signup(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: `${req.body.email}: email already exist`,
    });
  });
});

describe('signInWithGmail method', () => {
  test('should send token as json', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce(false);
    // end prapare mocks for testing
    await authController.signInWithGmail(req, res);
    expect(client.verifyIdToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token,
      id,
      firstName,
      lastName,
    });
  });

  test('should give an error if existing user didnt not signup via google before', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce(studentData);
    // end prapare mocks for testing
    await authController.signInWithGmail(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'This account has linked with email signup. Please log in via using email and password',
    });
  });

  test('should signin if existing user signup via google before', async () => {
    // prapare mocks for testing
    StudentModel.findOne.mockReturnValueOnce({ isSignUpWithGoogle: true });
    // end prapare mocks for testing
    await authController.signInWithGmail(req, res);
    expect(StudentModel.findOne).toHaveBeenCalledWith({
      email: req.body.email,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token,
      id: undefined,
      firstName: undefined,
      lastName: undefined,
    });
  });

  test('should give an error if google token verifcation has failed', async () => {
    // prapare mocks for testing
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue({
      getPayload: jest.fn().mockReturnValueOnce(false),
    });
    // end prapare mocks for testing
    await authController.signInWithGmail(req, res);
    expect(StudentModel.findOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Can't verify with google sign up",
    });
  });
});

describe('Get student method', () => {
  test('should send auth student data', async () => {
    // prapare mocks for testing
    req.user = studentData;
    // end prapare mocks for testing
    authController.getStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(req.user);
  });
});
