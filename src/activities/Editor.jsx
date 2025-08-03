import React, {useRef, useState, useEffect} from 'react'
import '../css/Editor.css'
import { signInWithPopup, GoogleAuthProvider , onAuthStateChanged} from "firebase/auth";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/ext-language_tools";

import ReactJson from 'react-json-view';
import {auth} from '../firebase.js'
import {askai, askaiStream, relatedAI, getCodeAI} from '../Gemini.js'
import {
    replace,
  useNavigate
} from 'react-router'
import Logo from '../assets/logosmall.png'
import { settings } from 'firebase/analytics';



export default function CodeEditor(){

    const splashRef = useRef(null)
    const sideBar = useRef(null)
    const [user, setUser] = useState()

    const [jsonData, setJsonData] = useState(null)

    const [projectName, setProjectName] = useState("")

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");

    const handleSelect = (filename, content) => {
        setSelectedFile(filename);
        setFileContent(content);
    };

    const extractProjectName = (json) => {
        if (!json || typeof json !== 'object') return null;
        return json.name; 
    };

    const combineStaticWeb = (json) => {
        const projectName = extractProjectName(jsonData)
        const html = json.src.html;
        const css = json.src.css;
        const js = json.src.js;
        const finalHtml = html
            .replace('</head>', `<style>${css}</style></head>`)
            .replace('</body>', `<script>${js}</script></body>`);
        return finalHtml;
    };

    const [combinedCode, setCombinedCode] = useState("");

    const handleRun =  async() => {
        console.log(jsonData)
        const code = await combineStaticWeb(jsonData);
        setCombinedCode(code);
        console.log(combinedCode)
        const win = window.open();
        win.document.write(code);
        win.document.close();
    };


    const extractJsonFromText = (text) => {
        const match = text.match(/{[^]*}/); // grabs the first { ... } block
        if (!match) return null;
        try {
            return JSON.parse(match[0]);
        } catch (err) {
            console.error("Still broken JSON:", err);
            return null;
        }
    }
    const navigate = useNavigate()
    
    useEffect(()=>{
        ( async () =>{
            const params = new URLSearchParams(window.location.search);
            const prompt = params.get('prompt');
            try {
              const result = await getCodeAI(prompt)
              const parsed = extractJsonFromText(result)
              setProjectName(extractProjectName(parsed))
              setJsonData(parsed)
              splashRef.current.style.display = "none"
              splashRef.current.style.pointerEvents = "none";  
            } catch (err) {
                console.log(err)
                alert("Can't create project. Try again.")
            }   
        }
        )()
    }, [])

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            if(user){
                setUser(user)
            }else{
                navigate("/", {replace: "true"})
            }
        })
        return () => unsubscribe()
    }, [])

    const handleClick = (edit) => {
    console.log('Clicked:', edit.name, edit.src); // You can customize this
  };

    return(
        <>
         <div className="splash" ref={splashRef}>
            <img src={Logo} alt="" />
            <h3>Creating project...</h3>
            <div className="loading">
                <div className="loadingbar"></div>
            </div>
        </div>
        <div className="editor">
            <div className="editorHeader">
                <span  className="material-symbols-outlined" style={{
                    paddingTop: "2px",
                    color: "rgb(45, 250, 62)"
                }}>code</span>
                <h3>Editor</h3>
                 <input className="projectName" type="text" defaultValue={projectName} />
                <div className="gap"></div>
                <div className="runBtn" onClick={handleRun}>
                    <span className="material-symbols-outlined">play_circle</span>
                    <p>Run</p> 
                </div>
                <img style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%"
                }} src={user && user.photoURL} alt="" />
            </div>
            <div className="subMenu">
                <div className="menuItem">File</div>
                <div className="menuItem">View</div>
                <div className="menuItem" onClick={handleRun} >Run</div>
                <div className="menuItem">Help</div>
            </div>
            <div className="editorWindow">
                <div className="sideBar" ref={sideBar}>
                    <div className={`sideBarItem ${selectedFile === "html" && "active"}`} onClick={()=> handleSelect("html", jsonData.src.html)}>
                        <span className="material-symbols-outlined" style={{
                            fontSize: "16px",
                            color: "orange"
                        }} >code</span>
                        <p>index.html</p>
                    </div>
                    <div className={`sideBarItem ${selectedFile === "css" && "active"}`} onClick={()=> handleSelect("css", jsonData.src.css)}>
                        <span className="material-symbols-outlined" style={{
                            fontSize: "16px",
                            color: "rgba(50, 50, 255, 1)"
                        }}>code</span>
                        <p>index.css</p>
                    </div>
                    <div className={`sideBarItem ${selectedFile === "js" && "active"}`} onClick={()=> handleSelect("js", jsonData.src.js)}>
                        <span className="material-symbols-outlined" style={{
                            fontSize: "16px",
                            color: "yellow"
                        }}>code</span>
                        <p>script.js</p>
                    </div>
                </div>
                
                <div className="code-editor">
                     <CodeMirror
                        value={fileContent}
                        height="100px"
                        width="100%"
                        theme={vscodeDark}
                    />
                </div>
            </div>
            
        </div>
        </>
    )
}

