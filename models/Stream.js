const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create a Stream schema
const StreamSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    extractedId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    smallImg: {
      type: String,
      required: true,
    },
    bigImg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Mongoose model for Stream
const Stream = mongoose.models.Stream || mongoose.model("Stream", StreamSchema);

module.exports = { Stream };
