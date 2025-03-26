const express = require('express');
const router = express.Router();

const testController = require('../app/controllers/testController');

router.get('/hello-world', testController.helloWorld);

module.exports = router;