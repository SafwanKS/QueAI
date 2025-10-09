import React from 'react'
import '../css/Canvas.css'
import { forwardRef, useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'


const Canvas = forwardRef(({
    handleClearChat,
    canvasImages,
    setShowGenImage,
    downloadImage
}, ref) => { 

    const [showList, setShowList] = useState(false)
    const lastElement = useRef(null)
    const canvasHome = useRef(null)
    const canvasChat = useRef(null)

    useEffect(()=>{
        if(canvasImages && canvasImages[0]){
            if(canvasHome.current){
                canvasHome.current.classList.add("hideCanvas")
                setTimeout(() => {
                    setShowList(true)
                    setTimeout(() => {
                        canvasChat.current.classList.add("showCanvas")
                    }, 100);
                }, 300);
            }
            const node = lastElement.current
            if(canvasImages[canvasImages.length - 1].img == null && node) node.scrollIntoView(true)
        }
    }, [canvasImages]) 

    return(
        <div className="canvas" ref={ref}>
            <div className="canvas-header">
                {/* <div className="canvas-header-col">
                    <div className="back_btn" onClick={() => {
                        handleClearChat()
                    }} >
                    <span className="material-symbols-outlined">arrow_back</span>
                    </div>
                    <h1></h1>
                </div> */}
                <div className="canvas-header-col">
                    {
                        showList && 
                        <div className="canvas-chip">
                            <span className='material-symbols-outlined'>animated_images</span>
                            <p>Canvas</p>
                        </div>
                    }
                    
                </div>
                {/* <div className="canvas-header-col">
                    <div className="more_btn">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </div>
                </div> */}
            </div>
            <div className="canvas-body" >
                {
                    showList ?
                    <div className="canvas-chat" ref={canvasChat}>
                        {
                            canvasImages.map((item, index) => 
                            <div className="canvas-chat-item" key={index} ref={index === canvasImages.length - 1 ? lastElement : null}>
                                <div className="user-prompt">
                                    {
                                        item.previewImg && (<img src={item.previewImg} alt="preview" />)
                                    }
                                    {
                                        item.title && (<p>{item.title}</p>)
                                    }
                                </div>
                                {
                                    item.img && item.img.base64Data ?
                                    <div className="response-image">
                                        <div className="img-overlay">
                                            <div className="download-btn" onClick={()=> downloadImage(item)}>
                                                <span className="material-symbols-outlined">download</span>
                                            </div>
                                        </div>
                                        <img src={`data:${item.img.mimeType};base64,${item.img.base64Data}`}
                                         alt={item.title} 
                                         onClick={()=>{
                                            setShowGenImage({
                                                show: true,
                                                index: index
                                            })
                                         }}
                                         />
                                    </div>

                                    :

                                    <div className="imageLoading">
                                        <div className="loading">
                                            <div className="spinner">
                                            <div className="bar1"></div>
                                            <div className="bar2"></div>
                                            <div className="bar3"></div>
                                            <div className="bar4"></div>
                                            <div className="bar5"></div>
                                            <div className="bar6"></div>
                                            <div className="bar7"></div>
                                            <div className="bar8"></div>
                                            <div className="bar9"></div>
                                            <div className="bar10"></div>
                                            <div className="bar11"></div>
                                            <div className="bar12"></div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                
                            </div>
                            )
                        }
                        
                    </div>

                    :

                    <div className="canvas-home" ref={canvasHome}>
                        <div className="canvac-chip-container">
                            <div className="canvas-chip">
                                <span className='material-symbols-outlined'>animated_images</span>
                                <p>Canvas</p>
                            </div>
                        </div>
                        <h1>Create an image</h1>
                        <p>Turn your imagination into reality</p>
                        <div className="imageStack">
                            <img src="/canvasimg2.jpg" alt="" />
                            <img src="/canvasimg1.jpg" alt="" />
                            <img src="/canvasimg3.webp" alt="" />
                        </div>
                    </div>
                }
                

                
            </div>
        </div>
    )
})

export default Canvas