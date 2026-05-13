import {
  useState,
  useRef,
  useEffect,
} from 'react'
import { useParams, useLocation } from 'react-router'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, sum } from "firebase/firestore";
import { auth, db } from '../firebase.js'
import { askaiStream, relatedAI, summariseAI, storyWriteAI, genStoryTitle, tutorAI, genLessonName } from '../Gemini.js'
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import {
  useNavigate
} from 'react-router'

import Logo from '../assets/logosmall.png'
import animation from '../assets/animation.gif'
import '../css/Home.css'
import '../css/Search.css'
import '../css/loader.css'
import SearchBox from '../components/SearchBox.jsx'
import Header from '../components/Header.jsx';
import GLogo from '../assets/google-logo.png'
import LeftSideBar from '../components/LeftSideBar.jsx';
import Settings from './Settings.jsx';
import Recents from '../components/Recents.jsx';
import Toast from '../components/Toast.jsx';
import SearchTools from '../components/SearchTools.jsx';
import Result from './Result.jsx';
import Canvas from './Canvas.jsx';
import Gallery from './Gallery.jsx';
import Stories from './Stories.jsx';
import Lessons from './Lessons.jsx';
import Library from './Library.jsx';
import BottomNav from '../components/BottomNav.jsx';
import Suggestions from '../components/Suggessions.jsx';
import SearchChats from '../components/SearchChats.jsx';
import { RenameDialog, DeleteDialog, InfoDialog } from '../components/Dialog.jsx';

