import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { skill, stepTitle, stepIndex } = await request.json();

    if (!skill || stepTitle === undefined) {
      return NextResponse.json(
        { error: "Skill and step title are required" },
        { status: 400 }
      );
    }

    // Generate tasks with OpenAI
    const tasksResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that creates educational task lists for learning new skills.",
        },
        {
          role: "user",
          content: `Create 5 detailed tasks for the step "${stepTitle}" in learning ${skill}. Each task should be specific, actionable, and help the user complete this step. Return the response as a JSON array of objects with 'task' (string), 'estimatedTime' (in minutes, number), and 'resources' (array of strings with helpful links or materials) fields.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the tasks response
    const tasksData = JSON.parse(tasksResponse.choices[0].message.content);
    
    return NextResponse.json({ 
      success: true, 
      stepIndex: stepIndex,
      stepTitle: stepTitle,
      tasks: tasksData.tasks 
    });
  } catch (error) {
    console.error("Error generating tasks:", error);
    return NextResponse.json(
      { error: "Failed to generate tasks: " + error.message },
      { status: 500 }
    );
  }
}
