const express = require('express');
const onlyAuthenticated = require('../middleware/onlyAuthenticated');
const questionController = require('../controllers/question');
const questionValidator = require('../middleware/validators/questionValidator');

const router = express.Router();

router.get('/', onlyAuthenticated, questionController.getAllQuestions);

router.post('/', onlyAuthenticated, questionController.addNewQuestion);

router.get('/search', questionController.searchForQuestions);

router.get('/filter/:tags', questionController.getQuestiosWithSimilarTags);

router.get('/:id', questionController.getOneQuestion);

router.put(
  '/:id',
  onlyAuthenticated,
  questionValidator.updateQuestionValidator,
  questionController.updateQuestion
);

router.delete(
  '/:id',
  onlyAuthenticated,
  questionValidator.deleteQuestionValidator,
  questionController.deleteQuestion
);

router.post(
  '/:id/comments',
  onlyAuthenticated,
  questionValidator.createCommentValidator,
  questionController.addComment
);

router.put(
  '/:id/comments/:commentid',
  onlyAuthenticated,
  questionValidator.updateCommentValidator,
  questionController.updateComment
);

router.delete(
  '/:id/comments/:commentid',
  onlyAuthenticated,
  questionValidator.deltetCommentValidator,
  questionController.deleteComment
);

module.exports = router;
