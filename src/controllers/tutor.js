const { studentModel } = require('../models/student');

module.exports = {
  getAllTutors: async (req, res) => {
    try {
      const tutors = await studentModel.find({ isTutor: true });
      res.status(200).json(tutors);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  getTutorDetails: async (req, res) => {
    const { id } = req.params;
    try {
      const details = await studentModel.findById(id);
      res.status(200).json(details);
    } catch (e) {
      res.status(400).json({ message: e.message });
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
      res.status(200).json(tutors);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  searchForTutor: async (req, res) => {
    const { tutorName } = req.query;

    const [firstName, lastName] = tutorName.toLowerCase().split(' ');

    try {
      const tutors = await studentModel.find({
        $and: [
          {
            $or: [
              { firstName },
              { lastName: lastName !== undefined ? lastName : firstName },
              {
                $and: [{ firstName }, { lastName }],
              },
            ],
          },
          { isTutor: true },
        ],
      });
      res.status(200).json(tutors);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  editProfile: async () => {},
  getAllChats: async () => {},
  getOneChat: async () => {},
  sendMessage: async () => {},
};
