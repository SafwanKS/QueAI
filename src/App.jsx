import {
  BrowserRouter,
  Route,
  Routes,
  useLocation
} from 'react-router'
import {
  useState,
  useEffect
} from 'react'
import Home from './activities/Home.jsx'
import CodeEditor from './activities/Editor.jsx'
import './css/material-symbols-outlined.css'

function App() {

  const [collapsed, setCollapsed] = useState(false)


  const location = useLocation()
  useEffect(() => {
    if (location.pathname == '/') {
      setCollapsed(false)
    } else {
      setCollapsed(true)
    }
  }, [location.pathname])

  return (
    <main>
      <Routes>
        <Route path='/' element={<Home />} isActive={location.pathname === '/' ? true : false} />
        <Route path='/chat/:chatID' element={<Home />} />
        <Route path="/story/:storyID" element={<Home />} />
        <Route path="/lesson/:lessonID" element={<Home />} />
        <Route path="/library" element={<Home />} />
        <Route path='/createProject' element={<CodeEditor />} />
      </Routes>
    </main>
  )
}
export default App