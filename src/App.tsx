import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsServices from './components/ProductsServices'
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/product-service" element={<ProductsServices />} />
          <Route path="/product-service/signal" element={<ProductsServices />} />
          <Route path="/product-service/strategy" element={<ProductsServices />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
