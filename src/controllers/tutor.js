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
    let firstName = tutorName.toLowerCase();
    let lastName = tutorName.toLowerCase();

    if (tutorName.indexOf(' ') !== -1) {
      [firstName, lastName] = tutorName.toLowerCase().split(' ');
    }

    try {
      const tutors = await studentModel.find({
        $or: [
          { firstName },
          { lastName },
          {
            $and: [{ firstName }, { lastName }],
          },
        ],
      });
      res.json(tutors);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  editProfile: async () => {},
  getAllChats: async () => {},
  getOneChat: async () => {},
  sendMessage: async () => {},
};
