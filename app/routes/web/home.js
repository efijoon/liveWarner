const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('app/http/controllers/homeController');

// middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const convertFileToField = require('app/http/middleware/convertFileToField');

router.get('/logout' , (req ,res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

// Home Routes
router.get('/', redirectIfAuthenticated.handle, homeController.index);
router.get('/dashboard', redirectIfNotAuthenticated.handle, homeController.dashboard);

module.exports = router;