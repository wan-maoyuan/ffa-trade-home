import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsServices from './components/ProductsServices'
import Course from './components/Course'
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/product-service" element={<ProductsServices />} />
          <Route path="/product-service/course" element={<ProductsServices />} />
          <Route path="/course" element={<Course />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
