const express = require('express');
const router = express.Router();

// Controllers
const warningController = require('app/http/controllers/warningController');

// warning Routes
router.get('/' , warningController.index);
router.get('/createWarning' , warningController.createWarning);
router.post('/makeWarning' , warningController.makeWarning);
router.post('/editWarning' , warningController.editWarning);
router.post('/updateWarning/:id' , warningController.updateWarning);
router.post('/deleteWarning' , warningController.deleteWarning);
router.get('/doneWarnings' , warningController.doneWarnings);
router.post('/namadSearch' , warningController.namadSearch);

module.exports = router;