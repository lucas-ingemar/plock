import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { WeekPage } from './pages/WeekPage'
import { RegisterReceiptPage } from './pages/RegisterReceiptPage'
import { HaulsPage } from './pages/HaulsPage'
import { HaulPage } from './pages/HaulPage'

function App() {
  return (
    <div className="flex flex-col w-full min-w-0 min-h-dvh">
      <Navbar/>
      <Routes>
        <Route element={<WeekPage/>} path="/" />
        <Route element={<HaulsPage/>} path="/hauls" />
        <Route element={<HaulPage/>} path="/hauls/:haulID" />
        <Route element={<RegisterReceiptPage/>} path="/register-receipt" />
      </Routes>
    </div>
  )
}


export default App
