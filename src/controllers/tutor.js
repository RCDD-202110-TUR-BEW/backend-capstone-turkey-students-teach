const { studentModel } = require('../models/student');

module.exports = {
  getAllTutors: async (req, res) => {
    try {
      const tutors = await studentModel.find({ isTutor: true });
      res.json(tutors);
    } catch (e) {
      res.status(400).send(e);
    }
  },
  getTutorDetails: async (req, res) => {
    const { id } = req.params;
    try {
      const details = await studentModel.findById(id);
      res.json(details);
    } catch (e) {
      res.status(400).send(e);
    }
  },
  filterTutorsByTags: async (req, res) => {
    const { tagid } = req.params;
    try {
      const tutors = await studentModel.find({
        subjects: {
          $elemMatch: {
            $or: [{ title: tagid }, { _id: tagid }],
          },
        },
      });
      res.json(tutors);
    } catch (e) {
      res.status(400).send(e);
    }
  },
  searchForTutor: async (req, res) => {
    const { tutorName } = req.query;
    try {
      const tutors = await studentModel.find({
        $or: [{ firstName: tutorName }, { lastName: tutorName }],
      });
      res.json(tutors);
    } catch (e) {
      res.status(400).send(e);
    }
  },
  editProfile: async () => {},
  getAllChats: async () => {},
  getOneChat: async () => {},
  sendMessage: async () => {},
};
