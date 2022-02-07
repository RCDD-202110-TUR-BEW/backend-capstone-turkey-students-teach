const Question = require('../models/question');

//  errors messages
const authorizationError = { message: 'you dont have this authorization' };
const randomError = { message: 'something went wrong' };

async function saveQuestion(req, type = 'create') {
  let { question } = req;
  switch (type) {
    case 'create':
      question.title = req.body?.title;
      question.content = req.body?.content;
      question.subjects = req.body?.subjects;
      question.isSolved = req.body?.isSolved;
      question.student = req.user?.id;
      break;
    case 'update':
      question.title = req.body?.title ?? question.title;
      question.content = req.body?.content ?? question.content;
      question.subjects = req.body?.subjects ?? question.subjects;
      question.isSolved = req.body?.isSolved ?? question.isSolved;
      break;
    default:
      break;
  }
  try {
    question = await question.save();
    return question;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getAllQuestions: async () => {},
  getOneQuestion: async () => {},
  addNewQuestion: async (req, res) => {
    try {
      req.question = new Question();
      const resp = await saveQuestion(req);
      return res.json(resp);
    } catch (error) {
      return res.status(401).json(randomError);
    }
  },
  updateQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      const question = await Question.findById(id);
      if (id && req.user.id === question.student.toString()) {
        req.question = await Question.findById(id);
        const resp = await saveQuestion(req, 'update');
        return res.json(resp);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(401).json(error);
    }
  },
  deleteQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      const question = await Question.findById(id);
      if (id && req.user.id === question.student.toString()) {
        const resp = await Question.findByIdAndDelete(id);
        return res.json(resp);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(401).json(error);
    }
  },
  getQuestiosWithSimilarTags: async () => {},
  searchForQuestions: async () => {},
  addComment: async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      const question = await Question.findById(id);
      const newComment = {
        content,
        question: id,
        //  user should be signed in and authenticated
        creator: req?.user?.id ?? null,
        isRead: false,
      };
      question.comments.push(newComment);
      const resp = await question.save();
      return res.json(resp);
    } catch (error) {
      return res.status(401).json(randomError);
    }
  },
  updateComment: async (req, res) => {
    const { id, commentid } = req.params;
    const { content } = req.body;
    try {
      const question = await Question.findById(id);
      const comment = question.comments.find((c) => c.id === commentid);
      //  check authority for the user
      if (id && req.user.id === comment.creator.toString()) {
        comment.content = content;
        const resp = await question.save();
        return res.json(resp);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(401).json(error);
    }
  },
  deleteComment: async (req, res) => {
    const { id, commentid } = req.params;
    try {
      const question = await Question.findById(id);
      const comment = question.comments.find((c) => c.id === commentid);
      if (id && req.user.id === comment.creator.toString()) {
        const indexOfComment = question.comments.indexOf(comment);
        question.comments.splice(indexOfComment, 1);
        const resp = await question.save();
        return res.json(resp);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(401).json(error);
    }
  },
};
