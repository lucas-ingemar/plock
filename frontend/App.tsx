import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { WeekPage } from './pages/WeekPage'

function App() {
  return (
    <div className="w-full h-full">
      <Navbar/>
      <Routes>
        <Route element={<WeekPage/>} path="/" />
      </Routes>
    </div>
  )
}


export default App
