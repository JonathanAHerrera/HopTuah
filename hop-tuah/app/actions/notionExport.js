"use server"

import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function generateRoadmap(skill, roadmapData) {
  try {
    // Prepare blocks for the Notion page
    const blocks = [
      // Header with title
      {
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: [
            {
              type: "text",
              text: {
                content: `Learning Path for ${skill.toUpperCase()}`,
              },
            },
          ],
        },
      },
      // Divider
      {
        object: "block",
        type: "divider",
        divider: {},
      },
      // Description
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: `A comprehensive roadmap to help you learn ${skill} from beginner to advanced level.`,
              },
            },
          ],
        },
      },
      // Spacer
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: "" } }],
        },
      },
    ]

    // Add each step as a heading with content
    if (Array.isArray(roadmapData)) {
      roadmapData.forEach((step, index) => {
        // Step header with number
        blocks.push({
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Step ${index + 1}: ${step.title}`,
                },
              },
            ],
          },
        })

        // Step description
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: step.description,
                },
              },
            ],
          },
        })

        // Spacer between steps
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: "" } }],
          },
        })
      })
    }

    // Create the Notion page
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        title: {
          title: [
            {
              text: {
                content: `Learning Path for ${skill}`,
              },
            },
          ],
        },
      },
      children: blocks,
    })

    // Return the page URL
    return {
      notionPageUrl: response.url,
    }
  } catch (error) {
    console.error("Error in generateRoadmap:", error)
    throw new Error("Failed to generate roadmap: " + error.message)
  }
}
