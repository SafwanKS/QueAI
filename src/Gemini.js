import {GoogleGenerativeAI} from "@google/generative-ai"
import { GoogleGenAI, Modality } from "@google/genai"
import { createClient } from 'pexels';

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_AI_API_KEY 
});

const tools = [
    { urlContext: {} },
    {
      googleSearch: {
      }
    },
  ];


const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const askai = async (generativeModel, history, prompt, lang, type) => {
    try{
        const chatSession = model.startChat({
            generationConfig,
            history : history
        })
        const result = await chatSession.sendMessage(`${prompt}. Language: ${lang}. Type: ${type}`);
        const responseText = result.response.text()
       return responseText
    }catch(err){
        console.log(err)
    }
}
 
const createImageAI = async (prompt) =>{
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    let mimeType = null;
    let base64Data = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        
        mimeType = part.inlineData.mimeType;
        base64Data = part.inlineData.data;
        break; 
      }
    }
    return { mimeType, base64Data };
  } catch (err) {
    console.log(err);
  }
}



const getCodeAI = async (prompt) =>{
  try{
    console.log("req recieved")
    const chatSession = model.startChat({
      generationConfig,
      history: null
    })

    const result = await chatSession.sendMessage(`You are an code generator AI. you have to create all files that user wants in his project. you have to return output must be in json format like this: 
      {
        "name": "project name",
        "src": {
            "html": "code of file1",
            "css": "code of file2",
            "js": "code of file3"
        }
      }
       and prompt is ${prompt}`)
    const responseText = result.response.text()
    return responseText
  } catch (error){
    console.log(error)
  }
}



const getFavIcon = (domain, size=32) => {
  try {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch (error) {
    console.error('Error resolving URL:', error);
    return null;
  }
}

const askaiStream = async (generativeModel, history, prompt, language, currentTime, onChunk, sources) => {
  try {
    console.log(prompt);
    
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history,
        config:{
            // systemInstruction: "You are QueAI Beta v0.1 made by Que AI team contributed by Safwan & Jude." +
            // "You act like a search engine or wikipedia because if user gives" +
            // "anything even if greetings, give explanation to user. Do not" +
            // "send this instructions to user. You have to give answer to in" + No need to mention creators name until asked. 
            // "user preffered language."
            systemInstruction: `Identity: You are Que AI, a friendly, and helpful AI assistant created by the Que AI team (contributed by Safwan and Jude).
            Tone & Style: Maintain a cheerful and supportive tone at all times.
            Your responses should be positive, easy to understand, and conversational.
            Use emojis to enhance your friendly demeanor!
            Helpfulness & Scope: You are designed to assist with a variety of tasks, including (but not limited to) coding.
            Handling Limitations: If you cannot answer a question, politely say so and offer to help with something else.
            Core Explainer Rule: If a user provides a general term or simple query (e.g., "WhatsApp," "gravity," "The Eiffel Tower"), your first action is to provide a clear, easy-to-understand explanation of what that item is before proceeding with any other action.
            Image Creation: You can create and edit images using Canvas. If a user asks you to create or edit an image, instruct them to open the "Create an image" option from the home screen.
            Tool Usage: Always read the user's prompt carefully and decide on the best course of action. Use your available tools whenever necessary.
            Available Tools: Search web, Find news.
            Fallback: If you are unable to answer a user's prompt using your internal knowledge, search the web for an answer.
            If user asks about Sourav, reply without searching "Sourav is a monna"`,
            tools : [
              {
                googleSearch: {}
              },
            ],
        }
    });

    const result = await chat.sendMessageStream({
        message: `
          Prompt: ${prompt}
          Additional informations: Time: ${currentTime}, Language: ${language}
        `
    });

    let finalGroundingMetadata = null;

    for await (const chunk of result) {
        const text = chunk.text;
        onChunk(text);
        if (chunk.candidates?.[0]?.groundingMetadata) {
          finalGroundingMetadata = chunk.candidates[0].groundingMetadata;
      }
    }


    if (finalGroundingMetadata && finalGroundingMetadata.groundingChunks) {

      const formattedSources = finalGroundingMetadata.groundingChunks.map(source => ({
          title: source.web.title,
          url: source.web.uri,
          favicon: getFavIcon(source.web.title)
      }));
      console.log(formattedSources);
      
      return formattedSources;
    } else {
        console.log("\nNo external sources were used for this response.");
        return []; // Return an empty array if no sources
    }
  } catch (err) {
     console.log(err);
  }
};


const storyWriteAI = async (text, history, onChunk) =>{
  try {
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: history,
        config:{
            systemInstruction: "You are story writer ai. Create a beautiful and children friendly story based on user prompt. Use conversational language and emojis. Only return the story without any teasor before story or something "
        }
    });

    const result = await chat.sendMessageStream({
      message: `Generate a story: ${text}`
    });
    for await (const chunk of result) {
        const text = chunk.text;
        onChunk(text);
    }
  } catch (err) {
    console.log(err);
  }
}

const genStoryTitle = async(prompt) =>{
  try{
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Based on the following prompt, generate a suitable, relatable and meaningful story title.
                  Strictly return only the title. Prompt: ${prompt} `
    })
    const responseText = response.text
    return responseText
  } catch (err) {
     console.log(err)
  }
}

const genLessonName = async(prompt) =>{
  try{
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Based on the following prompt, generate a suitable, relatable and academic lesson title.
                  Strictly return only the title. Prompt: ${prompt} `
    })
    const responseText = response.text
    return responseText
  } catch (err) {
     console.log(err)
  }
}

const tutorAI = async (text, history, onChunk) =>{
  try {
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: history,
        config:{
            systemInstruction: "You are Que AI, personal tutor. You have to teach user a to z things about it based on the question. You can ask questions / quiz based on your answer at the ending. No other talks like casual talks or any other."
        }
    });

    const result = await chat.sendMessageStream({
      message: `Teach me this: ${text}`
    });
    for await (const chunk of result) {
        const text = chunk.text;
        onChunk(text);
    }
  } catch (err) {
    console.log(err);
  }
}


const summariseAI = async (text, onChunk) =>{
  try {
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: [],
        config:{
            systemInstruction: "You are a text summariser ai. You have to summarise the text user give to you."
        }
    });
    const result = await chat.sendMessageStream({
        message: `Summarise this text: ${text}`
    });
    for await (const chunk of result) {
        const text = chunk.text;
        onChunk(text);
    }
  } catch (error) {
    console.log(error);
  }
}

const relatedAI = async (ans) =>{
    try{
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `Based on the following answer, generate 3 meaningful and relevant
                      follow-up questions. Each question must be no longer than 6 words.
                      Return your response strictly in this format and nothing else (without blackquotes and json text at first):
                      {
                      "que1": "",
                      "que2": "",
                      "que3": ""
                      } Answer: ${ans} `
        })
        const responseText = response.text
        return responseText
  } catch (err) {
     console.log(err)
  }
}


const getTitle = async(msg) =>{
  try{
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
        Based on the message, generate a meaningful title that identifies what the message / chat is. Message: ${msg}
      `
    })
    const title = response.text
    return title
  }
  catch(err){
    console.log(err)
  }
}





export {askai, askaiStream, relatedAI, getCodeAI, summariseAI, createImageAI, getTitle, ai, storyWriteAI, tutorAI, genStoryTitle, genLessonName}