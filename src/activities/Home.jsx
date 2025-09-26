import {
  useState,
  useRef,
  useEffect
} from 'react'
import { signInWithPopup, GoogleAuthProvider , onAuthStateChanged} from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, sum } from "firebase/firestore";
import {auth, db} from '../firebase.js'
import {askai, askaiStream, relatedAI, summariseAI, createImageAI, ai, storyWriteAI, genStoryTitle, tutorAI, genLessonName} from '../Gemini.js'
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import {
  useNavigate
} from 'react-router'
import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Link } from 'react-router'
import Logo from '../assets/logosmall.png'
import Gemini from "../assets/gemini.png"
import '../css/Home.css'
import '../css/Search.css'
import '../css/loader.css'
import SearchBox from '../components/SearchBox.jsx'
import Header from '../components/Header.jsx';
import GLogo from '../assets/google-logo.png'
import LeftSideBar from '../components/LeftSideBar.jsx';
import RightSideBar from '../components/RightSideBar.jsx';
import Settings from './Settings.jsx';
import Recents from '../components/Recents.jsx';
import Toast from '../components/Toast.jsx';
import SearchTools from '../components/SearchTools.jsx';
// import Search from './Search.jsx';
import Result from './Result.jsx';
import Canvas from './Canvas.jsx';
import Gallery from './Gallery.jsx';
import Stories from './Stories.jsx';
import Lessons from './Lessons.jsx';

