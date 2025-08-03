import {
  useState,
  useRef,
  useEffect,
  forwardRef
} from 'react'
import {
  useNavigate
} from 'react-router'
import '../css/SearchBox.css'
import SmallBtn from "./SmallBtn.jsx"
import Dialog from '../components/Dialog.jsx'
import SelectionChip from '../components/SelectionChip.jsx'


const SearchBox = forwardRef(({
  handleInputChange,
  handleButtonClick,
  onKeyDown,
  placeHolder,
  value,
  answering = false,
  focus = false,
  onLangChanged,
  inputRef,
  btnState,
  animactive = false,
  setAnimactive,
  responseRef,
  onLang,
  toolMode,
  toolName, 
  setToolMode,
  searchContainerRef,
  setProEnabled, 
  proEnabled
}, ref) => {
  const navigate = useNavigate()
  const [rows,
    setRows] = useState(1)
  const [showDialogBox,
    setShowDialogBox] = useState(false)
  const [searchLang, setSearchLang] = useState('English')
  const [tempSearchLang, setTempSearchLang] = useState('English')

  const [showLangDialog,
    setShowLangDialog] = useState(false)
    const languages = [
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
    "English",
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
    "Malayalam",
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
    
  const ifCancel = (dType) => {
    if (dType === 'lang') {
      setShowDialogBox(false)
      setTimeout(()=> {
        setShowLangDialog(false)
      }, 200)
    } 
  }

  const ifConfirm = (dType) => {
    if (dType === 'lang') {
      setSearchLang(tempSearchLang)
      const handleLang = onLangChanged
      handleLang(tempSearchLang)
      setShowDialogBox(false)
      setTimeout(()=> {
        setShowLangDialog(false)
      }, 200)
    } 
  }
    
  const showDialog = (d) => {
    if (d === 'lang')
      setShowLangDialog(true)
  }
  
  const inputBoxRef = useRef(null)
  const searchBoxRef = useRef(null)
  
  // const handleInputChange = (event) => {
  //   props.onChange(event)
  //   const inputBox = inputBoxRef.current
  //   const searchBox = searchBoxRef.current
  //   inputBox.rows = inputBox.value.split('\n').length;
  //   inputBox.style.height = 'auto';
  //   inputBox.style.height = inputBox.scrollHeight + 'px';
  //   setBtnState(inputBox.value.length > 0)
    
  // }
  

 /* const handleBtnClick = () => { 
    const inputBox = inputBoxRef.current
    const searchBox = searchBoxRef.current
    if (props.responseRef) {
      const responseRef = props.responseRef
      const resRef = responseRef.current
    }
    let query = inputBox.value.trim()
    navigate(`/search?q=${query}&&lang=${props.language}&&type=${props.type}`)
    inputBox.value = ""
    inputBox.rows = inputBox.value.split('\n').length;
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + 'px';
    setBtnState(false)
  } */

  return(
    <>
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
                  backgroundColor: lang === tempSearchLang && 'rgba(0,0,0,0.3)'
                }
                } onClick={()=> setTempSearchLang(lang)}>
                <p>
                  {lang}
                </p>
              </li>
            ))
            }
          </ul>
        </Dialog>
    }
    

    <div className="searchBoxContainer" ref={searchContainerRef}>
      <div className={`searchBox ${toolMode && "toolmode"} ${toolMode && (toolName == "draw" && "red" || toolName == "code" && "green" || toolName == "summarise" && "blue" || toolName == "story" && "purple" || toolName == "learn" && "yellow" )} ${animactive && "active"}`} ref={ref} onClick={()=> window.innerWidth > 768 && inputRef.current.focus()}>
        <div className='searchBoxInputContainer'>
          {
            toolMode &&
            <div className="searchTool">
              <span className={`${toolName} material-symbols-outlined`}>{toolName == "draw" && "draw" || toolName == "code" && "code" || toolName == "summarise" && "assignment" || toolName == "story" && "ink_pen" || toolName == "learn" && "book_2" }</span>
              <p>{toolName}</p>
              <div className="close-btn" onClick={()=> setToolMode(false)}>
                <span className="material-symbols-outlined">close</span>
              </div>
          </div>
          }
          
          <textarea
            type="text"
            rows="1"
            placeholder={placeHolder}
            id="promptText"
            ref={inputRef}
            onFocus={()=> {
              if(!toolMode) setAnimactive(false)  
            }}
            onChange={handleInputChange}
            value={value}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.ctrlKey) {
                e.preventDefault();
                !answering && onKeyDown();
              }
              if (e.key === "Enter" && e.ctrlKey) {
                // Action for Ct
              }
            }}
            />
        </div>
        <div className='searchBoxButtonContainer'>
          {
            !animactive &&
            <>
            <div className="btn add-btn">
              <span className="material-symbols-outlined">add</span>
            </div>
              <div className='chipContainer'>
                <SelectionChip
                    onClick={()=> {
                      setProEnabled(!proEnabled)
                    }} 
                    icon={'bolt'}
                    active={proEnabled}
                    body={"Pro (Beta)"} />
                <SelectionChip
                    onClick={()=> {
                      showDialog('lang')
                      setShowDialogBox(true)
                    }}
                    icon={'language'}
                    body={searchLang} />
                <span className='blank' />
              </div>
            </>

          }
          
          <SmallBtn
            className={"sendBtn"}
            state={btnState && !answering ? "active": "inactive"}
            bgcolor={`${toolMode && toolName }`}
            icon={"arrow_upward"}
            onClick={() => handleButtonClick()}
            />
        </div>
      </div>

    </div>
    
    </>
  )
})

export default SearchBox