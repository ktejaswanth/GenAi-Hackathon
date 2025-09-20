import DiaryEntry from '../models/DiaryEntry.js';
import { LanguageServiceClient } from '@google-cloud/language';

const languageClient = new LanguageServiceClient();

export const analyzeAndSave = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id; 

        if (!text) {
            return res.status(400).json({ msg: 'Please enter some text.' });
        }

        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        const [result] = await languageClient.analyzeSentiment({ document: document });
        const sentiment = result.documentSentiment;

        const newEntry = new DiaryEntry({
            userId,
            text,
            sentiment: {
                score: sentiment.score,
                magnitude: sentiment.magnitude,
            },
        });

        await newEntry.save();
        res.status(201).json({ message: 'Diary entry saved.', entry: newEntry });
    } catch (error) {
        console.error("Error in analyzeAndSave:", error.message);
        res.status(500).send('Server Error');
    }
};

export const getEntries = async (req, res) => {
    try {
        const userId = req.user.id;
        const entries = await DiaryEntry.find({ userId }).sort({ date: -1 }); // Sort by newest
        res.json(entries);
    } catch (error) {
        console.error("Error in getEntries:", error.message);
        res.status(500).send('Server Error');
    }
};

export const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const updatedEntry = await DiaryEntry.findOneAndUpdate(
            { _id: id, userId },
            { text, date: Date.now() },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: "Diary entry not found." });
        }
        res.json({ message: "Diary entry updated.", entry: updatedEntry });
    } catch (error) {
        console.error("Error in updateEntry:", error.message);
        res.status(500).send('Server Error');
    }
};

export const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedEntry = await DiaryEntry.findOneAndDelete({ _id: id, userId });

        if (!deletedEntry) {
            return res.status(404).json({ message: "Diary entry not found." });
        }
        res.json({ message: "Diary entry deleted successfully." });
    } catch (error) {
        console.error("Error in deleteEntry:", error.message);
        res.status(500).send('Server Error');
    }
};

// This is the missing function
export const getHealthDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        // This route is for the dashboard graph, so it's sorted by date for plotting
        const entries = await DiaryEntry.find({ userId }).sort({ date: 1 });
        res.json(entries);
    } catch (error) {
        console.error("Error in getHealthDashboard:", error.message);
        res.status(500).send('Server Error');
    }
};