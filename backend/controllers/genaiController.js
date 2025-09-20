import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateStudyPlan = async (req, res) => {
  try {
    const { topic, duration } = req.body;
    const prompt = `Generate a concise study plan for a ${duration}-minute session using the Pomodoro technique for the topic "${topic}". Include a short, encouraging sentence for each focus period and break. The plan should be easy to read and follow.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ plan: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "Failed to generate study plan." });
  }
};

export const generateRelaxationText = async (req, res) => {
  try {
    const prompt = `Generate a short, guided relaxation exercise (around 2-3 sentences) focused on breathing. The tone should be calm and gentle.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ exercise: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "Failed to generate relaxation text." });
  }
};

export const generateGameSuggestion = async (req, res) => {
  try {
    const prompt = `The user has just finished a short game. Provide a brief, motivational suggestion (one sentence) to encourage them to switch back to their study session.`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ suggestion: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "Failed to generate game suggestion." });
  }
};