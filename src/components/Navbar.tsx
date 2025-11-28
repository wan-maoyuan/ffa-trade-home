import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logoImage from '../assets/images/logo-font.png';

import userIcon from '../assets/images/user-icon.svg'

const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isProductsPage = location.pathname.startsWith('/product-service')
  const isProductsLandingPage = location.pathname === '/product-service'
  const isProductsSubPage = isProductsPage && !isProductsLandingPage
  const isAboutUsPage = location.pathname === '/about-us'

  React.useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }

    checkLoginStatus()
    // Listen for storage events to sync across tabs/components
    window.addEventListener('storage', checkLoginStatus)
    // Listen for custom login event for same-tab updates
    window.addEventListener('loginStateChange', checkLoginStatus)

    return () => {
      window.removeEventListener('storage', checkLoginStatus)
      window.removeEventListener('loginStateChange', checkLoginStatus)
    }
  }, [location.pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setShowUserMenu(false)
    navigate('/')
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
          {isLoggedIn ? (
            <div
              className="navbar-user-profile"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="navbar-user-icon">
                <img src={userIcon} alt="User" />
              </div>

              {showUserMenu && (
                <div className="navbar-user-menu">
                  <div className="navbar-user-menu-item" onClick={handleLogout}>
                    退出登录
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="navbar-login-btn"
              onClick={() => navigate('/login')}
            >
              登录
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

