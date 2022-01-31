const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
const messagingChannnelSchema = new Schema(
    {
      contacts: {
        type: [Schema.Types.ObjectId],
        required: true,
      },
      messages: {
        type: [messageSchema],
        default: [],
      },
    },
    { timestamps: true }
  );
module.exports = mongoose.model("MessagingChannel", messagingChannnelSchema);