export default function Home() {
  
  const HomeRef = useRef(null)
  const titleRef = useRef(null)
  const smallTitleRef = useRef(null)
  const recentsTitle = useRef(null)

  const inputRef = useRef(null)
  const searchBoxRef = useRef(null)
  const introRef = useRef(null)
  const toolsRef = useRef(null)
  const resultRef = useRef(null)
  const canvasRef = useRef(null)
  const headerRef = useRef(null)
  const homeWrapperRef = useRef(null)
  const homeContainerRef = useRef(null)
  const resultTitle = useRef(null)
  const leftSidebarRef = useRef(null)
  const rightSidebarRef = useRef(null)
  const introTxt = useRef(null)
  const  searchContainerRef = useRef(null)


  const fileInputRef = useRef(null)

  const genImageWrapper = useRef(null)
  const customizeWrapper = useRef(null)
  const summariseWrapper = useRef(null)

  const loginWrapper = useRef(null)
  

  const lastElement = useRef(null)
  const ToastRef = useRef(null)


  const shouldSaveChat = useRef(false);


  const navigate = useNavigate()

  const [btnState, setBtnState] = useState(false)
  const [animactive, setAnimactive] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [customAnimEnabled, setCustomAnimEnabled] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showRecents, setShowRecents] = useState(false)
  const [showGenImage, setShowGenImage] = useState({
    show: false,
    index: 0
  })
  const [showCusAI, setShowCusAI] = useState(false)
  const [showSummarise, setShowSummarise] = useState(false)
  const [customPreferences, setCustomPreferences] = useState({})

  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [drawerCollapsed, setDrawerCollapsed] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState("")
  const [relatedQues, setRelatedQues] = useState([])
  // const [generativeModel, setGenerativeModel] = useState("2.0 Flash")
  const [proEnabled, setProEnabled] = useState(false)

  const [animState, setAnimState] = useState(true)

  const [searched, setSearched] = useState(false)

  const [messages, setMessages] = useState([])
  const [stories, setStories] = useState([])
  const [lessons, setLessons] = useState([])

  const [showGallery, setShowGallery] = useState(null)
  const [showStories, setShowStories] = useState(null)
  const [showLessons, setShowLessons] = useState(null)

  const [image, setImage] = useState(null)

  const [question, setQuestion] = useState("")
  const [placeHolder, setPlaceHolder] = useState("")

  const [onSearch, setOnSearch] = useState(false)

  const [answering, setAnswering] = useState(false)

  const [recentsChats, setRecentChats ] = useState([])

  const [canvasImages, setCanvasImages ] = useState([])



  const [galleryImages, setGalleryImages] = useState([])
  const [lessonsList, setLessonsList] = useState([])

  const [chatID, setChatID] = useState("")
  const [isLoggedIn, setLoginState] = useState(false)
  const [toolMode, setToolMode] = useState(false)
  const [toolName, setToolName] = useState("")
  const [welcomeMsgHead, setWelcomeMsgTxt] = useState("Meet Que AI")
  const [customePlaceHolder, setCustomePlaceHolder] = useState("")
  const [summarisedText, setSummarisedText] = useState("")

  const [uploadedImage, setUploadedImage] = useState(null)

  const [chats, setChats] = useState({})
  const [chatNames, setChatNames] = useState({})

  const [user, setUser] = useState(null)

  const [streamedAnswer, setStreamedAnswer] = useState("")

  const getChats = async (user) =>{
    const chatsRef = collection(db, "users", user.uid, "chats");
      const chatDocs = await getDocs(chatsRef);
      const allChats = [];
      chatDocs.forEach(doc => {
        allChats.push({ id: doc.id, ...doc.data() });
      });
      allChats.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return b.timestamp - a.timestamp
      });
      const formattedChats = allChats.map((chat, index) => ({
        title: chat.title,
        messages: chat.messages,
        index: index,
        timestamp: chat.timestamp
      }));
      setRecentChats(formattedChats);
  }

  const setChatMessages = (messages) =>{
    setSearched(true)
    setMessages(messages)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    resultRef.current.classList.add("show")
    leftSidebarRef.current.classList.add("show")
    rightSidebarRef.current.classList.add("show")
    homeWrapperRef.current.style.paddingTop = "0"
    // searchBoxRef.current.classList.add('onsearch')
    searchContainerRef.current.classList.add('onsearch')
    searchBoxRef.current.classList.remove('active')
    homeContainerRef.current.classList.add('onsearch')
    // setDrawerCollapsed(true)
    setOnSearch(true)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "u") {
        event.preventDefault();
        setAnimState(prev => !prev);
      }
      if(event.key === "Escape"){
        setShowDialog(false)
        setShowLoginDialog(false)
        setShowRecents(false)
        setShowSettings(false)
      }
      if (event.ctrlKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setDrawerCollapsed(prev => !prev)
      }
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        setShowSettings(true)
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  

  useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth, async (user)=>{
        if(user){
          setLoginState(true)
          setUser(user)

          await getChats(user)

          if (loginWrapper.current) loginWrapper.current.classList.add("hide")
          setTimeout(()=>{
            setShowLoginDialog(false)
          }, 200)

        
        }
      })
      return () => unsubscribe()
    }, [])

  useEffect(() => {
    setAnimactive(animState)
    setAnimations(animState)
  }, [animState])

  useEffect(()=>{
    const savedStories = JSON.parse(localStorage.getItem("stories")) || []
    setStories(savedStories)
  }, [])

  useEffect(()=>{
    localStorage.setItem("stories", JSON.stringify(stories))
  }, [stories])



  const getRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const getDate = () =>{
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `Date: ${day} / ${month} / ${year}, Time: ${hours}:${minutes}`;

  }

  const deleteData = async () => {
    const chatsRef = collection(db, "users", user.uid, "chats");
    const chatsSnapshot = await getDocs(chatsRef);

    const deletePromises = chatsSnapshot.docs.map((chatDoc) =>
      deleteDoc(doc(db, "users", user.uid, "chats", chatDoc.id))
    );

    await Promise.all(deletePromises);
    console.log("All chats deleted.");
  };

  const genApiEndpoint = "https://queai-backend.vercel.app/api/genImage"

  const extractJsonFromText = (text) => {
    const match = text.match(/{[^]*}/); // grabs the first { ... } block
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (err) {
      console.error("Still broken JSON:", err);
      return null;
    }
  }




  const getResult = async (history, prompt, currentTime, lang, resType, onChunk) => {

    try {

      setStreamedAnswer("")
      
      const response = await fetch('https://jude7733-queai.hf.space/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_input: (customPreferences && customPreferences.userName && customPreferences.preferences && customPreferences.describe && `Name: ${customPreferences.userName}. My preferences: ${customPreferences.preferences}. Be like: ${customPreferences.describe}` ) + (`Current Time: ${currentTime}`) + (`Prompt: ${prompt}`),
            model_name:"gemini-2.5-pro",

            
          }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Network response was not ok.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break; 
        }
        const chunk = decoder.decode(value, { stream: true });
        setStreamedAnswer((prev) => prev + chunk)
        onChunk(chunk)
      }

      setAnswering(false);
      getRelatedQues(streamedAnswer);

    } catch (err) {
      console.log(err)
      setAnswering(false)
      onChunk("An error occured. Please try again.")
    }
  }




  const getRelatedQues = async(ans)=>{
    try {
      const response = await relatedAI(ans)

      const parsed = extractJsonFromText(response)  

      if(parsed){
        setRelatedQues([parsed.que1, parsed.que2, parsed.que3])
      }
   
    } catch (err) {
      console.log(err)
    }
  }


  const genImage = async(prompt) => {
    try{
      let newIndex;
      setCanvasImages(prev => {
        newIndex = prev.length;
        return [...prev, { title: prompt, img: null }];
      });
      const img = await createImageAI(prompt);
      if(img && img.base64Data){
        setCanvasImages(prev => {
          const updated = [...prev];
          if (updated[newIndex]) {
            updated[newIndex] = { ...updated[newIndex], img };
          }
          return updated;
        });
        console.log("Image generated and set for prompt:", prompt);
        console.log(canvasImages)
      }
    } catch (err) {
      console.log("error fetching image: ", err)
    }
  }

  const [searchText, setSearchText] = useState('')
  const [searchLang, setSearchLang] = useState('English')
  const [searchMode, setSearchMode] = useState('Balanced')

  const [showLoading, setShowLoading] = useState(true)
  const [emptyChats, setEmptyChats] = useState(false)


  const showStoriesWindow = () =>{
    setSearched(true)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    resultRef.current.classList.remove("show")
    leftSidebarRef.current.classList.add("show")
    rightSidebarRef.current.classList.remove("show")
    homeWrapperRef.current.style.paddingTop = "0"
    // searchBoxRef.current.classList.add('onsearch')
    searchContainerRef.current.classList.add('onsearch')
    searchContainerRef.current.style.display = "none"
    searchBoxRef.current.classList.remove('active')
    homeContainerRef.current.classList.add('onsearch')
    setDrawerCollapsed(true)
    setOnSearch(true)
    setShowStories(true)
  }


  const [text, setText] = useState("")

  const [previewImage, setPreviewImage] = useState(null)

  const onInputChanged = (e) => {
    const inputBox = inputRef.current
    inputBox.rows = inputBox.value.split('\n').length;
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + 'px';
    // searchBoxRef.current.style.height = inputBox.scrollHeight + 30 + 'px';
    setBtnState(inputBox.value.trim().length > 0)
    setQuestion(e.target.value)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const downloadImage = (obj) =>{
    if (!obj.img) return;
    const imageName = obj.title.replaceAll(' ', "-")
    const link = document.createElement("a")
    link.href = `data:${obj.img.mimeType};base64,${obj.img.base64Data}`;
    link.download = `${imageName}.${obj.img.mimeType.split('/')[1]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };



  const generateImage = async (prompt) => {
    try {
      const base64Image = await fileToBase64(uploadedImage);
      let newIndex;
        setCanvasImages(prev => {
          newIndex = prev.length;
          return [...prev, { title: prompt, img: null, previewImg: previewImage }];
      });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: uploadedImage.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      // get back AI-generated image
      const parts = response?.candidates?.[0]?.content?.parts || [];
      let mimeType = null;
      let base64Data = null;
      for (const part of parts) {
        if (part.inlineData) {
          mimeType = part.inlineData.mimeType;
          base64Data = part.inlineData.data;
          break;
        }
      }

      if (base64Data) {
        try{
          const img = {
            mimeType: mimeType,
            base64Data: base64Data
          }
          if(img && img.base64Data){
            setCanvasImages(prev => {
              const updated = [...prev];
              if (updated[newIndex]) {
                updated[newIndex] = { ...updated[newIndex], img };
              }
              return updated;
            });
            console.log("Image generated and set for prompt:", prompt);
            console.log(canvasImages)
          }
        } catch (err) {
          console.log("error fetching image: ", err)
        }
      }
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  const handleClearChat = () =>{
    introRef.current.classList.remove("hide")
    toolsRef.current.classList.remove("hide")
    headerRef.current.classList.remove("hide")
    resultRef.current.classList.remove("show")
    canvasRef.current.classList.remove("show")
    leftSidebarRef.current.classList.remove("show")
    rightSidebarRef.current.classList.remove("show")
    homeContainerRef.current.style.paddingTop = "150px"
    searchContainerRef.current.classList.remove('onsearch')
    searchBoxRef.current.classList.add('active')
    homeContainerRef.current.classList.remove('onsearch')
    setSearched(false)
    setToolMode(false)
    setCustomePlaceHolder("")
    setToolName("") 
    setMessages([])
  }

  const showCanvasWindow = () => {
    setSearched(true)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    canvasRef.current.classList.add("show")
    leftSidebarRef.current.classList.add("show")
    // rightSidebarRef.current.classList.add("show")
    homeWrapperRef.current.style.paddingTop = "0"
    searchBoxRef.current.classList.add('onsearch')
    searchContainerRef.current.classList.add('onsearch')
    // searchBoxRef.current.classList.remove('active')
    searchBoxRef.current.classList.add("canvas")
    homeContainerRef.current.classList.add('onsearch')
    setDrawerCollapsed(true)
    setOnSearch(true)

    setToolMode(true)
    setToolName("draw")
  }


  const handleButtonClick = (que) => {

    const inputBox = inputRef.current
    inputBox.value = ''
    inputBox.rows = 1;
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + 'px';
    setBtnState(false)
    setQuestion("")

    HomeRef.current.focus()

    let prompt = que || (customPreferences && customPreferences.userName && customPreferences.preferences && customPreferences.describe && `Name: ${customPreferences.userName}. My preferences: ${customPreferences.preferences}. Be like: ${customPreferences.describe}` ) + question


    let ques = que || (question);



    if(!toolMode){

      if (!searched) {

        
        setSearched(true)
        introRef.current.classList.add("hide")
        toolsRef.current.classList.add("hide")
        toolsRef.current.classList.add("hide")
        headerRef.current.classList.add("hide")
        resultRef.current.classList.add("show")
        leftSidebarRef.current.classList.add("show")
        rightSidebarRef.current.classList.add("show")
        homeWrapperRef.current.style.paddingTop = "0"
        // searchBoxRef.current.classList.add('onsearch')
        searchContainerRef.current.classList.add('onsearch')
        searchBoxRef.current.classList.remove('active')
        homeContainerRef.current.classList.add('onsearch')
        setDrawerCollapsed(true)
        setOnSearch(true)
      }

      if(!(messages[0])){
        setChatID(getRandomString(10))
      }

      const history = []
  
      messages.map((message, index)=> {
        history.push(
          {
            role: "user",
            parts: [{
              text: message.que
            }]
          },
          {
            role: "model",
            parts: [{
              text: message.ans
            }]
          }
        )
      });
  
      shouldSaveChat.current = true;


      setMessages([...messages, {
        que: ques,
        ans: ""
      }]);
  
      setAnswering(true);
      setRelatedQues(null);

      const currentTime = getDate()

      if (proEnabled) {
        (async () => {

          let streamedAnswer = ""

          await getResult(history, prompt, currentTime, searchLang, "fast", (chunk)=>{
            streamedAnswer += chunk;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].ans += chunk;
              return updated;
            });
          })

        })()
      } else {

         (async ()=>{
            let streamedAnswer = "";
            await askaiStream("2.0 Flash", history, prompt, searchLang, currentTime, (chunk) => {
              streamedAnswer += chunk;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].ans += chunk;
                return updated;
              });
            });
            
            setAnswering(false);
            getRelatedQues(streamedAnswer);
        })()
      }

    }else{
      if(toolMode && toolName === "draw"){
        if(question.trim() !== "") {
          if(uploadedImage){
            generateImage(question)
          }else{
            genImage(question)
          }
        }
      }
      if(toolMode && toolName === "story"){
        if(question.trim() !== ""){

          (async()=>{

            setAnswering(true);

            const storyTitle = await genStoryTitle(question)
            setSearched(true)
            introRef.current.classList.add("hide")
            toolsRef.current.classList.add("hide")
            headerRef.current.classList.add("hide")
            resultRef.current.classList.add("show")
            leftSidebarRef.current.classList.add("show")
            homeWrapperRef.current.style.paddingTop = "0"
            searchContainerRef.current.classList.add('onsearch')
            homeContainerRef.current.classList.add('onsearch')
            setDrawerCollapsed(true)
            setOnSearch(true)

            const history = []
    
            stories.map((story, index)=> {
              history.push(
                {
                  role: "user",
                  parts: [{
                    text: story.title
                  }]
                },
                {
                  role: "model",
                  parts: [{
                    text: story.content
                  }]
                }
              )
            });
        
            shouldSaveChat.current = true;

              // const img = await createImageAI(storyTitle)

              setStories([...stories, {
                title: storyTitle,
                content: "",
                // image: img || {}
              }]);
          
              
              
              let streamedAnswer = "";
              await storyWriteAI( question, history, (chunk) => {
                streamedAnswer += chunk;
                setStories((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].content += chunk;
                  return updated;
                });
              });
              
              setAnswering(false);
          })()
        }
      }
      if(toolMode && toolName === "learn"){
        if(question.trim() !== ""){
          (async () =>{
            setAnswering(true);
            const lessonName = lessons[0]?.que ? question : await genLessonName(question) 

            setSearched(true)
            introRef.current.classList.add("hide")
            toolsRef.current.classList.add("hide")
            headerRef.current.classList.add("hide")
            resultRef.current.classList.add("show")
            leftSidebarRef.current.classList.add("show")
            homeWrapperRef.current.style.paddingTop = "0"
            searchContainerRef.current.classList.add('onsearch')
            homeContainerRef.current.classList.add('onsearch')
            setDrawerCollapsed(true)
            setOnSearch(true)
  
            const history = []
    
            lessons.map((lesson, index)=> {
              history.push(
                {
                  role: "user",
                  parts: [{
                    text: lesson.que
                  }]
                },
                {
                  role: "model",
                  parts: [{
                    text: lesson.ans
                  }]
                }
              )
            });
        
            shouldSaveChat.current = true;
  
  
            setLessons([...lessons, {
              que: lessonName,
              ans: ""
            }]);
              
            let streamedAnswer = "";
            await tutorAI( question, history, (chunk) => {
              streamedAnswer += chunk;
              setLessons((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].ans += chunk;
                return updated;
              });
            });
            
            setAnswering(false);
          })()
        }
      }
      if(toolMode && toolName === "code"){
        if(question !== "") {
          navigate(`/createProject?prompt=${question}`)
        }
      }
      if(toolMode && toolName === "summarise"){
        if(question !== "") {
          setShowSummarise(true);
          (async()=>{
            try {
              await summariseAI(question, (chunk)=>{
                setSummarisedText((prev) => {
                  const text = prev + chunk
                  return text
                })
              })
            } catch (err) {
              console.log(err);
            }
          })()
        }
      }
    }
  }

  return (
    <>
      <div ref={HomeRef} className="home" style={{
        background: !animations && "var(--main-bg)"
      }} >
        <div ref={homeWrapperRef} className={`home-wrapper ${animations && "anim"}`}>
          <LeftSideBar
            ref={leftSidebarRef}
            drawerCollapsed={drawerCollapsed}
            setDrawerCollapsed={setDrawerCollapsed}
            searched={searched}
            onSearch={onSearch}
            isLoggedIn={isLoggedIn}
            setShowSettings={setShowSettings}
            recentsChats={recentsChats}
            setChatMessages={setChatMessages}
            setMessages={setMessages}
            shouldSaveChat={shouldSaveChat}
            handleClearChat={handleClearChat}
            showStoriesWindow={showStoriesWindow}
            showCanvasWindow={showCanvasWindow}
          />
            <div ref={homeContainerRef} style={{
              padding: searched ? (window.innerWidth < 768 ? "0" : (drawerCollapsed && searched ? (animations ? "10px 10px 10px 10px" : "0 0 0 80px") : (animations ? "10px 10px 10px 0" : "0 0 0 0"))) : "150px 0 0"
            }} className="homeContainer" >
              <Header
                ref={headerRef}
                drawerCollapsed={drawerCollapsed}
                setDrawerCollapsed={setDrawerCollapsed}
                leftSidebarRef={leftSidebarRef}
                isLoggedIn={isLoggedIn}
                setShowRecents={setShowRecents}
                setShowLoginDialog={setShowLoginDialog}
                user={user}
                setShowSettings={setShowSettings}
                setLoginState={setLoginState}
                setShowDialog={setShowDialog}
                setShowCusAI={setShowCusAI}
                setAnimations={setAnimations}
                animations={animations}
                setAnimState={setAnimState}
                animState={animState}
              />
              <div ref={introRef} className="intro">
                <h1 ref={introTxt} className='introTxt' >{welcomeMsgHead}</h1>
                <p>Your personal AI, ready to help you think better and move faster.</p>
                <p>From B. Voc. Software Development</p>
              </div>
              <Result 
                ref={resultRef}
                introRef={introRef}
                toolsRef={toolsRef}
                headerRef={headerRef}
                resultTitle={resultTitle}
                leftSidebarRef={leftSidebarRef}
                rightSidebarRef={rightSidebarRef}
                homeContainerRef={homeContainerRef}
                searchBoxRef={searchBoxRef}
                setSearched={setSearched}
                messages={messages}
                stories={stories}
                lessons={lessons}
                toolMode={toolMode}
                toolName={toolName}
                lastElement={lastElement}
                chatID={chatID}
                setChatID={setChatID}
                setChats={setChats}
                getRandomString={getRandomString}
                chats={chats}
                searchContainerRef={searchContainerRef}
                setShowToast={setShowToast}
                setToastText={setToastText}
                ToastRef={ToastRef}
                answering={answering}
                user={user}
                getChats={getChats}
                shouldSaveChat={shouldSaveChat}
                setMessages={setMessages}
                relatedQues={relatedQues}
                handleButtonClick={handleButtonClick}
                handleClearChat={handleClearChat}
                // generativeModel={generativeModel}
                // setGenerativeModel={setGenerativeModel}
              />

              <Canvas 
                ref={canvasRef}
                handleClearChat={handleClearChat}
                canvasImages={canvasImages}
                setCanvasImages={setCanvasImages}
                setShowGenImage={setShowGenImage}
                downloadImage={downloadImage}
              />

              {
                showGallery &&
                <Gallery />
              }
              {
                showStories &&
                <Stories 
                  stories={stories}
                />
              }
              {
                showLessons &&
                <Lessons />
              }

              <SearchBox
                ref={searchBoxRef}
                inputRef={inputRef}
                handleInputChange={onInputChanged}
                handleButtonClick={handleButtonClick}
                btnState={btnState}
                answering={answering}
                animactive={animactive}
                setAnimactive={setAnimactive}
                setOnSearch={setOnSearch}
                searched={searched}
                placeHolder= {customePlaceHolder !== "" ? customePlaceHolder : "Ask anything..."}
                onKeyDown={handleButtonClick}
                setBtnState={setBtnState}
                onLangChanged={setSearchLang}
                toolMode={toolMode}
                toolName={toolName}
                setToolMode={setToolMode}
                searchContainerRef={searchContainerRef}
                proEnabled={proEnabled}
                setProEnabled={setProEnabled}
                onSearch={onSearch}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                uploadedImage={uploadedImage}
                previewImage={previewImage}
                generateImage={generateImage}
                setCustomePlaceHolder={setCustomePlaceHolder}
              />  
              <SearchTools
                ref={toolsRef}
                setQuestion={setQuestion}
                inputRef={inputRef}
                setBtnState={setBtnState}
                setToolMode={setToolMode}
                setToolName={setToolName}
                setAnimactive={setAnimactive}
                animState={animState}
                showCanvasWindow={showCanvasWindow}      
                setCustomePlaceHolder={setCustomePlaceHolder}          

              />
            </div>

            <RightSideBar
              ref={rightSidebarRef}
              drawerCollapsed
              setDrawerCollapsed
              searched
              onSearch
              isLoggedIn
              setShowSettings
              Logo={Logo}
              relatedQues={relatedQues}
              setQuestion={setQuestion}
              handleButtonClick={handleButtonClick}
              question={question}
            />

          </div>

        <div className={`bg-wrapper ${toolMode && (toolName == "draw" && "red" || toolName == "code" && "green" || toolName == "summarise" && "blue" || toolName == "story" && "purple" || toolName == "learn" && "yellow" )} ${animations ? "active" : "inactive"}`}>
          <div className="box">
            {/* <div className="neon1"></div> */}
          </div>
          {/* <div className="box2">
            <div className="neon2"></div>
          </div> */}
        </div>
        {
          showSettings && 
          <Settings
            animations={animations}
            setShowSettings={setShowSettings} 
            setAnimState={setAnimState} 
            animState={animState}
            Logo={Logo}
            user={user}
            isLoggedIn={isLoggedIn}
            setShowLoginDialog={setShowLoginDialog}
            auth={auth}
            setUser={setUser}
            setLoginState={setLoginState}
            customAnimEnabled={customAnimEnabled}
            setCustomAnimEnabled={setCustomAnimEnabled}
            customPreferences={customPreferences}
            setCustomPreferences={setCustomPreferences}
            deletedata={deleteData}
          />
        }
        {
          showRecents &&
          <Recents 
            setShowRecents={setShowRecents}
            setShowDialog={setShowDialog}
            recentsChats={recentsChats}
            setChatMessages={setChatMessages}
          /> 
        }
        {
          showGenImage.show &&
          <div className='genImageContainer' >
            <div className="genImageWrapper" ref={genImageWrapper}>
              <div className="genImageHeader">
                <h2>Generate image</h2>
                <div className="btn-container">
                  {
                    canvasImages[showGenImage.index].img && <div className="download-btn btn" onClick={()=> downloadImage(canvasImages[showGenImage.index])}>
                    <span className="material-symbols-outlined">download</span>
                  </div>
                  } 
                  <div className="close-btn btn" onClick={() =>{
                    genImageWrapper.current.classList.add("hide")
                    setTimeout(()=>{
                      setShowGenImage({
                        show: false,
                        index: 0
                      })
                    }, 200)
                    }} >
                      <span className="material-symbols-outlined">close</span>
                  </div>
                </div>
              </div>
              <div className="genImageBody">
                  <img
                    src={`data:${canvasImages[showGenImage.index].img.mimeType};base64,${canvasImages[showGenImage.index].img.base64Data}`}
                    alt="Generated"
                  />
              </div>
            </div>
          </div>
        }

        {
          showLoginDialog && 
          <div className="loginContainer">
            <div className="loginWrapper" ref={loginWrapper}>
              <div className="loginHeader">
                <h2> </h2>
                <div className="btn-container">                  
                  <div className="close-btn btn" onClick={() =>{
                    loginWrapper.current.classList.add("hide")
                    setTimeout(()=>{
                      setShowLoginDialog(false)
                    }, 200)
                    }} >
                      <span className="material-symbols-outlined">close</span>
                  </div>
                </div>
              </div>
              <div className="loginBody">
                <h1 style={{
                  textAlign: "center", 
                  fontSize: "2.4em", 
                  fontFamily: "GeneralSans-SemiBold",
                  fontWeight: "100"
                }}>Sign in into Que AI</h1>
                <p style={{
                  textAlign: "center", 
                  marginTop: "15px", 
                  fontSize: "18px",
                  fontFamily: "GeneralSans-Medium",
                  opacity: "0.8"
                }}>Sign in to save your chats, sync settings, and more.</p>

                <div className="loginBox" style={{
                  height: "200px",
                  display: "flex", 
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <div className="googlLoginBox" onClick={async (e) =>{
                    e.target.style.opacity = "0.7"
                        setTimeout(() => {
                            e.target.style.opacity = "1"
                        }, 200);
                    const provider = new GoogleAuthProvider()

                    try{
                      const result = await signInWithPopup(auth, provider)
                      const user = result.user;
                      try {
                        const docRef = doc(db, "users", user.uid)
                        const docSnap = await getDoc(docRef)
                        if(docSnap.exists){
                          console.log("Doc data: ", docSnap.data())
                        }
                      } catch (err) {
                        console.log(err)
                      } 
                      setLoginState(true)
                    } catch (err){
                      console.log("error signin:", err)
                    }
                  }}>
                    <img src={GLogo} alt="" style={{
                      width: "20px", 
                      height: "20px"
                    }} />
                    <p>Continue with Google</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {
          showCusAI && 
          <div className="customizeContainer">
            <div className="customizeWrapper" ref={customizeWrapper}>
              <div className="customizeHeader">
                <h2>Customize Que AI</h2>
                <div className="close-btn btn" onClick={() =>{
                  customizeWrapper.current.classList.add("hide")
                  setTimeout(()=>{
                    setShowCusAI(false)
                  }, 200)
                  }} >
                    <span className="material-symbols-outlined">close</span>
                </div>
              </div>
              <div className="customizeBody">
                  <p>Name your AI</p>
                  <input type="text" placeholder='Name your AI' />
                  <p>System instructions</p>
                  <textarea name="" id="" placeholder='System instructions' rows={"1"}></textarea>
              </div>
            </div>
          </div>
        }
        {
          showSummarise && 
          <div className="summariseContainer">
            <div className="summariseWrapper" ref={summariseWrapper}>
              <div className="summariseHeader">
                <h2>Summarise text</h2>
                <div className="close-btn btn" onClick={() =>{
                  summariseWrapper.current.classList.add("hide")
                  setTimeout(()=>{
                    setShowSummarise(false)
                    setSummarisedText("")
                  }, 200)
                  }} >
                    <span className="material-symbols-outlined">close</span>
                </div>
              </div>
              <div className="summariseBody">
                {
                  summarisedText && summarisedText !== "" ? (
                    <div className='resans markdown-output' >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summarisedText}
                      </ReactMarkdown>
                    </div>
                   
                  ) : (
                   <>
                      <div className='loadingBars'>
                        <div className='loadingBar' />
                        <div className='loadingBar' />
                        <div className='loadingBar' />
                      </div>
                    </>
                  )
                }
                
              </div>
            </div>
          </div>
        }

        { showToast &&
          <Toast ref={ToastRef} text={toastText} />
        }
        

        

      </div>
    </>
  )
}
