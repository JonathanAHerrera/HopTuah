import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { skill } = await request.json();

    if (!skill) {
      return NextResponse.json(
        { error: "Skill parameter is required" },
        { status: 400 }
      );
    }

    // Generate roadmap with OpenAI
    const roadmapResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that creates educational roadmaps for learning new skills.",
        },
        {
          role: "user",
          content: `Create a 10-step roadmap for learning ${skill}. For each step, provide a title and a brief description. Return the response as a JSON array of objects with 'title' and 'description' fields. Each step should be logical and help the user progress from beginner to intermediate level.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the roadmap response
    const roadmapData = JSON.parse(roadmapResponse.choices[0].message.content);
    
    // Now, generate detailed tasks for each roadmap step
    const tasksPromises = roadmapData.roadmap.map(async (step, index) => {
      const tasksResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that creates educational task lists for learning new skills.",
          },
          {
            role: "user",
            content: `Create 5 detailed tasks for the step "${step.title}" in learning ${skill}. Each task should be specific, actionable, and help the user achieve this step. Return the response as a JSON array of objects with 'task', 'estimatedTime' (in minutes), and 'resources' (array of helpful links or materials) fields.`,
          },
        ],
        response_format: { type: "json_object" },
      });
      
      const tasksData = JSON.parse(tasksResponse.choices[0].message.content);
      
      // Store the tasks with reference to the roadmap step
      return {
        stepId: index,
        stepTitle: step.title,
        tasks: tasksData.tasks
      };
    });
    
    // Wait for all tasks to be generated
    const allTasks = await Promise.all(tasksPromises);
    
    // Store the generated tasks in a database or localStorage
    // For now, we'll use the browser's localStorage in the client component
    
    return NextResponse.json({ 
      success: true, 
      data: roadmapData.roadmap,
      tasks: allTasks
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap: " + error.message },
      { status: 500 }
    );
  }
} 