import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return Response.json({
        error: "GEMINI_API_KEY not found in environment variables"
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test all possible model names
    const modelsToTest = [
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest", 
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.0-pro-latest",
      "gemini-1.0-pro",
      "models/gemini-pro",
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash"
    ];

    const results = [];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'works' if you can read this");
        
        results.push({
          model: modelName,
          status: "✅ WORKS",
          response: result.response.text().substring(0, 100)
        });
        
        // If one works, break early
        break;
      } catch (error) {
        results.push({
          model: modelName,
          status: "❌ FAILED",
          error: error.message.substring(0, 150)
        });
      }
    }

    // Also try to list models
    let availableModels = [];
    try {
      const listResult = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      const data = await listResult.json();
      availableModels = data.models?.map(m => m.name) || [];
    } catch (e) {
      availableModels = ["Could not list models: " + e.message];
    }

    return Response.json({
      apiKeySet: true,
      apiKeyPrefix: apiKey.substring(0, 15) + "...",
      testResults: results,
      availableModels: availableModels
    });

  } catch (error) {
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}