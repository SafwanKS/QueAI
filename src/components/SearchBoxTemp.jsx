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
                        <span className={`${toolName}`}>
                            {
                                toolName === "code" && <Code2 size={17} /> ||
                                toolName === "summarise" && <FileText size={17} /> ||
                                toolName === "story" && <PenLine size={17} /> ||
                                toolName === "learn" && <GraduationCap size={17} />}
                        </span>
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


${ toolMode && (toolName == "draw" && "red" || toolName == "code" && "green" || toolName == "summarise" && "blue" || toolName == "story" && "purple" || toolName == "learn" && "yellow") } 