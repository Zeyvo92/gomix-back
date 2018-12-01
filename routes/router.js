const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// GET /
router.get('/', (req, res, next) => res.send('working'));
router.get('/user/logout', userController.logoutUser);

// POST /
router.post('/user/create', userController.createNewUser);
router.post('/user/login', userController.loginUser);


module.exports = router;
