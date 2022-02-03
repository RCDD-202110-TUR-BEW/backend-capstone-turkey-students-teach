const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    creator: {
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
const questionSchema = new Schema(
    {
        //  TODO: add question properties
      comments: {
        type: [commentSchema],
        default: [],
      },
    },
    { timestamps: true }
  );
module.exports = mongoose.model("question", questionSchema);
