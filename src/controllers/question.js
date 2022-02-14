// const mongoose = require('mongoose');
const Question = require('../models/question');
const Student = require('../models/student');

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
      if (question.length <= 0)
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
    questionData.student = req.user.id;
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

  updateQuestion: async () => {},
  deleteQuestion: async () => {},
  addComment: async () => {},
  updateComment: async () => {},
  deleteComment: async () => {},
};
