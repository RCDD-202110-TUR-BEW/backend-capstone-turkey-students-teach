const Question = require('../models/question');
const Student = require('../models/student');

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
const filterQuestions = async (res, query) => {
  try {
    // Find and sort by latest
    const questions = await Question.find(query); // .sort({ createdAt: -1 });
    if (questions.length <= 0) {
      res.status(200).json({ message: 'No questions found' });
    } else res.status(200).json(questions);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};
module.exports = {
  updateQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      //  check authority for the user
      const question = await Question.findById(id);
      if (id && req.user.id === question.student.toString()) {
        req.question = await Question.findById(id);
        const updatedQuestion = await saveQuestion(req, 'update');
        return res.status(200).json(updatedQuestion);
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
        const deletedQuestion = await Question.findByIdAndDelete(id);
        return res.status(200).json(deletedQuestion);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(401).json(error);
    }
  },
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
      const updatedQuestion = await question.save();
      return res.status(200).json(updatedQuestion);
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
        const updatedQuestion = await question.save();
        return res.status(200).json(updatedQuestion);
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
        const updatedQuestion = await question.save();
        return res.status(200).json(updatedQuestion);
      }
      throw authorizationError;
    } catch (error) {
      return res.status(401).json(error);
    }
  },
  getAllQuestions: async (req, res) => {
    /* test if it's registered user then get all the questions
      related to the interested subjects of the user
     */
    const query = {};
    if (req.user) {
      // find user's subjects
      const student = await Student.findById(req.user.id);
      // if user has no subject then get all questions ordered by date
      if (!student.subjects) {
        filterQuestions(res, query);
      } else {
        query['subjects.title'] = student.subjects.title;
        filterQuestions(res, query);
      }
    }
    // if not registered user get all questions ordered by date (recent questions)
    else {
      filterQuestions(res, query);
    }
  },

  getOneQuestion: async (req, res) => {
    const { id } = req.params;
    try {
      const question = await Question.findById(id);
      if (!question)
        res
          .status(200)
          .json({ message: `The question you are looking for not found` });
      else res.status(200).json(question);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },
  addNewQuestion: async (req, res) => {
    /*
    To add question the user needs to be registered(onlyAtuhenticated middleware check that)
    All necessary validations are handled by quesion model
    so we can save new questions directly
    */
    const questionData = req.body;
    // Assign the new question to the current user
    // questionData.student = req.user.id;
    try {
      const newQuestion = await Question.create(questionData);
      res.status(201).json(newQuestion);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },

  getQuestiosWithSimilarTags: async (req, res) => {
    const { tags } = req.query;
    if (!tags)
      res.status(400).json({ message: 'Make sure you choose subjects' });
    else {
      const query = {};
      // You can add new filter parameters filter by title, content, isSolved...
      query['subjects.title'] = tags.title;
      filterQuestions(res, query);
    }
  },
  searchForQuestions: async (req, res) => {
    // search in question's title and content
    const { text } = req.query;
    if (!text)
      res.status(400).json({ message: 'Make sure you type search text' });
    else {
      const regEx = new RegExp(text, 'i'); // insensitive
      const query = {
        $or: [{ title: { $regex: regEx } }, { content: { $regex: regEx } }],
      };
      filterQuestions(res, query);
    }
  },
};
