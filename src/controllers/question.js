// const { use } = require('express/lib/application');
const mongoose = require('mongoose');
const Question = require('../models/question');
const subject = require('../models/student').subjectSchema;
const Student = require('../models/student');

// function filterQuestions(query) {
//   return async (_, res) => {
//     try {
//       // Find and sort by latest
//       const questions = await Question.find(query).sort({ createdAt: -1 }); // {'date:-1'}
//       if (questions) res.status(201).json(questions);
//       else res.status(422).json({ messge: 'No questions found' });
//     } catch (err) {
//       res.status(422).json({ message: err.message });
//     }
//   };
// }

const filterQuestions = async (res, query) => {
  try {
    // Find and sort by latest
    const questions = await Question.find(query); // .sort({ createdAt: -1 }); // {'date:-1'}
    // console.log(questions);
    if (!questions) res.status(422).json({ messge: 'No questions found' });
    else res.status(201).json(questions);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

module.exports = {
  getAllQuestions: async (req, res) => {
    // /* test if it's registered user then get all the questions
    //  related to the interested subjects of the user
    // */
    const query = {};
    // if (req.user) {
    //   // find user's subjects
    //   const subjects = await Student.findById(req.user.id).select({
    //     subjects: 1,
    //   });
    //   // if user has no subject the get all questions ordered by date
    //   if (!subjects) filterQuestions(res, {});
    //   else {
    //     query.subjetc = subjects;
    //     filterQuestions(res, query);
    //   }
    // }
    // // if not registered user get all questions ordered by date (recent questions)
    // else {
    filterQuestions(res, query);
    // }
  },

  getOneQuestion: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(422).json('provide valid id parameter please');
    else {
      try {
        const question = await Question.findById(id);
        if (!question)
          res
            .status(422)
            .json({ message: `The question you are looking for not found` });
        else res.status(200).json(question);
      } catch (err) {
        res.status(422).json({ message: err.message });
      }
    }
  },

  addNewQuestion: async (req, res) => {
    /*
    To add question the user needs to be registered(onlyAtuhenticated used to check that)
    All necessary validations are handled by quesion model
    so we can save new questions directly
    */
    const questionData = req.body;
    console.log(req.body);
    // Assign the new question to the current user
    // questionData.student = req.user.id;
    try {
      const newQuestion = await Question.create(questionData);
      // if (!newQuestion)
      //   res.status(422).json({ message: 'Can not add new question now' });
      // else
      res.status(201).json(newQuestion);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },

  updateQuestion: async () => {},

  deleteQuestion: async () => {},

  getQuestiosWithSimilarTags: async (req, res) => {
    const { tags } = req.body; // req.query
    // console.log(tags);
    if (!tags)
      res.status(400).json({ message: 'Make sure you choose subjects' });
    else {
      const query = {};
      // You can add new filter parameters filter by title, content, isSolved...
      // query.subjects.schema.path('title').enumValues = tags;
      query['subjects.title'] = tags.title;
      console.log(query);
      filterQuestions(res, query);
    }
  },

  searchForQuestions: async (req, res) => {
    // search in question's title and content
    const { text } = req.params;
    const regEx = new RegExp(text, 'i'); // insensitive
    try {
      const question = await Question.find({
        $or: [{ title: { $regex: regEx } }, { content: { $regex: regEx } }],
      });
      if (!question.length) res.status(422).json('No question found');
      else res.status(201).json(question);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  },

  addComment: async () => {},
  updateComment: async () => {},
  deleteComment: async () => {},
};
