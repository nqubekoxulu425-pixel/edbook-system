const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // This tag lets us filter between general news and STEAM specific updates
  category: {
    type: String,
    enum: ['general', 'STEAM'],
    default: 'general'
  },
  createdBy: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
