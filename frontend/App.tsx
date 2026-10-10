import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { WeekPage } from './pages/WeekPage'
import { RegisterReceiptPage } from './pages/RegisterReceiptPage'
import { HaulsPage } from './pages/HaulsPage'
import { HaulPage } from './pages/HaulPage'
import { RecipePage } from './pages/RecipePage'
import { RequireAuth } from './auth/Auth'
import { LoginPage } from "./pages/LoginPage"

function App() {
  return (
    <div className="flex flex-col w-full min-w-0 h-full min-h-dvh">
      <Navbar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<WeekPage/>} path="/" />
          <Route element={<HaulsPage/>} path="/hauls" />
          <Route element={<HaulPage/>} path="/hauls/:haulID" />
          <Route element={<RegisterReceiptPage/>} path="/register-receipt" />
          <Route element={<RecipePage/>} path="/recipes/:recipeID" />
        </Route>
      </Routes>
    </div>
  )
}


export default App
