const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// 1. CREATE A PROJECT (Manager Action)
router.post('/create', async (req, res) => {
  try {
    const { manualProjectId, name, deadline, assignedTeam } = req.body;

    // Verify manual unique ID rule
    const existing = await Project.findOne({ manualProjectId });
    if (existing) {
      return res.status(400).json({ message: 'This Project ID already exists manually. Pick another.' });
    }

    const newProject = new Project({
      manualProjectId,
      name,
      deadline,
      assignedTeam
    });

    await newProject.save();
    res.status(201).json({ message: 'Project successfully loaded into system!', project: newProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. SEARCH AND FILTER/SORT PROJECTS
router.get('/search', async (req, res) => {
  try {
    const { name, sort } = req.query;
    let queryFilter = {};

    // Filter by name query if it exists
    if (name) {
      queryFilter.name = { $regex: name, $options: 'i' }; // 'i' makes it case-insensitive
    }

    let projectQuery = Project.find(queryFilter);

    // Apply exact sorting rules requested
    if (sort === 'nearest') {
      projectQuery = projectQuery.sort({ deadline: 1 }); // Imminent deadlines first
    } else if (sort === 'recent') {
      projectQuery = projectQuery.sort({ createdAt: -1 }); // Newest loaded entries first
    }

    const results = await projectQuery;
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. LOG INTERACTION TIMESTAMPS (Open/Close tracking)
router.post('/:id/log-interaction', async (req, res) => {
  try {
    const { user, action } = req.body; // action must be 'opened' or 'closed'
    const project = await Project.findById(req.id || req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.interactionLogs.push({ user, action });
    await project.save();

    res.json({ message: `Timestamp logged: project ${action}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ADD COMMENT TO THREAD
router.post('/:id/comment', async (req, res) => {
  try {
    const { user, text } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.comments.push({ user, text });
    await project.save();

    res.json({ message: 'Comment appended successfully', comments: project.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
