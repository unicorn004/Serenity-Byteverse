const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createDiaryEntry,
    getDiaryEntries,
    getDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry
} = require('../controllers/diaryController');

const router = express.Router();

router.post('/', protect, createDiaryEntry);
router.get('/', protect, getDiaryEntries);
router.get('/:id', protect, getDiaryEntry);
router.put('/:id', protect, updateDiaryEntry);
router.delete('/:id', protect, deleteDiaryEntry);

module.exports = router;