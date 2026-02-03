require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Gemini generation...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY is missing");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Explicitly testing gemini-2.0-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Model initialized: gemini-2.0-flash");

        const prompt = "Say 'Hello World'";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ API Response:", text);

    } catch (error) {
        console.error("❌ API Error:", error);
    }
}

testGemini();
