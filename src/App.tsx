import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductsServices from './components/ProductsServices'
import './styles/App.css'

type Page = 'home' | 'products'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const handlePageChange = (page: Page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero />
      case 'products':
        return <ProductsServices />
      default:
        return <Hero />
    }
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      {renderPage()}
    </div>
  )
}

export default App
