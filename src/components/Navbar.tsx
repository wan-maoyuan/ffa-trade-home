import React from 'react'
import './Navbar.css'
import logoFontImage from '../assets/images/logo-font.png'
import languageIcon from '../assets/images/language-icon.svg'
import searchIcon from '../assets/images/search-icon.svg'
import userIcon from '../assets/images/user-icon.svg'

type Page = 'home' | 'products'

interface NavbarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const handleNavClick = (page: Page) => {
    onPageChange(page)
  }

  return (
    <div className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-backdrop">
            <img 
              alt="AQUABRIDGE Logo" 
              className="logo-image"
              src={logoFontImage}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="navbar-menu">
          <p 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            首页
          </p>
          <p 
            className={`nav-item ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => handleNavClick('products')}
          >
            产品与服务
          </p>
          <p className="nav-item">投资者关系</p>
          <p className="nav-item">关于我们</p>
        </div>

        {/* User Actions */}
        <div className="navbar-user">
          <div className="user-actions">
            <div className="action-icon">
              <img 
                alt="Language" 
                className="icon-image"
                src={languageIcon}
              />
            </div>
            <div className="action-icon">
              <img 
                alt="Search" 
                className="icon-image"
                src={searchIcon}
              />
            </div>
            <div className="action-icon">
              <img 
                alt="User" 
                className="icon-image"
                src={userIcon}
              />
            </div>
          </div>
          <p className="user-name">Nikki</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar

