import React, {forwardRef} from "react";

const RightSideBar = forwardRef(({
  drawerCollapsed,
  setDrawerCollapsed,
  searched,
  onSearch,
  isLoggedIn,
  setShowSettings,
  relatedQues,
  Logo,
  setQuestion,
  handleButtonClick,
  question
}, ref) => {

  return (
    <div ref={ref} className="right-sidebar">
        <div className="right-sidebar-header">
            <span className="material-symbols-outlined">manage_search</span>
            <h3>Related</h3>
        </div>
        <div className="right-sidebar-body">
            <div className="related-ques">
                <ul className="related-ques-list">
                    {
                        relatedQues !== null ?
                            relatedQues.map((que, index) => 
                                <li className="related-ques-item" onClick={()=> {
                                    setTimeout(()=>{
                                        handleButtonClick(que)
                                    }, 100)
                                    
                                }} key={index}>
                                    <p>{que}</p>
                                    <span className="material-symbols-outlined">arrow_outward</span>
                                </li>
                            )
                        : 
                            <></>
                    }
                    
                </ul>
            </div>
            <div className="right-sidebar-footer">
            <div className="footer-logo">
                <img src={Logo} alt="" />
                <p className='logo-txt' >Que AI</p>
                <p>Beta &nbsp;v0.1</p>
            </div>
            <div className="dvlpr">
                {/* <p>Designed & Developed by <a href='https://github.com/SafwanKS' onClick={(e)=> {
                e.preventDefault()
                window.open("https://github.com/SafwanKS")
                }}>Safwan KS</a></p> */}
            </div>
            <div className="social-media-handle-container">
                <div className="github">
                
                </div>
                <div className="instagram"></div>
                <div className="gmail"></div>
            </div>
            </div>
        </div>
    </div>
  );
})

export default RightSideBar
