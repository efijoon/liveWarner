const express = require('express');
const router = express.Router();

// Controllers
const userController = require('app/http/controllers/userController');

// middlewares
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const convertFileToField = require('app/http/middleware/convertFileToField');
const upload = require('app/helpers/uploadImage');

// User Routes
router.get('/userProfile', redirectIfNotAuthenticated.handle, userController.profile);
router.post('/updateProfile', redirectIfNotAuthenticated.handle, userController.updateProfile);
router.post('/changeProfileImage', convertFileToField.handle, upload.single('userImage'), redirectIfNotAuthenticated.handle, userController.changeProfileImage);

module.exports = router;