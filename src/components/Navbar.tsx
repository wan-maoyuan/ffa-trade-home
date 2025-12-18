import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logoImage from '../assets/images/logo-font.png';

import userIcon from '../assets/images/user-icon.svg'

import { useTheme } from '../context/ThemeContext'

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
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
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

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
                  {isLoggedIn && JSON.parse(localStorage.getItem('user') || '{}').permission === 99 && (
                    <div
                      className="navbar-user-menu-item"
                      onClick={() => {
                        setShowUserMenu(false)
                        navigate('/user-management')
                      }}
                    >
                      用户管理
                    </div>
                  )}
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

