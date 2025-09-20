import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRelaxationExercise = async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = 'Generate a short, calming relaxation exercise. It should be a single, concise paragraph, no more than 60 words, focusing on breathing or visualization. Keep the tone gentle and encouraging.';

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ exercise: text });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};