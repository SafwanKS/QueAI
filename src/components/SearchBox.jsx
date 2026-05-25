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
import { Dialog } from '../components/Dialog.jsx'
import SelectionChip from '../components/SelectionChip.jsx'
import { Code2, FileText, PenLine, GraduationCap } from 'lucide-react'
import { Images } from 'lucide-react'
import { Globe } from 'lucide-react'
import { Sparkles } from 'lucide-react'

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
  darkmode,
  toolMode,
  toolName,
  setToolMode,
  setToolName,
  searchContainerRef,
  setProEnabled,
  proEnabled,
  onSearch,
  fileInputRef,
  handleFileChange,
  uploadedFiles,
  setUploadedFiles,
  uploadedImage,
  previewImage,
  setCustomePlaceHolder,
  selectedModel,
  setSelectedModel,
  setShowSuggestions,
  setSuggestionsList,
  toolsRef,
  expanded = false,
  setExpanded,
  searched
}, ref) => {
  const navigate = useNavigate()
  const [rows,
    setRows] = useState(1)
  const [showDialogBox,
    setShowDialogBox] = useState(false)
  const [searchLang, setSearchLang] = useState('English')
  const [tempSearchLang, setTempSearchLang] = useState('English')
  const [showAddOnes, setShowAddOnes] = useState(false)
  const [activeAddOneIndex, setActiveAddOneIndex] = useState(0)
  const [showModelSelector, setShowModelSelector] = useState(false)


  const addBtn = useRef(null)
  const fileInputContainer = useRef(null)

  const modelSelectorRef = useRef(null)
  const addOnesRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(e.target)) {
        setShowModelSelector(false)
      }
      if (addOnesRef.current && !addOnesRef.current.contains(e.target)) {
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

  const handleAddOneSelect = (index) => {
    if (inputRef.current && inputRef.current.value.endsWith("/")) {
      inputRef.current.value = inputRef.current.value.slice(0, -1)
      handleInputChange({ target: inputRef.current })
    }
    if (index === 0) {
      fileInputRef.current?.click()
      setShowAddOnes(false)
    } else if (index === 1) {
      setToolMode(true)
      setToolName("draw")
      setExpanded(true)
      setShowAddOnes(false)
      setCustomePlaceHolder("Describe your image...")
    } else if (index === 2) {
      setToolMode(true)
      setToolName("searchweb")
      setCustomePlaceHolder("Search the web...")
      setExpanded(true)
      setShowAddOnes(false)
    } else if (index === 3) {
      setToolMode(true)
      setToolName("learn")
      setExpanded(true)
      setCustomePlaceHolder("What do you want to learn?")
      setShowAddOnes(false)
    }
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
                    backgroundColor: lang === tempSearchLang && (darkmode ? 'rgba(255, 255, 255, 0.13)' : '#c0c0c06c')
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
        <div className={`searchBox ${(answering || anim) ? "anim" : ""} ${toolMode ? "toolmode" : ""} ${animactive ? "active" : ""} ${expanded ? "expanded" : ""} ${uploadedFiles && uploadedFiles.length > 0 ? "has-files" : ""}`}
          ref={ref}
          onClick={() => window.innerWidth > 768 && inputRef.current.focus()}>
          <div className="btn-wrapper" ref={addOnesRef}>
            <div className={`btn add-btn ${showAddOnes && "active"}`} onClick={() => {
              setShowAddOnes(prev => {
                const next = !prev
                if (next) setActiveAddOneIndex(0)
                return next
              })
            }}>
              <span className="material-symbols-outlined">add</span>
            </div>
            <input
              type="file"
              accept="*"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                handleFileChange(e)
                setShowAddOnes(false)
                addBtn.current.style.display = "none"
                fileInputContainer.current.style.display = "block"
              }}
            />
            {
              showAddOnes && (
                <div className="searchAddOnes">
                  <div
                    className={`searchAddOne ${activeAddOneIndex === 0 ? "selected" : ""}`}
                    onMouseEnter={() => setActiveAddOneIndex(0)}
                    onClick={() => handleAddOneSelect(0)}
                  >
                    <span className="material-symbols-outlined">attach_file</span>
                    <p>Add photos & files</p>
                  </div>
                  <div className="line"></div>
                  <div
                    className={`searchAddOne ${activeAddOneIndex === 1 ? "selected" : ""} ${toolMode && toolName === "draw" ? "active" : ""}`}
                    onMouseEnter={() => setActiveAddOneIndex(1)}
                    onClick={() => handleAddOneSelect(1)}
                  >
                    <Sparkles size={15} />
                    <p>Create image</p>
                  </div>

                  <div
                    className={`searchAddOne ${activeAddOneIndex === 2 ? "selected" : ""} ${toolMode && toolName === "searchweb" ? "active" : ""}`}
                    onMouseEnter={() => setActiveAddOneIndex(2)}
                    onClick={() => handleAddOneSelect(2)}
                  >
                    <Globe size={15} />
                    <p>Search Web</p>
                  </div>

                  <div
                    className={`searchAddOne ${activeAddOneIndex === 3 ? "selected" : ""} ${toolMode && toolName === "learn" ? "active" : ""}`}
                    onMouseEnter={() => setActiveAddOneIndex(3)}
                    onClick={() => handleAddOneSelect(3)}
                  >
                    <GraduationCap size={15} />
                    <p>Guided learning</p>
                  </div>
                </div>
              )
            }
          </div>
          {
            toolMode &&
            <div className="searchTool">
              <span className={`${toolName}`}>
                {
                  toolName === "draw" && <Sparkles size={14} /> ||
                  toolName === "code" && <Code2 size={14} /> ||
                  toolName === "summarise" && <FileText size={14} /> ||
                  toolName === "story" && <PenLine size={14} /> ||
                  toolName === "learn" && <GraduationCap size={16} /> ||
                  toolName === "searchweb" && <Globe size={14} />
                }
              </span>
              <p>{toolName === "searchweb" ? "Search" : toolName}</p>
              <div className="close-btn" onClick={() => {
                setToolMode(false)
                setToolName("")
                setCustomePlaceHolder("")
                setShowSuggestions(false)
                setSuggestionsList([])
                if (inputRef.current?.value.trim() === "") setExpanded(false)
                toolName !== "searchweb" && !searched && toolsRef.current.classList.remove("hide")
              }}>
                <span className="material-symbols-outlined">close</span>
              </div>
            </div>
          }

          {uploadedFiles && uploadedFiles.length > 0 && (
            <div className="searchBoxFilesContainer">
              {uploadedFiles.map((item, index) => (
                <div key={index} className="uploaded-file-item">
                  <div className="file-icon-wrapper">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt={item.file.name} />
                    ) : (
                      <span className="material-symbols-outlined file-icon">description</span>
                    )}
                  </div>
                  <div className="fileInfo">
                    <h4>{item.file.name}</h4>
                    <p>{item.file.size > 1024 * 1024 ? (item.file.size / (1024 * 1024)).toFixed(1) + ' MB' : (item.file.size / 1024).toFixed(1) + ' KB'}</p>
                  </div>
                  <div
                    className="remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                      if (uploadedFiles.length === 1 && inputRef.current?.value.trim() === "" && !toolMode) {
                        setExpanded(false);
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className='searchBoxInputContainer'>
            <textarea
              type="text"
              rows="1"
              placeholder={placeHolder}
              id="promptText"
              ref={inputRef}
              onFocus={() => {
                if (!toolMode && typeof setAnimactive === 'function') { setAnimactive(false) }
                setAnim(true)
                setTimeout(() => {
                  if (inputRef.current && inputRef.current.value === "/" && !toolMode) {
                    setShowAddOnes(true);
                    setActiveAddOneIndex(0);
                    inputRef.current.value = "";
                    inputRef.current.rows = 1;
                    inputRef.current.style.height = "auto";
                    handleInputChange({ target: inputRef.current });
                  }
                }, 0);
              }}
              onBlur={() => setAnim(false)}
              onChange={e => {
                if (e.target.value.endsWith("/")) {
                  setShowAddOnes(true);
                  setActiveAddOneIndex(0);
                  if (e.target.value === "/") {
                    e.target.value = "";
                    e.target.rows = 1;
                    e.target.style.height = "auto";
                  }
                } else {
                  setShowAddOnes(false);
                }
                handleInputChange(e);
              }}
              value={value}
              onKeyDown={e => {
                if (showAddOnes) {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveAddOneIndex(prev => (prev + 1) % 4);
                    return;
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveAddOneIndex(prev => (prev - 1 + 4) % 4);
                    return;
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOneSelect(activeAddOneIndex);
                    return;
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    setShowAddOnes(false);
                    return;
                  }
                }
                if (e.key === "Escape" && toolMode) {
                  e.preventDefault();
                  setToolMode(false)
                  setToolName("")
                  setCustomePlaceHolder("")
                  setShowSuggestions(false)
                  setSuggestionsList([])
                  if (inputRef.current?.value.trim() === "") setExpanded(false)
                  toolName !== "searchweb" && !searched && toolsRef.current.classList.remove("hide")
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.target.value.trim() !== "" && (!answering && window.innerWidth > 768 && onKeyDown());
                }
                if (e.shiftKey && e.key === "Enter") {
                  e.preventDefault();
                  e.target.value = e.target.value + "\n"
                  e.target.rows = e.target.value.split('\n').length;
                  handleInputChange(e)
                }
              }}
            />
          </div>
          <div className='searchBoxButtonContainer'>
            {
              (!toolMode || toolName === "searchweb") &&
              <>
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
                        proEnabled ? "bolt" : "neurology"
                      }
                      active={showModelSelector}
                      title={"Select Model"}
                      body={
                        proEnabled ? "Pro" :
                          selectedModel === "auto" ? "Auto" :
                            selectedModel === "openai/gpt-oss-120b" ? "GPT-OSS-120b" :
                              selectedModel === "llama-3.1-8b-instant" ? "LLaMA 3.1 8B" :
                                selectedModel === "llama-3.3-70b-versatile" ? "LLaMA 3.3 70B" : ""
                      } />

                    {
                      showModelSelector && (
                        <div className="model-selector">
                          <div className="model-selector-head">
                            <p>Modes</p>
                          </div>
                          <div className="model-selector-body">
                            <div className="model-selector-list">
                              <div className="model-selector-list-item" onClick={() => {
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
                              {/* <div className="model-selector-list-item" onClick={() => {
                                setProEnabled(false)
                                setSelectedModel("llama-3.3-70b-versatile")
                                setShowModelSelector(false)
                              }}>
                                <p>LLaMA 3.3 70B (Versatile)</p>
                                <p>Best for everyday use</p>
                              </div> */}
                              <div className="model-selector-list-item switch-container" onClick={() => setProEnabled(!proEnabled)}>
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
                                  <div className={`switch ${proEnabled && "active"}`}>
                                    <div className="switch-btn"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="model-selector-footer">
                              <div className="more-models">
                                <p>More Models</p>
                                <span className="material-symbols-outlined">north_east</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </div>

                  {/* <SelectionChip
                    onClick={() => {
                      showDialog('lang')
                      setShowDialogBox(true)
                    }}
                    icon={'globe'}
                    title={"Response language"}
                    body={searchLang} />
                  <span className='blank' /> */}
                </div>
              </>

            }
          </div>
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

    </>
  )
})

export default SearchBox