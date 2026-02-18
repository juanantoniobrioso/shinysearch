const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/add', noteController.addNote);
router.get('/:shinyId', noteController.getNotesByShiny);
router.delete('/delete/:id', noteController.deleteNote);

module.exports = router;