const Question = require('../models/question');

async function saveQuestion(req) {
  let { question } = req;
  question.title = req.body?.title;
  question.content = req.body?.content;
  question.subjects = req.body?.subjects;
  question.isSolved = req.body?.isSolved;
  try {
    question.student = req.user?.id ?? null;
    question = await question.save();
    return question;
  } catch (e) {
    return { error: 'something went wrong' };
  }
}

module.exports = {
  getAllQuestions: async () => {},
  getOneQuestion: async () => {},
  addNewQuestion: async (req, res) => {
    try {
      req.question = new Question();
      const resp = await saveQuestion(req);
      res.json(resp);
    } catch (e) {
      res.status(401).json('something went wrong');
    }
  },
  updateQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      if (id && req.user && req.user.id === id) {
        req.question = await Question.findById(id);
        const resp = await saveQuestion(req);
        res.json(resp);
      }
    } catch (e) {
      res.status(401).json('something went wrong');
    }
  },
  deleteQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      if (id && req.user && req.user.id === id) {
        const resp = await Question.findByIdAndDelete(id);
        res.json(resp);
      }
    } catch (e) {
      res.status(401).json('something went wrong');
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
    } catch (e) {
      return res.status(401).json('something went wrong');
    }
  },
  updateComment: async (req, res) => {
    const { id, commentid } = req.params;
    const { content } = req.body;
    try {
      const question = await Question.findById(id);
      const comment = question.comments.find((c) => c.id === commentid);
      comment.content = content;
      const resp = await question.save();
      return res.json(resp);
    } catch (e) {
      return res.status(401).json('something went wrong');
    }
  },
  deleteComment: async (req, res) => {
    const { id, commentid } = req.params;
    try {
      const question = await Question.findById(id);
      const comment = question.comments.find((c) => c.id === commentid);
      const indexOfComment = question.comments.indexOf(comment);
      question.comments.splice(indexOfComment, 1);
      const resp = await question.save();
      return res.json(resp);
    } catch (e) {
      return res.status(401).json('something went wrong');
    }
  },
};
