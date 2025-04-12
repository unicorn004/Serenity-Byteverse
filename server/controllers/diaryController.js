const DiaryEntry = require('../models/Diary');

const createDiaryEntry = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newEntry = await DiaryEntry.create({ user: req.user.id, title, content });

        res.status(201).json({ message: 'Diary entry created successfully', entry: newEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDiaryEntries = async (req, res) => {
    try {
        const entries = await DiaryEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDiaryEntry = async (req, res) => {
    try {
        const entry = await DiaryEntry.findOne({ _id: req.params.id, user: req.user.id });
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDiaryEntry = async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedEntry = await DiaryEntry.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, content },
            { new: true }
        );

        if (!updatedEntry) return res.status(404).json({ message: 'Entry not found' });

        res.json({ message: 'Diary entry updated successfully', entry: updatedEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDiaryEntry = async (req, res) => {
    try {
        const deletedEntry = await DiaryEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!deletedEntry) return res.status(404).json({ message: 'Entry not found' });

        res.json({ message: 'Diary entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createDiaryEntry, getDiaryEntries, getDiaryEntry, updateDiaryEntry, deleteDiaryEntry };