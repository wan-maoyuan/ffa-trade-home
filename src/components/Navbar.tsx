import React from 'react'
import './Navbar.css'

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
              src="https://www.figma.com/api/mcp/asset/b6d4c1d9-7392-4cbd-930a-4c1d64f2acaf"
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
                src="https://www.figma.com/api/mcp/asset/9311bb3e-b576-4d8b-83d3-33699ec2e26e"
              />
            </div>
            <div className="action-icon">
              <img 
                alt="Search" 
                className="icon-image"
                src="https://www.figma.com/api/mcp/asset/5a8089d2-732b-4b4e-bca2-cce8bbe8bb24"
              />
            </div>
            <div className="action-icon">
              <img 
                alt="User" 
                className="icon-image"
                src="https://www.figma.com/api/mcp/asset/c8a500d7-ec8b-40f2-b5c6-1a3b0effc885"
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

