const express = require('express');
const tutorController = require('../controllers/tutor');

const router = express.Router();
router.get('/', tutorController.getAllTutors);

router.get('/:id', tutorController.getTutorDetails);

router.get('/:tags', tutorController.filterTutorsByTags);

router.get('/search', tutorController.searchForTutor);

router.put('/:id/edit', tutorController.editProfile);

router.get('/:id/chat', tutorController.getAllChats);

router.get('/:id/chat/:id', tutorController.getOneChat);

router.post('/:id/chat/:id', tutorController.sendMessage);

module.exports = router;
