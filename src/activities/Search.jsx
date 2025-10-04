import {
  useLocation,
  useParams,
  useNavigate,
  replace
} from 'react-router'

import axios from 'axios'
import {
  useState,
  useRef,
  useEffect,
} from 'react'
import SearchBox from '../components/SearchBox.jsx'
import Header from '../components/Header.jsx'
import Toolbar from '../components/Toolbar.jsx'
import Dialog from '../components/Dialog.jsx'
import SmallBtn from "../components/SmallBtn.jsx"
import SelectionChip from '../components/SelectionChip.jsx'
import '../css/Search.css'
import '../css/LoadingBar.css'
const apiEndpoint = "https://queai-backend.vercel.app/api/askai"
const getRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
const getResult = async (history, prompt, lang, resType) => {
  try {
    const response = await axios.post(apiEndpoint, {
      history: history,
      prompt: prompt,
      lang: lang,
      type: resType
    })
    return response.data.responseText
  }catch(err) {
    console.log(err)
    return null
  }
}

export default function Search(props) {

  const location = useLocation()

  const { message, searchLang, searchMode } = location.state || {};

  const responseRef = useRef(null)
  const [showDialogBox,
    setShowDialogBox] = useState(false)
  const [lang,
    setLang] = useState('English')
  const [tempLang,
    setTempLang] = useState(searchLang || "English")
  const [tempResType,
    setTempResType] = useState(searchMode || 'Balanced')
  const [resType,
    setResType] = useState('Balanced')
  const [btnState,
    setBtnState] = useState(false)
    const [moreOptionState,setMoreOptionState] = useState(false)
  const [question,
    setQuestion] = useState("")
  const [spanHeight,
    setSpanHeight] = useState()
  const [messages,
    setMessages] = useState([])


  const [showLangDialog,
    setShowLangDialog] = useState(false)
  const [showTypeDialog,
    setShowTypeDialog] = useState(false)

  

  
   useEffect(() => {
    setLang(searchLang);
    setResType(searchMode);
  }, [searchLang, searchMode])


  const {state} = useLocation()
  const navigate = useNavigate()

  const {chatId} = useParams()
  
  const inputBoxRef = useRef(null)
  const scrollEndRef = useRef(null)
  const lastElement = useRef(null)
  const searchDivRef = useRef(null)

  

  const ifCancel = (dType) => {
    if (dType === 'lang') {
      setShowDialogBox(false)
      setTimeout(()=> {
        setShowLangDialog(false)
      }, 200)
    } else if (dType === 'type') {
      setShowDialogBox(false)
      setTimeout(()=> {
        setShowTypeDialog(false)
      }, 200)
    }
  }


  useEffect(()=>{
    if(chatId && localStorage.getItem(chatId) ){
      setMessages(JSON.parse(localStorage.getItem(chatId)).messages)
    }else {
      navigate('/', {replace: true})
    }
  },[chatId, navigate])

  useEffect(() => {
  if (chatId) {
    const savedData = JSON.parse(localStorage.getItem(chatId) || "{}")

    if (savedData.messages && savedData.messages[0] && savedData.messages[0].ans === null) {
      const msg = savedData.messages[0];
      
      console.log(searchLang);

      (async () => {
        const result = await getResult(
          [
            {
              role: "user",
              parts: [{ text: msg.que }]
            },
            {
              role: "model",
              parts: [{ text: "" }]
            }
          ],
          msg.que,
          lang,
          resType
        )


        // Update localStorage with new answer
        const updatedMessages = [{ que: msg.que, ans: result }]
        localStorage.setItem(chatId, JSON.stringify({
          messages: updatedMessages
        }))

        // Update UI
        setMessages(updatedMessages)
      })()
      
    } else if (savedData.messages) {
      setMessages(savedData.messages)
    }
  }
}, [chatId])


  

  useEffect(()=> {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showLangDialog) {
          ifCancel('lang')
        } else if (showTypeDialog) {
          ifCancel('type')
        }
      }

      if (e.key === 'Enter' && btnState) {
        handleBtnClick()
        const inputBox = inputBoxRef.current
        
      }
    }

    window.addEventListener('keydown', handleKeyDown)

      return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };

  }, [showLangDialog, showTypeDialog, ifCancel])

  // useEffect(()=> {
  //   const inputBox = inputBoxRef.current
  //   inputBox.focus()
  // },[])

  useEffect(()=> {
    if (messages[0]) {
      const node = lastElement.current
      const searchDiv = searchDivRef.current
      // const scrollEnd = scrollEndRef.current
      // const parentHeight = scrollEnd.parentElement.offsetHeight
      // if (node.offsetHeight < parentHeight) {

      //   scrollEnd.style.height = `${parentHeight - node.offsetHeight - 365 }px`
      // }

      if(messages[messages.length - 1].ans == "" && node) node.scrollIntoView(true)


        // if (messages[messages.length - 1].ans !== "") {
        //   const title = messages[0].que

        //   localStorage.setItem(chatId, JSON.stringify({
        //     title: title,
        //     messages: messages
        //   }))
        // }
      }else{
        
      }
  },
    [messages])

  const handleInputChange = (e) => {
    const inputBox = inputBoxRef.current
    inputBox.rows = inputBox.value.split('\n').length;
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + 'px';
    setBtnState(inputBox.value.length > 0)
    setQuestion(inputBox.value)
  }

  const handleBtnClick = async (e) => {

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
    })

    setMessages([...messages, {que: question, ans: ""}])


    {const inputBox = inputBoxRef.current
    inputBox.value = ""
    inputBox.rows = inputBox.value.split('\n').length;
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + 'px';
    setBtnState(false)}

    (async () => {
      const response = await getResult(history, question, lang, resType)
      setMessages((prevMessages)=> {
        const updatedMessages = [...prevMessages]
        updatedMessages[updatedMessages.length - 1].ans = response
        return updatedMessages
      })
    })()

    

  }



  const languages = [
    "English",
    "Malayalam",
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Azerbaijani",
    "Bengali",
    "Bikol",
    "Bosnian",
    "Bulgarian",
    "Cantonese",
    "Cebuano",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "Estonian",
    "Finnish",
    "French",
    "Fulani",
    "Georgian",
    "German",
    "Greek",
    "Hausa",
    "Hebrew",
    "Hiligaynon",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Igbo",
    "Ilocano",
    "Irish",
    "Italian",
    "Japanese",
    "Javanese",
    "Kapampangan",
    "Kazakh",
    "Khmer",
    "Korean",
    "Kurdish",
    "Lao",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Maguindanao",
    "Malay",
    "Maltese",
    "Mandarin Chinese",
    "Maranao",
    "Marathi",
    "Mongolian",
    "Myanmar",
    "Nepali",
    "Norwegian",
    "Odia",
    "Oromo",
    "Pashto",
    "Pangasinan",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Scottish Gaelic",
    "Serbian",
    "Shona",
    "Sindhi",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish",
    "Swahili",
    "Swedish",
    "Tagalog",
    "Tamil",
    "Tatar",
    "Telugu",
    "Thai",
    "Tigrinya",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Waray",
    "Welsh",
    "Wu Chinese",
    "Xhosa",
    "Yiddish",
    "Yoruba",
    "Zamboangueño Chavacano",
    "Zulu"
  ]

  const selectLang = (index) => {
    setTempLang(languages[index])
  }

  

  const ifConfirm = (dType) => {
    if (dType === 'lang') {
      setLang(tempLang)
      setShowDialogBox(false)
      setTimeout(()=> {
        setShowLangDialog(false)
      }, 200)
    } else if (dType === 'type') {
      setResType(tempResType)
      setShowDialogBox(false)
      setTimeout(()=> {
        setShowTypeDialog(false)
      }, 200)
    }

  }

  const showDialog = (d) => {
    if (d === 'lang')
      setShowLangDialog(true)
    else if (d === 'type')
      setShowTypeDialog(true)
  }

  return(
    <>
      <div className="search" ref={searchDivRef}>
        <div className="header">
          <div className="headRow">
            <SmallBtn icon={"arrow_back"} onClick={()=> navigate("/", {replace: true})} />
            
          </div>
          <div className="headRow">
            <div className="more-btn">
              <span className="material-symbols-outlined">more_horiz</span>
              <div className="options">
                <div className="option">
                  <span className="material-symbols-outlined">delete</span>
                  <p>Delete</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div className="responses">
          {
            messages.map((message, index) =>
              <div key={index} ref={ index === messages.length - 1 ? lastElement: null } className="responseDiv">
                <h1>{message.que}</h1>
                <div className='line' ></div>
                <div id="response"
                  >
                  {
                  message.ans && message.ans !== "" ?
                    (
                      <><p>{message.ans}</p>
                      <div className="actions">
                        <div className="bigActions">
                          <div className="actionBtn action-share">
                            <span className="material-symbols-outlined">ios_share</span>
                            <p>Share</p>
                          </div>
                          <div className="actionBtn actionExport">
                            <span className="material-symbols-outlined">save_alt</span>
                            <p>Export</p>
                          </div>
                        </div>
                        <div className="quickActions">
                          <div className="actionBtn action-like">
                            <span className="material-symbols-outlined">thumb_up</span>
                          </div>
                          <div className="actionBtn action-dislike">
                            <span className="material-symbols-outlined">thumb_down</span>
                          </div>
                          <div className="actionBtn action-copy">
                            <span className="material-symbols-outlined">content_copy</span>
                          </div>
                          <div className="actionBtn actionMenu">
                            <span className="material-symbols-outlined">more_horiz</span>
                          </div>
                        </div>
                        
                      </div>
                      <div className='line' ></div></>
                    )
                    : 
                  (
                    <div className='loadingBars'>
                      <div className='loadingBar' />
                      <div className='loadingBar' />
                      <div className='loadingBar' />
                    </div>
                  )
                  }
                </div>
              </div>
            )
          }
        </div>        
     {
        showLangDialog === true &&
        <Dialog
          type={'selection'}
          icon={'language'}
          title={'Choose language'}
          cancelTxt={'Cancel'} confirmTxt={'Confirm'}
          onCancel={()=> ifCancel('lang')}
          onConfirm={()=> ifConfirm('lang')}
          visible={showDialogBox}
          >
          <ul className='langmap'>
            {
            languages.map((lang, index)=>(
              <li key={index} style={
                {
                  backgroundColor: lang === tempLang && 'rgba(0,0,0,0.3)'
                }
                } onClick={()=> selectLang(index)}>
                <p>
                  {lang}
                </p>
              </li>
            ))
            }
          </ul>
        </Dialog>
        } 

        {
        showTypeDialog === true &&
        <Dialog
          type={'selection'}
          icon={'bolt'}
          title={'Response Type'}
          cancelTxt={'Cancel'}
          confirmTxt={'Confirm'}
          onCancel={()=> ifCancel('type')}
          onConfirm={()=> ifConfirm('type')}
          visible={showDialogBox}
          >
          <div className='typeSelector-container'>

            {
            ["Fast", "Balanced", "Pro"].map((type, index)=>(
              <div className='typeSelector'>
                <input type='radio' checked={type === tempResType} onChange={()=> setTempResType(type)} />
              <div className='typeSelector-body' onClick={()=> setTempResType(type)}>
                <div className='typeSelector-title-container'>
                  <span className='material-symbols-outlined'>bolt</span>
                  <p>
                    {type === 'Balanced' ? 'Balaced (Recommended)': type}
                  </p>
                </div>
                <p>
                  {
                  type === 'Fast' &&
                  "Short and snappy answers for instant help. Takes less time to process."
                  }
                  {
                  type === 'Balanced' &&
                  "Thoughtful and balanced responses for everyday needs."
                  }
                  {
                  type === 'Pro' &&
                  "Detailed and thorough explanations for complex topics. Takes more time to process."
                  }
                </p>
              </div>
            </div>

            ))
          }

        </div>
      </Dialog>
      }




        <div className="searchBox">
          <div className='searchBoxInputContainer'>
            <textarea
              type="text"
              rows="1"
              placeholder="Ask QueAi"
              id="promptText"
              onChange={handleInputChange}
              defaultValue={""}
              ref={inputBoxRef}
              />
          </div>
          <div className='searchBoxButtonContainer'>
            <div className='chipContainer'>

              <SelectionChip
                onClick={()=> {
                  showDialog('type')
                  setShowDialogBox(true)
                }}
                icon={'bolt'}
                body={resType} />
              <SelectionChip
                onClick={()=> {
                  showDialog('lang')
                  setShowDialogBox(true)
                }}
                icon={'language'}
                body={lang} />


              <span className='blank' />
              <SmallBtn
                state={btnState == true ? "active": "inactive"}
                icon={"send"}
                onClick={handleBtnClick}
                />
            </div>
          </div>
        </div>

    </div>
  </>
)
}

