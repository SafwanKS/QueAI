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
  previewImage,
  setCustomePlaceHolder,
  selectedModel,
  setSelectedModel,
  setShowSuggestions,
  setSuggestionsList,
  toolsRef,
}, ref) => {
  const navigate = useNavigate()
  const [rows,
    setRows] = useState(1)
  const [showDialogBox,
    setShowDialogBox] = useState(false)
  const [searchLang, setSearchLang] = useState('English')
  const [tempSearchLang, setTempSearchLang] = useState('English')
  const [showAddOnes, setShowAddOnes] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)


  const addBtn = useRef(null)
  const fileInputContainer = useRef(null)

  const modelSelectorRef = useRef(null)
  const addOnesRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      // model selector
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(e.target)
      ) {
        setShowModelSelector(false)
      }

      // add-ons
      if (
        addOnesRef.current &&
        !addOnesRef.current.contains(e.target)
      ) {
        setShowAddOnes(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])





  const [anim, setAnim] = useState(false)


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowAddOnes(false)
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus()
    }, 200);
  }, [])


  const [showLangDialog,
    setShowLangDialog] = useState(false)
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

  const ifCancel = (dType) => {
    if (dType === 'lang') {
      setShowDialogBox(false)
      setTimeout(() => {
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
      setTimeout(() => {
        setShowLangDialog(false)
      }, 200)
    }
  }

  const showDialog = (d) => {
    if (d === 'lang')
      setShowLangDialog(true)
  }

  const clearPreview = () => {
    addBtn.current.style.display = "flex"
    fileInputContainer.current.style.display = "none"
  }

  return (
    <>
      {
        showLangDialog === true &&
        <Dialog
          type={'selection'}
          icon={'language'}
          title={'Choose language'}
          cancelTxt={'Cancel'} confirmTxt={'Confirm'}
          onCancel={() => ifCancel('lang')}
          onConfirm={() => ifConfirm('lang')}
          visible={showDialogBox}
        >
          <ul className='langmap'>
            {
              languages.map((lang, index) => (
                <li key={index} style={
                  {
                    backgroundColor: lang === tempSearchLang && 'rgba(0,0,0,0.3)'
                  }
                } onClick={() => setTempSearchLang(lang)}>
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

        <div className={`searchBox ${(answering || anim) && "anim"} ${toolMode && "toolmode"} ${toolMode && (toolName == "draw" && "red" || toolName == "code" && "green" || toolName == "summarise" && "blue" || toolName == "story" && "purple" || toolName == "learn" && "yellow")} ${animactive && "active"}`} ref={ref} onClick={() => window.innerWidth > 768 && inputRef.current.focus()}>
          <div className='searchBoxInputContainer'>
            {
              toolMode &&
              <>
                {
                  toolName === "draw" ?
                    <>
                      <div className="btnWrapper">
                        <div className={`btn add-btn ${showAddOnes && "active"}`} ref={addBtn} onClick={() => {
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
                                onChange={(e) => {
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
                    :
                    <div className="searchTool">
                      <span className={`${toolName} material-symbols-outlined`}>{toolName == "draw" && "draw" || toolName == "code" && "code" || toolName == "summarise" && "assignment" || toolName == "story" && "ink_pen" || toolName == "learn" && "school"}</span>
                      {window.innerWidth > 768 && <p>{toolName}</p>}
                      <div className="close-btn" onClick={() => {
                        setToolMode(false)
                        setCustomePlaceHolder("")
                        setShowSuggestions(false)
                        setSuggestionsList([])
                        toolsRef.current.classList.remove("hide")
                      }}>
                        <span className="material-symbols-outlined">close</span>
                      </div>
                    </div>
                }
              </>
            }

            <textarea
              type="text"
              rows="1"
              placeholder={selectedModel == "casual" ? "Type a message..." : placeHolder}
              id="promptText"
              ref={inputRef}
              onFocus={() => {
                if (!toolMode && typeof setAnimactive === 'function') { setAnimactive(false) }
                setAnim(true)
              }}
              onBlur={() => setAnim(false)}
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
              !toolMode &&
              <>

                <div className="btn-wrapper" ref={addOnesRef}>
                  <div className={`btn add-btn ${showAddOnes && "active"}`} onClick={() => {
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
                  <div ref={modelSelectorRef} style={{
                    height: "100%",
                    display: "flex"
                  }}>
                    <SelectionChip
                      onClick={() => {
                        setShowModelSelector(!showModelSelector)
                      }}
                      icon={
                        selectedModel == "casual" ? "mood" :
                          selectedModel == "smart" ? "neurology" :
                            selectedModel == "pro" ? "bolt" : ""
                      }
                      active={showModelSelector}
                      body={
                        proEnabled ? "Pro" :
                          selectedModel === "auto" ? "Auto" :
                            selectedModel === "openai/gpt-oss-120b" ? "GPT-OSS-120b" :
                              selectedModel === "llama-3.1-8b-instant" ? "LLaMA 3.1 8B" :
                                selectedModel === "llama-3.3-70b-versatile" ? "LLaMA 3.3 70B" :
                                  selectedModel === "casual" ? "Casual" :
                                    selectedModel === "smart" ? "Smart" : ""
                      } />

                    {
                      showModelSelector && (
                        <div className="model-selector">
                          <div className="model-selector-head">
                            <p>Modes</p>
                          </div>
                          <div className="model-selector-body">
                            <div className="model-selector-list">
                              {/* <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("auto")
                                setShowModelSelector(false)
                              }}>
                                <p>Auto</p>
                                <p>Automatically selects the best model</p>
                              </div>
                              <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("openai/gpt-oss-120b")
                                setShowModelSelector(false)
                              }}>
                                <p>GPT-OSS-120b</p>
                                <p>Best for deep thinking</p>
                              </div>
                              <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("llama-3.1-8b-instant")
                                setShowModelSelector(false)
                              }}>
                                <p>LLaMA 3.1 8B (Fast)</p>
                                <p>Fastest for quick answers</p>
                              </div>
                              <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("llama-3.3-70b-versatile")
                                setShowModelSelector(false)
                              }}>
                                <p>LLaMA 3.3 70B (Versatile)</p>
                                <p>Best for everyday use</p>
                              </div>
                              <div className="model-selector-list-item switch-container" onClick={() => {
                                // setSelectedModel("llama-3.3-70b-versatile")
                                setProEnabled(!proEnabled)
                                // setShowModelSelector(false)
                              }}>
                                <div>
                                  <p>Pro mode</p>
                                  <p>Use Langchain models</p>
                                </div>
                                <div style={{
                                  position: "relative",
                                  height: "100% !important",
                                  display: "flex",
                                  alignItems: "center"
                                }}>
                                  <div className={`switch ${proEnabled && "active"}`} onClick={() => {
                                    setProEnabled(!proEnabled)
                                  }}>
                                    <div className="switch-btn"></div>
                                  </div>
                                </div>
                              </div> */}
                              <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("casual")
                                setShowModelSelector(false)
                              }}>
                                <p><span className="material-symbols-outlined">mood</span>Casual Mode</p>
                                <p>Your friendly companion</p>
                              </div>
                              <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("smart")
                                setShowModelSelector(false)
                              }}>
                                <p><span className="material-symbols-outlined">neurology</span>Smart Mode</p>
                                <p>Better answers with clear reasoning.<br />
                                  Best for everyday use.</p>
                              </div>
                              <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("pro")
                                setShowModelSelector(false)
                                setProEnabled(!proEnabled)
                              }}>
                                <p><span className="material-symbols-outlined">bolt</span>Pro Mode</p>
                                <p>Powerful tools and precise results.</p>
                              </div>
                            </div>
                            <div className="model-selector-footer">
                              <div className="more-models">
                                <p>Manage modes</p>
                                <span className="material-symbols-outlined">north_east</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </div>

                  <SelectionChip
                    onClick={() => {
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
              state={btnState && !answering ? "active" : "inactive"}
              bgcolor={`${toolMode && toolName}`}
              icon={"arrow_upward"}
              onClick={() => handleButtonClick()}
              answering={answering}
            />
          </div>
        </div>

      </div>

    </>
  )
})

export default SearchBox