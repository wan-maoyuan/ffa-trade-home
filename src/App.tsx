import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsServices from './components/ProductsServices'
import Course from './components/Course'
import ToolsPanel from './components/ToolsPanel' // 新增工具页面组件（待开发）
import SignalPanel from './components/SignalPanel'
import StrategyPanel from './components/StrategyPanel'
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
          <Route path="/product-service/signal" element={<ProductsServices />} />
          <Route path="/product-service/strategy" element={<ProductsServices />} />
          <Route path="/course" element={<Course />} />
          <Route path="/product-service/tool" element={<ToolsPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
