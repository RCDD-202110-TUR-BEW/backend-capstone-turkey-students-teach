const Student = require('../models/student').StudentModel;
const messagingChannelModel = require('../models/messaging-channel');

module.exports = {
  getAllTutors: async (req, res) => {
    try {
      const tutors = await Student.find({ isTutor: true });
      res.status(200).json(tutors);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  getTutorDetails: async (req, res) => {
    const { id } = req.params;
    try {
      const details = await Student.findById(id);
      res.status(200).json(details);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  filterTutorsByTags: async (req, res) => {
    const { tagId } = req.params;
    try {
      const tutors = await Student.find({
        subjects: {
          $elemMatch: {
            $or: [{ title: tagId }, { _id: tagId }],
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
      const tutors = await Student.find({
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

  editProfile: async (req, res) => {
    const { id } = req.params;

    const canChange = [
      'firstName',
      'lastName',
      'email',
      'isTutor',
      'avatar',
      'subjects',
    ];
    Object.keys(req.body).forEach((key) => {
      if (!canChange.includes(key)) {
        delete req.body[key];
      }
    });

    try {
      await Student.findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
      });

      return res.status(200).json({ message: 'Updated successfully' });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  },
  getAllChats: async (req, res) => {
    const { id } = req.params;
    try {
      const { messagingChannels } = await Student.findById(id, {
        _id: 0,
        messagingChannels: 1,
      });

      const channelsIds = [];
      messagingChannels.forEach((channel) =>
        channelsIds.push(channel.toString())
      );

      const allChats = await messagingChannelModel.find({
        _id: {
          $in: channelsIds,
        },
      });

      return res.status(200).json(allChats);
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  },
  getOneChat: async (req, res) => {
    const { id, chatId } = req.params;
    try {
      const oneChat = await messagingChannelModel.findOne({
        _id: chatId,
        contacts: id,
      });

      return res.status(200).json(oneChat);
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  },
  sendMessage: async (req, res) => {
    const { id } = req.params;
    const { chatId, content, receiver } = req.body;
    try {
      if (chatId) {
        const existsAndBelongsToUser = await messagingChannelModel.findOne({
          _id: chatId,
          contacts: id,
        });

        if (existsAndBelongsToUser) {
          const chatDoc = await messagingChannelModel.findById(chatId);
          await chatDoc.messages.push({ content, sender: id });
          await chatDoc.save();

          return res.status(201).json(chatDoc);
        }
        return res.status(404).json({
          message: "This chat room doesn't exist or doesn't belong to the user",
        });
      }
      const newChannelDoc = await messagingChannelModel.create({
        contacts: [id, receiver],
      });
      await newChannelDoc.messages.push({ content, sender: id });
      await newChannelDoc.save();

      await Student.updateMany(
        {
          _id: {
            $in: [id, receiver],
          },
        },
        {
          $push: { messagingChannels: newChannelDoc.id },
        }
      );

      return res.status(201).json(newChannelDoc);
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  },
};
