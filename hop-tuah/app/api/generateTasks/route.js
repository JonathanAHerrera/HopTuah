import { NextResponse } from "next/server";
import OpenAI from "openai";
import fetch from 'node-fetch';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// You'll need to get an API key from https://serper.dev/
const SERPER_API_KEY = process.env.SERPER_API_KEY;

// Function to get real, working links from the web
async function getWorkingLinks(query, numResults = 2) {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: numResults + 3 // Request more than needed in case some are irrelevant
      })
    });
    
    if (!response.ok) {
      console.error('Search API error:', await response.text());
      throw new Error('Failed to fetch search results');
    }
    
    const data = await response.json();
    
    // Extract organic search results and filter out irrelevant sites
    const blockedDomains = ['pinterest', 'facebook.com', 'instagram.com', 'twitter.com'];
    const links = data.organic
      .filter(result => !blockedDomains.some(domain => result.link.includes(domain)))
      .slice(0, numResults)
      .map(result => ({
        url: result.link,
        title: result.title
      }));
    
    return links;
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}

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
          content: `Create 5 detailed tasks for the step "${stepTitle}" in learning ${skill}. Each task should be specific, actionable, and help the user complete this step. Return the response as a JSON array of objects with 'task' (string) and 'estimatedTime' (in minutes, number) fields.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the tasks response
    const tasksData = JSON.parse(tasksResponse.choices[0].message.content);
    
    // Add real, working resource links to each task
    const tasksWithResources = await Promise.all(tasksData.tasks.map(async (task) => {
      // Create a search query for this specific task
      const searchQuery = `${skill} ${stepTitle} ${task.task} tutorial`;
      
      // Get real links for this task
      const resources = await getWorkingLinks(searchQuery);
      
      return {
        ...task,
        resources: resources.length > 0 ? resources : [
          // Fallback if search fails
          { 
            url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
            title: "Search for resources"
          }
        ]
      };
    }));
    
    return NextResponse.json({ 
      success: true, 
      stepIndex: stepIndex,
      stepTitle: stepTitle,
      tasks: tasksWithResources
    });
  } catch (error) {
    console.error("Error generating tasks:", error);
    return NextResponse.json(
      { error: "Failed to generate tasks: " + error.message },
      { status: 500 }
    );
  }
}
