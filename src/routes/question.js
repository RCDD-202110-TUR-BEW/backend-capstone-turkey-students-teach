const express = require('express');
const onlyAuthenticated = require('../middleware/onlyAuthenticated');
const questionController = require('../controllers/question');

const router = express.Router();

router.get('/', questionController.getAllQuestions);

router.post('/', onlyAuthenticated, questionController.addNewQuestion);

router.get('/search', questionController.searchForQuestions);

router.get('/filter/:tagid', questionController.getQuestiosWithSimilarTags);

router.get('/:id', questionController.getOneQuestion);

router.put('/:id', onlyAuthenticated, questionController.updateQuestion);

router.delete('/:id', onlyAuthenticated, questionController.deleteQuestion);

router.post('/:id/comments', onlyAuthenticated, questionController.addComment);

router.put(
  '/:id/comments/:commentid',
  onlyAuthenticated,
  questionController.updateComment
);

router.delete(
  '/:id/comments/:commentid',
  onlyAuthenticated,
  questionController.deleteComment
);

module.exports = router;
