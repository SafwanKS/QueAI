import {React, forwardRef} from 'react'
import '../css/Stories.css'

const Stories = forwardRef(({
    stories
}, ref) => {
    return(
        <div className='stories'>
            <div className="stories-header">
                <div className="stories-header-left">
                    <div className="back_btn btn" onClick={() => {

                    }} >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </div>
                </div>
                <div className="stories-header-right"></div>
            </div>
            <div className="stories-body">
                <div className="stories-intro">
                    <h1> <span className="material-symbols-outlined">animated_images</span> Stories</h1>
                </div>
                <div className="stories-list">
                    {
                        stories.map((story, index)=> ( 
                            <div className="story-item">
                                {story.title}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
})


export default Stories