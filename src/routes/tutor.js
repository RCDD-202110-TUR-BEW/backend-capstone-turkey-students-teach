const express = require('express');
const tutorController = require('../controllers/tutor');
const tutorValidators = require('../middleware/validators/tutorValidators');

const router = express.Router();
router.get('/', tutorController.getAllTutors);

router.get('/search', tutorController.searchForTutor);

router.get('/filter/:tagId', tutorController.filterTutorsByTags);

router.get('/:id', tutorController.getTutorDetails);

router.put(
  '/:id/edit',
  tutorValidators.editProfileValidator,
  tutorController.editProfile
);

router.get(
  '/:id/chat',
  tutorValidators.getAllChatsValidator,
  tutorController.getAllChats
);

router.get(
  '/:id/chat/:chatId',
  tutorValidators.getOneChatValidator,
  tutorController.getOneChat
);

router.post(
  '/:id/chat',
  tutorValidators.sendMessageValidator,
  tutorController.sendMessage
); // chatId must be included if the messaging channel already exists

module.exports = router;
