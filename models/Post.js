const mongoose = require("mongoose");
const { Schema } = mongoose;
const { postType, eventMode } = require("../config");

const postSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  postType: {
    type: String,
    required: true,
    enum: postType,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Group",
  },
  imageUrl: {
    type: String,
  },
  eventDate: {
    type: Date,
    required: function () {
      return isEvent(this.postType);
    },
  },
  eventTime: {
    type: String,
    required: function () {
      return isEvent(this.postType);
    },
  },
  mode: {
    type: String,
    required: function () {
      return isEvent(this.postType);
    },
    enum: eventMode,
  },
  organizer: {
    type: String,
  },
  topic: {
    type: String,
    required: function () {
      const event = isEvent(this.postType);
      const resource = isResource(this.postType);

      return event || resource;
    },
  },
  description: {
    type: String,
    required: true,
  },
  resourceTime: {
    type: String,
    required: function () {
      return isResource(this.postType);
    },
  },
  venue: {
    type: String,
    required: function () {
      const event = isEvent(this.postType);
      const other = eventMode.indexOf(this.mode) == 1;

      return event && other;
    },
  },
  link: {
    type: String,
    required: function () {
      const resource = isResource(this.postType);
      const event = isEvent(this.postType);
      const other = eventMode.indexOf(this.mode) == 0;

      return resource || (event && other);
    },
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

function isEvent(post) {
  if (postType.indexOf(post) == 0) {
    return true;
  }

  return false;
}

function isResource(post) {
  if (postType.indexOf(post) == 1) {
    return true;
  }

  return false;
}

function isCommunityPost(post) {
  if (postType.indexOf(post) == 2) {
    return true;
  }

  return false;
}

module.exports = mongoose.model("Post", postSchema);
