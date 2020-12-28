const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const userController = require('app/http/controllers/admin/userController');

module.exports = router;