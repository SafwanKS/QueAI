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
  homeContainerRef,
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
  proEnabled,
  onSearch,
  fileInputRef,
  handleFileChange,
  uploadedImage,
  previewImage
}, ref) => {
  const navigate = useNavigate()
  const [rows,
    setRows] = useState(1)
  const [showDialogBox,
    setShowDialogBox] = useState(false)
  const [searchLang, setSearchLang] = useState('English')
  const [tempSearchLang, setTempSearchLang] = useState('English')
  const [showAddOnes, setShowAddOnes] = useState("")

  const addBtn = useRef(null)
  const fileInputContainer = useRef(null)


  useEffect(() => {
      const handleKeyDown = (event) => {
        if(event.key === "Escape"){
          setShowAddOnes(false)
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

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

  const clearPreview = () =>{
    addBtn.current.style.display = "flex"
    fileInputContainer.current.style.display = "none"
  }
  
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
        {/* <div className="filesContainer">

        </div>  */}
        <div className='searchBoxInputContainer'>
          {
            toolMode &&
            <>
              <div className="btnWrapper">
                <div className={`btn add-btn ${showAddOnes && "active"}`} ref={addBtn} onClick={()=>{
                  setShowAddOnes(!showAddOnes)
                }}>
                  <span className="material-symbols-outlined">add</span>
              </div>
                {
                  showAddOnes && (
                    <div className="searchAddOnes">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e)=> {
                          handleFileChange(e)
                          setShowAddOnes(false)
                          addBtn.current.style.display = "none"
                          fileInputContainer.current.style.display = "block"
                        }}
                      />
                      <div className="searchAddOne" onClick={() => fileInputRef.current.click()}>
                        <span className="material-symbols-outlined">attach_file</span>
                        <p>Upload image</p>
                      </div>
                    </div>
                  )
                }
              </div>
              <div className="filesContainer" ref={fileInputContainer}>
                <div className="close-btn" onClick={clearPreview}>
                  <span className="material-symbols-outlined">close</span>
                </div>
                <img src={previewImage} alt="" />
              </div>
            </> 
            
            // <div className="searchTool">
            //   <span className={`${toolName} material-symbols-outlined`}>{toolName == "draw" && "draw" || toolName == "code" && "code" || toolName == "summarise" && "assignment" || toolName == "story" && "ink_pen" || toolName == "learn" && "book_2" }</span>
            //   <p>{toolName}</p>
            //   <div className="close-btn" onClick={()=> setToolMode(false)}>
            //     <span className="material-symbols-outlined">close</span>
            //   </div>
            // </div>
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
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.target.value.trim() !== "" && (!answering && window.innerWidth > 768 && onKeyDown());
              }
              if (e.shiftKey && e.key === "Enter") {
                e.preventDefault();
                e.target.value = e.target.value + "\n"
                e.target.rows = e.target.value.split('\n').length;
                handleInputChange()
              }
            }}
            />
        </div>
        <div className='searchBoxButtonContainer'>
          {
            !animactive &&
            <>
            
            <div className="btn-wrapper">
              <div className={`btn add-btn ${showAddOnes && "active"}`} onClick={()=>{
                setShowAddOnes(!showAddOnes)
              }}>
                <span className="material-symbols-outlined">add</span>
              </div>

              {
                showAddOnes && (
                  <div className="searchAddOnes">
                    <div className="searchAddOne">
                      <span className="material-symbols-outlined">attach_file</span>
                      <p>Add photos & files</p>
                    </div>

                    <div className="line"></div>

                    <div className="searchAddOne">
                      <span className="material-symbols-outlined">draw</span>
                      <p>Create an image</p>
                    </div>

                    <div className="searchAddOne">
                      <span className="material-symbols-outlined">assignment</span>
                      <p>Summarise text</p>
                    </div>

                    <div className="searchAddOne">
                      <span className="material-symbols-outlined">book_2</span>
                      <p>Learn a topic</p>
                    </div>
                  </div>
                )
              }
              
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