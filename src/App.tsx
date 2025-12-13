import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsServices from './components/ProductsServices'
import AboutUs from './components/AboutUs'
import LoginPage from './components/LoginPage'
import UserManagementPage from './components/UserManagementPage'
import FFALesson1Page from './components/FFALesson1Page'
import PredictionPage from './pages/PredictionPage'
import './styles/App.css'

function AppContent() {
  const location = useLocation()
  const isLessonPage = location.pathname.startsWith('/lesson')

  return (
    <div className="app">
      {!isLessonPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/product-service" element={<ProductsServices />} />
        <Route path="/product-service/signal" element={<ProductsServices />} />
        <Route path="/product-service/signal/realtime" element={<ProductsServices />} />
        <Route path="/product-service/strategy" element={<ProductsServices />} />
        <Route path="/product-service/strategy/decision" element={<ProductsServices />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/lesson/ffa-lesson-1" element={<FFALesson1Page />} />
        <Route path="/prediction" element={<PredictionPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
