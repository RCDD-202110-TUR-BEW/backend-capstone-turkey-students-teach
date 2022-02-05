// const { use } = require('express/lib/application');
const Question = require('../models/question');
const Student = require('../models/student');

function filterQuestions(query) {
  return async (_, res) => {
    try {
      // Find and sort by latest
      const questions = await Question.find(query).sort({ _id: -1 }); // {'date:-1'}
      if (!questions) res.status(422).json({ messge: 'No questions found' });
      else res.status(201).json(questions);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  };
}

module.exports = {
  getAllQuestions: async (req, res) => {
    /* test if it's registered user then get all the questions
     related to the interested subjects of the user
    */
    const query = {};
    if (req.auth.sub) {
      // find user's subjects
      const subjects = await Student.findById(req.auth.sub).select({
        subjects: 1,
      });
      // if user has no subject the get all questions ordered by date
      if (!subjects) filterQuestions({});
      else {
        query.subjetc = subjects;
        filterQuestions(query);
      }
    }
    // if not registered user get all questions ordered by date (recent questions)
    else {
      filterQuestions(query);
    }
  },

  getOneQuestion: async (req, res) => {
    const { id } = req.params.id;
    try {
      const question = await Question.findById(id);
      if (!question)
        res
          .status(422)
          .json({ message: `The question you are looking for wasn't found` });
      else res.status(200).json(question);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },

  addNewQuestion: async (req, res) => {
    /*
    To add question the user needs to be registered(onlyAtuhenticated used to check that)
    All necessary validations are handled by quesion model
    so we can save new questions directly
    */
    const questionData = req.body;
    // Assign the new question to the current user
    questionData.student = req.auth.sub;
    try {
      const newQuestion = await Question.create(questionData);
      if (!newQuestion)
        res.status(422).json({ message: 'Can not add new question now' });
      else res.status(201).json(newQuestion);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },

  updateQuestion: async () => {},

  deleteQuestion: async () => {},

  getQuestiosWithSimilarTags: async (req, res) => {
    const { subjetcs } = req.query;
    if (!subjetcs)
      res.status(400).json({ message: 'Make sure you choose subjects' });
    else {
      const query = {};
      // We can add new query to filter here
      query.subjetcs = subjetcs;
      filterQuestions(query);
    }
  },

  searchForQuestions: async (req, res) => {
    // search in question's title and content
    const searchWord = '';
    const regex = new RegExp(searchWord, 'i');
    try {
      const questions = Question.find({
        $or: [({ title: { $regex: regex } }, { content: { $regex: regex } })],
      });
      if (questions) res.status(201).json(questions);
      else res.status(422).json('No question found');
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },

  addComment: async () => {},
  updateComment: async () => {},
  deleteComment: async () => {},
};
