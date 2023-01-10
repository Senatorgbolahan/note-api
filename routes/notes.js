const express = require('express')
const router = express.Router()

const {getAllNotes, getNote, createNotes, updateNotes, deleteNotes} = require('../controllers/notes')


router.route('/').post(createNotes).get(getAllNotes)
router.route('/:id').get(getNote).delete(deleteNotes).patch(updateNotes)


module.exports = router;