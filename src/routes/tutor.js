const express = require('express');
const tutorController = require('../controllers/tutor');

const router = express.Router();
router.get('/', tutorController.getAllTutors);

router.get('/search', tutorController.searchForTutor);

router.get('/filter/:tagid', tutorController.filterTutorsByTags);

router.get('/:id', tutorController.getTutorDetails);

router.put('/:id/edit', tutorController.editProfile);

router.get('/:id/chat', tutorController.getAllChats);

router.get('/:id/chat/:chatId', tutorController.getOneChat);

router.post('/:id/chat', tutorController.sendMessage); // chatId must be included if the messaging channel already exists

module.exports = router;
