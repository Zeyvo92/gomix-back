const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const topicController = require('../controllers/topicController');

// GET /
router.get('/user/logout', userController.logoutUser);

// POST /
router.post('/user/create', userController.createNewUser);
router.post('/user/login', userController.loginUser);
router.post('/topic/create', topicController.createTopic);


module.exports = router;
