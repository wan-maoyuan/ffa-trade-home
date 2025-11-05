import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CoursePanel.css'

interface SideMenuProps {
  currentPage: 'signal' | 'strategy'
}

const SideMenu: React.FC<SideMenuProps> = ({ currentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleToggle = () => setMenuOpen(v => !v)

  const goSignals = () => {
    navigate('/product-service/signal')
    setMenuOpen(false)
  }
  const goStrategy = () => {
    navigate('/product-service/strategy')
    setMenuOpen(false)
  }

  return (
    <>
      {/* 左侧浮动开关与菜单 */}
      <button
        type="button"
        className={`floating-toggle ${menuOpen ? 'open' : ''}`}
        onClick={handleToggle}
        aria-expanded={menuOpen}
        aria-label="展开/折叠菜单"
      >
        <span className="chevron" />
      </button>

      <div className={`floating-menu ${menuOpen ? 'show' : ''}`}>
        <button 
          type="button" 
          className={`floating-item ${currentPage === 'signal' ? 'active' : ''}`} 
          onClick={goSignals}
        >
          信号
        </button>
        <button 
          type="button" 
          className={`floating-item ${currentPage === 'strategy' ? 'active' : ''}`} 
          onClick={goStrategy}
        >
          策略
        </button>
      </div>
    </>
  )
}

export default SideMenu

