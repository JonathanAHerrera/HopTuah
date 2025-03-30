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
    let roadmapData;
    try {
      const content = roadmapResponse.choices[0].message.content;
      roadmapData = JSON.parse(content);
      
      // Ensure the response contains the expected structure
      if (!roadmapData.roadmap && Array.isArray(roadmapData)) {
        // If it's already an array, use it directly
        roadmapData = { roadmap: roadmapData };
      } else if (!roadmapData.roadmap) {
        // If it's an object but doesn't have a roadmap property
        roadmapData = { roadmap: [roadmapData] };
      }
      
      // Always return the data property with an array
      return NextResponse.json({ 
        success: true, 
        data: roadmapData.roadmap || [] 
      });
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.error("Raw content:", roadmapResponse.choices[0].message.content);
      
      // Return a 500 error with proper JSON
      return NextResponse.json(
        { error: "Failed to parse roadmap data as JSON" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating roadmap:", error);
    
    // Return a 500 error with proper JSON
    return NextResponse.json(
      { error: "Failed to generate roadmap: " + error.message },
      { status: 500 }
    );
  }
} 