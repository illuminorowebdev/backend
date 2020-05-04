const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const projectRoutes = require('./project.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
