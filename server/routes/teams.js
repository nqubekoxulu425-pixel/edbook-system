const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// 1. GET ALL TEAMS LIST (To see members and click join buttons)
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('members joinRequests', 'name email role');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. INITIALIZE/CREATE NEW TEAM (Helper for Setup)
router.post('/init', async (req, res) => {
  try {
    const { teamName, managerId } = req.body;
    const newTeam = new Team({ teamName, managerId, members: [managerId] });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. SUBMIT EXTERNAL JOIN REQUEST (Student Action)
router.post('/:id/request-join', async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: 'Team folder missing' });

    // Check if user is already a member or pending
    if (team.members.includes(userId) || team.joinRequests.includes(userId)) {
      return res.status(400).json({ message: 'Request already filed or membership active.' });
    }

    team.joinRequests.push(userId);
    await team.save();
    res.json({ message: 'Join request filed dashboard-wide for manager approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. APPROVE OR REJECT JOIN REQUEST (Manager View Verification)
router.post('/:id/handle-request', async (req, res) => {
  try {
    const { userId, approve } = req.body; // approve is a true/false boolean
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: 'Team trace not found' });

    // Remove user identity from the raw requests list array string
    team.joinRequests = team.joinRequests.filter(reqId => reqId.toString() !== userId);

    if (approve) {
      team.members.push(userId); // Add to permanent list
    }

    await team.save();
    res.json({ message: approve ? 'Member accepted!' : 'Request dismissed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
