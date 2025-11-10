import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'
import logoImage from '../assets/images/logo-font.png';
import languageIcon from '../assets/images/language-icon.svg'
import searchIcon from '../assets/images/search-icon.svg'
import userIcon from '../assets/images/user-icon.svg'

const Navbar: React.FC = () => {
  const location = useLocation()
  const isProductsPage = location.pathname.startsWith('/product-service')
  const isAboutUsPage = location.pathname === '/about-us'
  const showUserActions = false

  return (
    <div className={`navbar${isProductsPage || isAboutUsPage ? ' products-page' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-backdrop">
            <img 
              alt="AQUABRIDGE Logo" 
              className="logo-image"
              src={logoImage}
            />
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="navbar-menu">
          <Link 
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            首页
          </Link>
          <Link 
            to="/product-service"
            className={`nav-item ${isProductsPage ? 'active' : ''}`}
          >
            产品与服务
          </Link>
          <Link 
            to="/about-us"
            className={`nav-item ${isAboutUsPage ? 'active' : ''}`}
          >
            关于我们
          </Link>
        </div>

        {/* User Actions - 暂时隐藏 */}
        {showUserActions && (
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
        )}
      </div>
    </div>
  )
}

export default Navbar