export default function Home() {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoginState(true)
        setUser(user)
        localStorage.setItem("userState", JSON.stringify(true))
        localStorage.setItem("userData", JSON.stringify(user))
        await getChats(user)
        if (loginWrapper.current) loginWrapper.current.classList.add("hide")
        setTimeout(() => {
          setShowLoginDialog(false)
        }, 200)
      } else {
        setLoginState(false)
        setUser(null)
        localStorage.setItem("userState", JSON.stringify(false))
        localStorage.setItem("userData", JSON.stringify(null))
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const location = useLocation()
  const navigate = useNavigate()

  const HomeRef = useRef(null)
  const inputRef = useRef(null)
  const searchBoxRef = useRef(null)
  const introRef = useRef(null)
  const toolsRef = useRef(null)
  const suggestionsRef = useRef(null)
  const resultRef = useRef(null)
  const canvasRef = useRef(null)
  const libraryRef = useRef(null)
  const headerRef = useRef(null)
  const homeWrapperRef = useRef(null)
  const homeContainerRef = useRef(null)
  const resultTitle = useRef(null)
  const leftSidebarRef = useRef(null)
  const searchContainerRef = useRef(null)


  const loginWrapper = useRef(null)
  const projectCreateWrapper = useRef(null)


  const lastElement = useRef(null)
  const toastRef = useRef(null)


  const shouldSaveChat = useRef(false);

  const welcomeMsgTitle = useRef(null)
  const welcomeMsgSubtitle = useRef(null)

  const [openedChatID, setOpenedChatID] = useState("")

  const fileInputRef = useRef(null)

  const genImageWrapper = useRef(null)
  const customizeWrapper = useRef(null)
  const summariseWrapper = useRef(null)
  const sourcesWrapper = useRef(null)

  const [user, setUser] = useState(null)

  const [authLoading, setAuthLoading] = useState(true)

  const [isLoggedIn, setLoginState] = useState(false)

  const [showSummarise, setShowSummarise] = useState(false)
  const [showSources, setShowSources] = useState(false)

  const [customPreferences, setCustomPreferences] = useState({})

  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [drawerCollapsed, setDrawerCollapsed] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState("")
  const [relatedQues, setRelatedQues] = useState([])
  const [proEnabled, setProEnabled] = useState(false)

  const [animState, setAnimState] = useState(true)

  const [searched, setSearched] = useState(false)

  const [messages, setMessages] = useState([])
  const [stories, setStories] = useState([])
  const [lessons, setLessons] = useState([])

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState([])

  const [showGallery, setShowGallery] = useState(null)
  const [showStories, setShowStories] = useState(null)
  const [showLessons, setShowLessons] = useState(null)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)

  const [question, setQuestion] = useState("")

  const [onSearch, setOnSearch] = useState(false)

  const [drawerOpened, setDrawerOpened] = useState(false)

  const [answering, setAnswering] = useState(false)

  const [recentsChats, setRecentChats] = useState([])

  const [canvasImages, setCanvasImages] = useState([])

  const [darkmode, setDarkmode] = useState(false)
  const [useBlack, setUseBlack] = useState(false)


  const [selectedModel, setSelectedModel] = useState("smart")

  const [galleryImages, setGalleryImages] = useState([])
  const [lessonsList, setLessonsList] = useState([])
  const [storiesList, setStoriesList] = useState([])

  const [chatID, setChatID] = useState("")
  const [tempChatID, setTempChatID] = useState("")

  const [chatTitle, setChatTitle] = useState("")

  const isNewChat = useRef(false)

  const [toolMode, setToolMode] = useState(false)
  const [toolName, setToolName] = useState("")
  const [customePlaceHolder, setCustomePlaceHolder] = useState("")
  const [summarisedText, setSummarisedText] = useState("")

  const [uploadedImage, setUploadedImage] = useState(null)

  const [chats, setChats] = useState({})
  const [searchLang, setSearchLang] = useState('English')

  const [previewImage, setPreviewImage] = useState(null)
  const [sources, setSources] = useState([])



  const [btnState, setBtnState] = useState(false)
  const [customAnimEnabled, setCustomAnimEnabled] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showRecents, setShowRecents] = useState(false)
  const [showProjectCreation, setShowProjectCreation] = useState(false)
  const [showGenImage, setShowGenImage] = useState({
    show: false,
    index: 0
  })

  const [showSearchChats, setShowSearchChats] = useState(false)
  const [knowledgeAvailable, setKnowledgeAvailable] = useState([])

  useEffect(() => {

    if (!user || knowledgeAvailable.length === 0) return

    const saveKnowledge = async () => {
      const docRef = doc(db, "users", user.uid, "profile", "knowledge")
      await setDoc(docRef, {
        knowledge: knowledgeAvailable,
        updatedAt: Date.now()
      }, { merge: true })
    }
    saveKnowledge()
  }, [knowledgeAvailable])

  useEffect(() => {
    if (!user || !isLoggedIn) return
    const fetchKnowledge = async () => {
      const docRef = doc(db, "users", user.uid, "profile", "knowledge")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setKnowledgeAvailable(docSnap.data().knowledge)
      }
    }
    fetchKnowledge()
  }, [user, isLoggedIn])

  useEffect(() => {
    if (location.pathname === "/") {
      handleClearChat()
      introRef.current.classList.remove("invisible")
      toolsRef.current.classList.remove("invisible")
      headerRef.current.classList.remove("invisible")
    }
    if (location.pathname === "/library") {
      showLibraryWindow()
    }
  }, [location.pathname])

  useEffect(() => {
    if (location.hash === "#settings") {
      setShowSettings(true)
    } else if (location.hash === "#login") {
      if (isLoggedIn) {
        navigate("/")
        location.hash = ""
      } else {
        setShowLoginDialog(true)
      }
    } else {
      // setShowSettings(false)
    }
  }, [location.hash])

  useEffect(() => {
    setDarkmode(JSON.parse(localStorage.getItem("darkmode")))
    setUseBlack(JSON.parse(localStorage.getItem("useBlack")))
    if (darkmode) {
      document.body.style.backgroundColor = useBlack ? "#000" : "#01050d"
    } else {
      document.body.style.backgroundColor = "white"
    }
    setUser(JSON.parse(localStorage.getItem("userData")))
    setLoginState(JSON.parse(localStorage.getItem("userState")))
  }, [darkmode, useBlack])

  const getChats = async (user) => {
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
      id: chat.id,
      title: chat.title,
      messages: chat.messages,
      index: index,
      timestamp: chat.timestamp
    }));
    setRecentChats(formattedChats);

    const storiesRef = collection(db, "users", user.uid, "stories");
    const storyDocs = await getDocs(storiesRef);
    const allStories = [];
    storyDocs.forEach(doc => {
      allStories.push({ id: doc.id, ...doc.data() });
    });
    allStories.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return b.timestamp - a.timestamp
    });
    const formattedStories = allStories.map((story, index) => ({
      title: story.title,
      content: story.content,
      index: index,
      timestamp: story.timestamp,
      id: story.id
    }));
    setStoriesList(formattedStories);
    // console.log(formattedStories);

    // const lessonsRef = collection(db, "users", user.uid, "library", "lessons");
    // const lessonDocs = await getDocs(lessonsRef);
    // const allLessons = [];
    // lessonDocs.forEach(doc => {
    //   allLessons.push({ id: doc.id, ...doc.data() });
    // });
    // allLessons.sort((a, b) => {
    //   if (!a.timestamp || !b.timestamp) return 0;
    //   return b.timestamp - a.timestamp
    // });
    // const formattedLessons = allLessons.map((lesson, index) => ({
    //   id: lesson.id,
    //   title: lesson.title,
    //   messages: lesson.messages,
    //   index: index,
    //   timestamp: lesson.timestamp
    // }));
    // setLessonsList(formattedLessons);
  }

  const setChatMessages = (chat) => {
    setSearched(true)
    setMessages(chat.messages)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    libraryRef.current.classList.remove("show")
    resultRef.current.classList.add("show")
    leftSidebarRef.current.classList.add("show")
    homeWrapperRef.current.style.paddingTop = "0"
    searchContainerRef.current.classList.add('onsearch')
    searchBoxRef.current.classList.remove('active')
    homeContainerRef.current.classList.add('onsearch')
    // setDrawerCollapsed(true)
    setChatTitle(chat.title)
    setOnSearch(true)
    setToolMode(false)
    setToolName(null)
    searchContainerRef.current.classList.remove('hide')
  }

  const welcomeMsg = {
    code: `What do you want to <span class="material-symbols-outlined"> code </span> code today?`,
    summarise: `What do you want to <span class="material-symbols-outlined"> assignment </span> Summarise?`,
    story: `Write a <span class="material-symbols-outlined"> ink_pen </span> Story`,
    learn: `What do you want to <span class="material-symbols-outlined"> school </span> Learn today?`
  }

  useEffect(() => {
    if (toolMode) {
      welcomeMsgSubtitle.current?.classList.add("fadeOut")
      setTimeout(() => {
        welcomeMsgSubtitle.current.classList.remove("fadeOut")
        welcomeMsgSubtitle.current.innerHTML = welcomeMsg[toolName]
        welcomeMsgSubtitle.current.classList.add("fadeIn")
        setTimeout(() => {
          welcomeMsgSubtitle.current.classList.remove("fadeIn")
        }, 100);
      }, 300);
    } else {
      welcomeMsgSubtitle.current?.classList.add("fadeOut")
      setTimeout(() => {
        welcomeMsgSubtitle.current?.classList.remove("fadeOut")
        welcomeMsgSubtitle.current.textContent = user && isLoggedIn ? "How can i help you today?" : "Your personal AI, ready to help you think better and move faster."
        welcomeMsgSubtitle.current?.classList.add("fadeIn")
        setTimeout(() => {
          welcomeMsgSubtitle.current?.classList.remove("fadeIn")
        }, 100);
      }, 300);

    }
  }, [toolMode, toolName, user])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "u") {
        event.preventDefault();
        setDarkmode(prev => !prev);
        localStorage.setItem("darkmode", JSON.stringify(!darkmode))
        return
      }
      if (event.key === "Escape") {
        setShowDialog(false)
        setShowLoginDialog(false)
        setShowRecents(false)
        setShowSettings(false)
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        handleClearChat()
        navigate('/')
        return
      }
      if (event.ctrlKey && !event.altKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setDrawerCollapsed(prev => !prev)
        return
      }
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        // setRightSideBarCollapsed(prev => !prev)
        return
      }
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        navigate('/#settings')
        return
      }
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!user || !isLoggedIn) return;
        setShowSearchChats(true)
        return
      }
      if (!event.ctrlKey && event.key && event.key.length === 1 && !showSearchChats && document.activeElement !== inputRef.current) {
        if (showRenameDialog) return;
        event.preventDefault();
        inputRef.current.focus();
        inputRef.current.value = (inputRef.current.value || "") + event.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoggedIn, user, showSearchChats, showRenameDialog]);

  const getRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const getDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
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

  const getResult = async (chatID, history, prompt, currentTime, lang, resType, onChunk) => {
    try {
      // setStreamedAnswer("")
      setAnswering(true)
      const response = await fetch("https://jude7733-queai.hf.space/chat/stream", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: (customPreferences && customPreferences.userName && customPreferences.preferences && customPreferences.describe && `Name: ${customPreferences.userName}. My preferences: ${customPreferences.preferences}. Be like: ${customPreferences.describe}`) + (`Current Time: ${currentTime}`) + (`Prompt: ${prompt}`),
          thread_id: chatID
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Network response was not ok.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const recievedChunk = JSON.parse(chunk)

        const message = recievedChunk.messages
          .filter(m => m.type === "ai")
          .pop()?.content

        onChunk(message)
        console.log(chunk);

      }

      setAnswering(false);

    } catch (err) {
      console.error(err)
      setAnswering(false)
      onChunk("An error occured. Please try again.")
    }
  }

  const genImage = async (prompt) => {
    try {
      let newIndex;
      setCanvasImages(prev => {
        newIndex = prev.length;
        return [...prev, { title: prompt, img: null }];
      });
      const img = await createImageAI(prompt);
      if (img && img.base64Data) {
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


  const showStoriesWindow = async (urlStoryID) => {

    const docRef = doc(db, "users", user.uid, "stories", urlStoryID)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const story = docSnap.data()
      setStories([{ title: story.title, content: story.content, type: "story" }])
    } else {
      console.log("Story not found")
      navigate('/')
      return;
    }

    setSearched(true)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    resultRef.current.classList.add("show")
    libraryRef.current.classList.remove("show")
    canvasRef.current.classList.remove("show")
    leftSidebarRef.current.classList.add("show")
    homeWrapperRef.current.style.paddingTop = "0"
    searchContainerRef.current.classList.add('hide')
    homeContainerRef.current.classList.add('onsearch')
    setDrawerCollapsed(true)
    setOnSearch(true)
    setToolMode(true)
    setToolName("story")
    // setShowStories(true)
  }


  const showLessonsWindow = () => {
    setSearched(true)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    resultRef.current.classList.add("show")
    canvasRef.current.classList.remove("show")
    leftSidebarRef.current.classList.add("show")
    homeWrapperRef.current.style.paddingTop = "0"
    searchContainerRef.current.classList.add('onsearch')
    searchBoxRef.current.classList.remove('active')
    homeContainerRef.current.classList.add('onsearch')
    setDrawerCollapsed(true)
    setOnSearch(true)
    setToolMode(true)
    setToolName("learn")
    // setShowStories(true)
  }




  const onInputChanged = (e) => {
    const inputBox = inputRef.current
    inputBox.rows = inputBox.value.split('\n').length;
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + 'px';
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

  const downloadImage = (obj) => {
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
        try {
          const img = {
            mimeType: mimeType,
            base64Data: base64Data
          }
          if (img && img.base64Data) {
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

  const generateStory = (que) => {
    const prompt = que || question
    if (prompt.trim() !== "") {
      (async () => {
        setAnswering(true);
        const story = await storyWriteAI(prompt)
        setStories([{
          title: story.name,
          content: story.content,
          type: "story"
        }]);
        setStoriesList(prev => [
          {
            title: story.name,
            content: story.content
          }
          , ...prev]);

        const storyID = getRandomString(16);

        if (user && isLoggedIn) {
          try {
            await setDoc(doc(db, "users", user.uid, "stories", storyID), {
              title: story.name,
              content: story.content,
              timestamp: Date.now()
            });
            console.log("Story saved to DB");
          } catch (err) {
            console.error("Error saving story:", err);
          }
        }

        setAnswering(false);
        setSearched(true)
        introRef.current.classList.add("hide")
        toolsRef.current.classList.add("hide")
        setShowSuggestions(false)
        headerRef.current.classList.add("hide")
        resultRef.current.classList.add("show")
        leftSidebarRef.current.classList.add("show")
        homeWrapperRef.current.style.paddingTop = "0"
        searchContainerRef.current.classList.add('hide')
        homeContainerRef.current.classList.add('onsearch')
        setDrawerCollapsed(true)
        setOnSearch(true)

        shouldSaveChat.current = true

        if (user && isLoggedIn) navigate(`/story/${storyID}`)

      })();
    }
  }

  const handleClearChat = () => {
    navigate('/')
    introRef.current.classList.remove("hide")
    toolsRef.current.classList.remove("hide")
    headerRef.current.classList.remove("hide")
    resultRef.current.classList.remove("show")
    canvasRef.current.classList.remove("show")
    libraryRef.current.classList.remove("show")
    leftSidebarRef.current.classList.remove("show")
    // rightSidebarRef.current.classList.remove("show")
    // homeContainerRef.current.style.paddingTop = "150px"
    searchContainerRef.current.classList.remove('onsearch')
    searchContainerRef.current.classList.remove('hide')
    // searchBoxRef.current.classList.add('active') 
    homeContainerRef.current.classList.remove('onsearch')
    setSearched(false)
    setToolMode(false)
    setCustomePlaceHolder("")
    setToolName("")
    setChatTitle("")
    setMessages([])
    setOpenedChatID("")
    setShowSuggestions(false)
    setSuggestionsList([])
  }

  const showCanvasWindow = () => {
    setSearched(true)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    resultRef.current.classList.remove("show")
    canvasRef.current.classList.add("show")
    libraryRef.current.classList.remove("show")
    leftSidebarRef.current.classList.add("show")
    homeWrapperRef.current.style.paddingTop = "0"
    searchBoxRef.current.classList.add('onsearch')
    searchContainerRef.current.classList.add('onsearch')
    searchBoxRef.current.classList.add("canvas")
    homeContainerRef.current.classList.add('onsearch')
    setDrawerCollapsed(true)
    setOnSearch(true)
    setToolMode(true)
    setToolName("draw")
  }

  const showLibraryWindow = () => {
    navigate('/library')
    setSearched(true)
    introRef.current.classList.add("hide")
    toolsRef.current.classList.add("hide")
    headerRef.current.classList.add("hide")
    resultRef.current.classList.remove("show")
    libraryRef.current.classList.add("show")
    canvasRef.current.classList.remove("show")
    leftSidebarRef.current.classList.add("show")
    homeWrapperRef.current.style.paddingTop = "0"
    searchBoxRef.current.classList.add('hide')
    searchContainerRef.current.classList.add('hide')
    // searchBoxRef.current.classList.add("canvas")
    homeContainerRef.current.classList.add('onsearch')
    // setDrawerCollapsed(true)
    // setOnSearch(true)
    setToolMode(false)
  }

  const { chatID: urlChatID } = useParams()

  useEffect(() => {
    if (isNewChat.current) {
      return
    }
    if (authLoading) return
    if (urlChatID && user) {
      const loadChat = async () => {
        const docRef = doc(db, "users", user.uid, "chats", urlChatID)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const chat = docSnap.data()
          setChatMessages(chat)
          setChatID(urlChatID)
        } else {
          console.log("Chat not found")
          navigate('/')
        }
      }
      loadChat()
    } else if (!user) navigate("/")
  }, [urlChatID, user, authLoading])

  const { storyID: urlStoryID } = useParams()

  useEffect(() => {
    if (!urlStoryID || !user || authLoading) return;
    showStoriesWindow(urlStoryID)
  }, [urlStoryID, user, authLoading])


  const handleButtonClick = (que) => {

    const inputBox = inputRef.current
    inputBox.value = ''
    inputBox.rows = 1;
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + 'px';
    setBtnState(false)
    setQuestion("")
    setShowSuggestions(false)

    setDrawerOpened(false)

    HomeRef.current.focus()

    let prompt = que || question

    let ques = que || (question);

    if (!toolMode) {

      if (!searched) {

        setSearched(true)
        introRef.current.classList.add("hide")
        toolsRef.current.classList.add("hide")
        toolsRef.current.classList.add("hide")
        headerRef.current.classList.add("hide")
        resultRef.current.classList.add("show")
        leftSidebarRef.current.classList.add("show")
        homeWrapperRef.current.style.paddingTop = "0"
        searchContainerRef.current.classList.add('onsearch')
        searchBoxRef.current.classList.remove('active')
        homeContainerRef.current.classList.add('onsearch')
        setDrawerCollapsed(true)
        setOnSearch(true)
      }

      if (!(messages[0])) {
        const newChatID = getRandomString(16)
        setChatID(newChatID)
        isNewChat.current = true
        navigate(`/chat/${newChatID}`)
      }

      const history = []

      messages.map((message, index) => {
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
        type: "chat",
        que: ques,
        ans: "",
        reasoning: "",
        sources: [],
        model: "",
        steps: [],
        timestamp: Date.now()
      }]);

      setAnswering(true);
      setRelatedQues(null);

      const currentTime = getDate()

      if (proEnabled) {
        (async () => {

          let streamedAnswer = ""

          await getResult(chatID, history, prompt, currentTime, searchLang, "fast", (chunk) => {
            streamedAnswer += chunk;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].ans += chunk;
              return updated;
            });
          })

        })()
      } else {

        (async () => {
          let streamedAnswer = "";
          await askaiStream(selectedModel, history, knowledgeAvailable, prompt, searchLang, currentTime,
            (chunk) => {
              streamedAnswer += chunk;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].ans += chunk;
                return updated;
              });
            },
            (reasoningChunk) => {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].reasoning += reasoningChunk;
                return updated;
              });
            },
            (model) => {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].model = model;
                return updated;
              });
            },
            (knowledge) => {
              setKnowledgeAvailable((prev) => {
                const updated = [...prev];
                updated.push(knowledge);
                return updated;
              });
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].infoSaved = {
                  saved: true,
                  data: knowledge
                }
                return updated;
              })
            },
            (images) => {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].images = JSON.parse(images);
                return updated;
              });
            },
            (step) => {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].steps.push(step)
                return updated;
              });
            },
            (sources) => {
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1].sources = sources
                return updated
              })
            }
          );

          setAnswering(false);
        })()
      }

    } else {
      if (toolMode && toolName === "draw") {
        if (question.trim() !== "") {
          if (uploadedImage) {
            generateImage(question)
          } else {
            genImage(question)
          }
        }
      }
      if (toolMode && toolName === "story") {
        generateStory()
      }
      if (toolMode && toolName === "learn") {
        if (question.trim() !== "") {
          (async () => {
            setAnswering(true);
            const lessonName = lessons[0]?.que ? question : await genLessonName(question)

            setSearched(true)
            introRef.current.classList.add("hide")
            toolsRef.current.classList.add("hide")
            headerRef.current.classList.add("hide")
            resultRef.current.classList.add("show")
            leftSidebarRef.current.classList.add("show")
            // homeWrapperRef.current.style.paddingTop = "0"
            searchContainerRef.current.classList.add('onsearch')
            homeContainerRef.current.classList.add('onsearch')
            setDrawerCollapsed(true)
            setOnSearch(true)

            const history = []

            lessons.map((lesson, index) => {
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
              type: "lesson",
              que: lessonName,
              ans: ""
            }]);

            let streamedAnswer = "";
            await tutorAI(question, history, (chunk) => {
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
      if (toolMode && toolName === "code") {
        if (question !== "") {
          setAnswering(true)
        }
      }
      if (toolMode && toolName === "summarise") {
        if (question !== "") {
          setShowSummarise(true);
          (async () => {
            try {
              await summariseAI(question, (chunk) => {
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
      <div ref={HomeRef} className={`home ${darkmode && "dark"} ${useBlack && darkmode ? "black" : ""}`} >
        <div ref={homeWrapperRef} className={`home-wrapper`}>
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
            showLessonsWindow={showLessonsWindow}
            setDrawerOpened={setDrawerOpened}
            showLibraryWindow={showLibraryWindow}
            setShowLoginDialog={setShowLoginDialog}
            openedChatID={openedChatID}
            setOpenedChatID={setOpenedChatID}
            darkmode={darkmode}
            setShowRenameDialog={setShowRenameDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            setShowInfoDialog={setShowInfoDialog}
            setTempChatID={setTempChatID}
          />
          <div ref={homeContainerRef} style={{
            // padding: searched ? (window.innerWidth < 768 ? "0" : (drawerCollapsed && searched ? (animations ? "10px 10px 10px 10px" : "0 0 0 80px") : (animations ? "10px 10px 10px 0" : "0 0 0 0"))) : "150px 0 0"
          }} className={`homeContainer ${drawerOpened && "drawer"}`} >
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
              setAnimState={setAnimState}
              animState={animState}
              searched={searched}
              handleClearChat={handleClearChat}
              setDrawerOpened={setDrawerOpened}
              setShowToast={setShowToast}
              setToastText={setToastText}
              toastRef={toastRef}
              homeContainerRef={homeContainerRef}
              setShowSearchChats={setShowSearchChats}
            />
            <div ref={introRef} className="intro invisible">
              <img className='sirianim' src={animation} alt="" />
              <div className='introTxtContainer'>
                <h1 className={` welcomeMsgTitle ${user && user !== null && "loggedin"}`} ref={welcomeMsgTitle}>
                  {
                    user && user !== null && user.displayName && user.displayName !== null ?
                      "Welcome, " + user.displayName.split(" ")[0]
                      :
                      "Meet Que AI"
                  }
                </h1>
                <p className='welcomeMsgSubtitle' ref={welcomeMsgSubtitle}>
                  {
                    user && user !== null && user.displayName && user.displayName !== null ?
                      "How can i help you today?"
                      :
                      "Your personal AI, ready to help you think better and move faster."
                  }
                </p>

              </div>

              {/* <p style={{
                    fontSize: "20px"
                  }}>How can i help you today?</p> */}
              {/* <div className="selectionButtonContainer">
                    <div className="selectionButton">
                      <span className='material-symbols-outlined'>animated_images</span>
                        <p>Create</p>
                    </div>
                    <div className="selectionButton">
                      <span className='material-symbols-outlined'>code</span>
                      <p>Code</p>
                    </div>
                    <div className="selectionButton">
                      <span className='material-symbols-outlined'>assignment</span>
                      <p>Summarise</p>
                    </div>
                    <div className="selectionButton">
                       <span className='material-symbols-outlined'>ink_pen</span>
                       <p>Write</p>
                    </div>
                    <div className="selectionButton">
                      <span className='material-symbols-outlined'>school</span>
                      <p>Learn</p>
                    </div>
                  </div> */}
            </div>
            <Result
              ref={resultRef}
              introRef={introRef}
              toolsRef={toolsRef}
              headerRef={headerRef}
              resultTitle={resultTitle}
              leftSidebarRef={leftSidebarRef}
              // rightSidebarRef={rightSidebarRef}
              drawerCollapsed={drawerCollapsed}
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
              chatTitle={chatTitle}
              setChatTitle={setChatTitle}
              getRandomString={getRandomString}
              chats={chats}
              searchContainerRef={searchContainerRef}
              setShowToast={setShowToast}
              setToastText={setToastText}
              toastRef={toastRef}
              answering={answering}
              user={user}
              getChats={getChats}
              shouldSaveChat={shouldSaveChat}
              setMessages={setMessages}
              relatedQues={relatedQues}
              handleButtonClick={handleButtonClick}
              handleClearChat={handleClearChat}
              setShowSources={setShowSources}
              setSources={setSources}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              darkmode={darkmode}
              setTempChatID={setTempChatID}
              setShowDeleteDialog={setShowDeleteDialog}
              setShowRenameDialog={setShowRenameDialog}
              setShowInfoDialog={setShowInfoDialog}
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
              drawerCollapsed={drawerCollapsed}
            />

            <Library
              ref={libraryRef}
              drawerCollapsed={drawerCollapsed}
              handleClearChat={handleClearChat}
              storiesList={storiesList}
              showStoriesWindow={showStoriesWindow}
            />

            {/* {
              window.innerWidth < 768 &&
              <BottomNav />
            } */}

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
              setOnSearch={setOnSearch}
              searched={searched}
              placeHolder={customePlaceHolder !== "" ? customePlaceHolder : "Ask anything..."}
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
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setShowSuggestions={setShowSuggestions}
              setSuggestionsList={setSuggestionsList}
              toolsRef={toolsRef}
            />
            <SearchTools
              ref={toolsRef}
              setQuestion={setQuestion}
              inputRef={inputRef}
              setBtnState={setBtnState}
              setToolMode={setToolMode}
              setToolName={setToolName}
              animState={animState}
              showCanvasWindow={showCanvasWindow}
              setCustomePlaceHolder={setCustomePlaceHolder}
              setShowProjectCreation={setShowProjectCreation}
              setShowSuggestions={setShowSuggestions}
              setSuggestionsList={setSuggestionsList}
            />
            {
              showSuggestions &&
              <Suggestions
                ref={suggestionsRef}
                suggestions={suggestionsList}
                toolName={toolName}
                generateStory={generateStory}
              />
            }
          </div>
        </div>
        {
          showSettings &&
          <Settings
            setShowSettings={setShowSettings}
            setDarkmode={setDarkmode}
            darkmode={darkmode}
            useBlack={useBlack}
            setUseBlack={setUseBlack}
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
                    canvasImages[showGenImage.index].img && <div className="download-btn btn" onClick={() => downloadImage(canvasImages[showGenImage.index])}>
                      <span className="material-symbols-outlined">download</span>
                    </div>
                  }
                  <div className="close-btn btn" onClick={() => {
                    genImageWrapper.current.classList.add("hide")
                    setTimeout(() => {
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
          showSearchChats &&
          <SearchChats
            recentsChats={recentsChats}
            setShowSearchChats={setShowSearchChats}
            setOpenedChatID={setOpenedChatID}
            shouldSaveChat={shouldSaveChat}
            setChatMessages={setChatMessages}
          />
        }

        {
          showLoginDialog &&
          <div className="loginContainer" >
            <div className="loginWrapper" ref={loginWrapper}>
              <div className="loginHeader">
                <h2> </h2>
                <div className="btn-container">
                  <div className="close-btn btn" onClick={() => {
                    loginWrapper.current.classList.add("hide")
                    setTimeout(() => {
                      setShowLoginDialog(false)
                    }, 300)
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
                  <div className="googleLoginBox" onClick={async (e) => {
                    e.target.style.opacity = "0.7"
                    setTimeout(() => {
                      e.target.style.opacity = "1"
                    }, 200);
                    const provider = new GoogleAuthProvider()

                    try {
                      const result = await signInWithPopup(auth, provider)
                      const user = result.user;
                      try {
                        const docRef = doc(db, "users", user.uid)
                        const docSnap = await getDoc(docRef)
                        if (docSnap.exists) {
                          console.log("Doc data: ", docSnap.data())
                        }
                      } catch (err) {
                        console.log(err)
                      }
                      setLoginState(true)
                    } catch (err) {
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
          showProjectCreation &&
          <div className="projectCreateContainer" >
            <div className="projectCreateWrapper" ref={projectCreateWrapper}>
              <div className="projectCreateHeader">
                <h2> </h2>
                <div className="btn-container">
                  <div className="close-btn btn" onClick={() => {
                    projectCreateWrapper.current.classList.add("hide")
                    setTimeout(() => {
                      setShowProjectCreation(false)
                    }, 300)
                  }} >
                    <span className="material-symbols-outlined">close</span>
                  </div>
                </div>
              </div>
              <div className="projectCreateBody">
                <div>

                </div>
                <h2><span className="material-symbols-outlined">code</span> Create a new Project</h2>
                <p>Tell me what do you want to create today</p>
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
                <div className="close-btn btn" onClick={() => {
                  summariseWrapper.current.classList.add("hide")
                  setTimeout(() => {
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



        {
          showSources &&
          <div className="sourcesContainer">
            <div className="sourcesWrapper" ref={sourcesWrapper}>
              <div className="sourcesHeader">
                <h3>Sources</h3>
                <div className="close-btn btn" onClick={() => {
                  sourcesWrapper.current.classList.add("hide")
                  setTimeout(() => {
                    setShowSources(false)
                  }, 200)
                }} >
                  <span className="material-symbols-outlined">close</span>
                </div>
              </div>
              <div className="sourcesBody">
                <div className="sourcesList">
                  {/* {sources.map((source, index) =>
                    <a href={source.url}>
                      <div className="source" onClick={(e) => {
                        e.preventDefault()
                        window.open(source.url)
                      }}>
                        <img src={source.favicon} alt="" />
                        <p>{source.title}</p>
                      </div>
                    </a>
                  )} */}

                  {
                    sources.map((source, index) => (
                      <a href={source.url} onClick={(e) => {
                        e.preventDefault()
                        window.open(source.url)
                      }}>
                        <div className="source">
                          <div className="siteInfo">
                            <img src={source.favicon} alt="" />
                            <p>{source.site}</p>
                          </div>
                          <p className='site-title'>{source.title}</p>
                          <p className='site-body'>{source.snippet}</p>
                        </div>

                      </a>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        }

        {showToast &&
          <Toast ref={toastRef} text={toastText} />
        }

        {
          showRenameDialog &&
          <RenameDialog
            setShowRenameDialog={setShowRenameDialog}
            visible={showRenameDialog}
            tempChatID={tempChatID}
            user={user}
            getChats={getChats}
          />
        }

        {
          showDeleteDialog &&
          <DeleteDialog
            setShowDeleteDialog={setShowDeleteDialog}
            visible={showDeleteDialog}
            tempChatID={tempChatID}
            user={user}
            getChats={getChats}
          />
        }

        {
          showInfoDialog &&
          <InfoDialog
            setShowInfoDialog={setShowInfoDialog}
            visible={showInfoDialog}
            user={user}
            tempChatID={tempChatID}
          />
        }

      </div>
    </>
  )
}
