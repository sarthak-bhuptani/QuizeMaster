const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateQuiz = async (req, res) => {
    try {
        const { topic, difficulty, questionCount } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API Key is missing in server configuration." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-flash-latest for broader compatibility
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Generate a quiz for the topic "${topic}" with a difficulty level of "${difficulty}". 
        Create exactly ${questionCount} multiple-choice questions. 
        Each question must have 4 options and one correct answer.
        
        Respond ONLY with a valid JSON array of objects. Do not include markdown formatting (like \`\`\`json).
        The JSON structure for each object should be:
        {
            "question_text": "The question string",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "The correct option string (must match one of the options exactly)",
            "marks": 1
        }`;

        console.log(`Generating quiz for topic: ${topic} with model: gemini-flash-latest`);

        // Retry logic function
        const generateWithRetry = async (retries = 3, delay = 2000) => {
            try {
                return await model.generateContent(prompt);
            } catch (error) {
                // Check if it's a rate limit error (usually 429)
                if ((error.status === 429 || error.message.includes('429')) && retries > 0) {
                    console.warn(`Quota exceeded. Retrying in ${delay / 1000}s... (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return generateWithRetry(retries - 1, delay * 2); // Exponential backoff
                }
                throw error;
            }
        };

        const result = await generateWithRetry();
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Raw Output:", text); // Debug log

        // Robust JSON extraction
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("No JSON array found in response");
        }

        const quizData = JSON.parse(jsonMatch[0]);
        res.status(200).json(quizData);

    } catch (error) {
        console.error("AI Generation Error:", error);

        let message = "Failed to generate quiz.";
        if (error.status === 429 || error.message.includes('429')) {
            message = "Server is busy (Rate Limit). Please try again in a few seconds.";
        }

        res.status(500).json({
            message: message,
            details: error.message
        });
    }
};

module.exports = { generateQuiz };
