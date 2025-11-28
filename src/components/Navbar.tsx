import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logoImage from '../assets/images/logo-font.png';

const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isProductsPage = location.pathname.startsWith('/product-service')
  const isProductsLandingPage = location.pathname === '/product-service'
  const isProductsSubPage = isProductsPage && !isProductsLandingPage
  const isAboutUsPage = location.pathname === '/about-us'

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={`navbar${isProductsPage ? ' products-page' : ''}${isProductsSubPage ? ' products-sub-page' : ''}${isAboutUsPage ? ' about-us-page' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-backdrop">
            <img
              alt="AQUABRIDGE Logo"
              className="logo-image"
              src={logoImage}
            />
          </div>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className={`hamburger-button ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            首页
          </Link>
          <Link
            to="/product-service"
            className={`nav-item ${isProductsPage ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            产品与服务
          </Link>
          <Link
            to="/about-us"
            className={`nav-item ${isAboutUsPage ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            关于我们
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          <button
            className="navbar-login-btn"
            onClick={() => navigate('/login')}
          >
            登录
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar

