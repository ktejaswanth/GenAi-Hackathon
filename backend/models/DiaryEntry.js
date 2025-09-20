import mongoose from 'mongoose';

const diaryEntrySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    sentiment: {
        score: { type: Number, required: true },
        magnitude: { type: Number, required: true },
    }
});

export default mongoose.model('DiaryEntry', diaryEntrySchema);