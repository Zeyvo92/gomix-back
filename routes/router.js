const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// GET /
router.get('/', (req, res, next) => res.send('working'));

// POST /
router.post('/user/create', userController.createNewUser);


module.exports = router;
