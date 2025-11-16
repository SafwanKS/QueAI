import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

// Set up API keys
process.env.GOOGLE_API_KEY = import.meta.env.VITE_AI_API_KEY 
process.env.TAVILY_API_KEY = import.meta.env.TAVILY_API_KEY 

// Create tools
const searchTool = new TavilySearchResults({ maxResults: 5 });

// Create agent
const agent = createAgent({
  model: new ChatGoogleGenerativeAI({ model: "gemini-2.5-flash-lite" }),
  tools: [searchTool],
  systemPrompt: "You are a helpful assistant."
});

// Run the agent
const result = await agent.invoke({
  messages: [{ role: "user", content: "Search for AI news" }]
});

console.log(result.messages[result.messages.length - 1].content);