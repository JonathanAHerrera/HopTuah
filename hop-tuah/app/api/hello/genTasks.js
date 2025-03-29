import OpenAI from "openai";

// API key
const apiKey = process.env.OPENAI_API_KEY;

// Prompt for generating JSON with subtasks and resources for each step
const prompt = `
        You are a roadmap generator. 
        Generate a JSON object where each step is a key (e.g., "Step 1", "Step 2"). 
        Each step should contain an array of 3-5 subtasks. For each subtask, include:
        - A description of the task.
        - A list of associated resources.
        - Provide URLs for each resource that can help complete the task.
        Ensure the output is valid JSON.
`;

// Function to generate the 
async function generateTasks() {
  try {
    // Initialize OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Make the API request
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an assistant that outputs valid JSON roadmaps with links to resources." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7, // Adjust creativity level
    });

    // Extract and log the response content
    const jsonResponse = response.choices[0].message.content;

    console.log("Generated Tasks JSON:", jsonResponse);

    //Parsing JSON to JS object
    const parsedJson = JSON.parse(jsonResponse);
    console.log("Parsed Task Object:", parsedJson);
  } catch (error) {
    console.error("Error generating Tasks:", error);
  }
}

// Execute the function
generateTasks();
