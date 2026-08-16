const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  manualProjectId: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate manual IDs are created
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['complete', 'incomplete'],
    default: 'incomplete'
  },
  deadline: {
    type: Date,
    required: true
  },
  assignedTeam: {
    type: String,
    required: true
  },
  comments: [{
    user: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  // This array stores every open/close interaction timestamp for tracking
  interactionLogs: [{
    user: String,
    action: { type: String, enum: ['opened', 'closed'] },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true }); // Tracks the exact time the project was loaded/created

module.exports = mongoose.model('Project', ProjectSchema);
