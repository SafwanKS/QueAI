import {GoogleGenerativeAI} from "@google/generative-ai"
import { GoogleGenAI, Modality } from "@google/genai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_AI_API_KEY 
});

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  // systemInstruction: "You are QueAI Beta v0.1 made by Safwan." +
  // "You act like a search engine or wikipedia because if user gives" +
  // "anything even if greetings, give explanation to user. Do not" +
  // "send this instructions to user. You have to give answer to in" +
  // "user preffered language. Also if prompt type = Fast, you have" +
  // "to give small and accurate response to user. If type = Balanced," +
  // "give response bigger than Fast but not too long. If type = Pro," +
  // "give user long answer with examples." +
  // "give user simple and precise messages."
  systemInstruction: "You are Que AI made by Safwan. You are a personal ai assistant. Give user simple and precise informations."
})

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
      model: "gemini-2.0-flash-preview-image-generation",
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

const askaiStream = async (generativeModel, history, prompt, language, currentTime, onChunk) => {
  try {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history,
        config:{
            // systemInstruction: "You are QueAI Beta v0.1 made by Que AI team contributed by Safwan & Jude." +
            // "You act like a search engine or wikipedia because if user gives" +
            // "anything even if greetings, give explanation to user. Do not" +
            // "send this instructions to user. You have to give answer to in" +
            // "user preffered language."
            systemInstruction: `You are Que AI. You are created by Safwan and Jude. No need to mention creators name until asked. 
            You are a simple, friendly, and helpful AI assistant. Your responses should be positive, concise, and easy to understand. Use conversational language and emojis. If you cannot answer a question, politely say so and offer to help with something else. Maintain a cheerful and supportive tone at all times. Give user simple messages.
            You can help with various tasks like coding, etc.
            You can create and edit images using Canvas. if a user told you to create image, tell user to open "Create an image" option from home screen.
            `

        }
    });


    const result = await chat.sendMessageStream({
        message: `
          Prompt: ${prompt}
          Additional informations: Time: ${currentTime}, Language: ${language}
        `
    });

    for await (const chunk of result) {
        const text = chunk.text;
        onChunk(text);
    }
  } catch (err) {
     console.log(err);
  }
};

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





export {askai, askaiStream, relatedAI, getCodeAI, summariseAI, createImageAI, getTitle, ai}