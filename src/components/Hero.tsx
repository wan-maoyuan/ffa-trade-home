import React from 'react'
import './Hero.css'

const Hero: React.FC = () => {
  return (
    <div className="hero">
      {/* Background Image */}
      <div className="hero-background">
        <img 
          alt="Hero Background" 
          className="background-image"
          src="https://www.figma.com/api/mcp/asset/a93d1e68-8d00-4f3f-b416-64f7a37303c8"
        />
        <div className="background-overlay" />
      </div>

      {/* Gradient Overlay */}
      <div className="gradient-overlay" />

      {/* Decorative Rectangle */}
      <div className="decorative-rectangle">
        <img 
          alt="Decorative Element" 
          className="rectangle-image"
          src="https://www.figma.com/api/mcp/asset/424f04bb-09ef-4c77-8e80-35fac16559d6"
        />
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <h1 className="hero-title">AQUABRIDGE</h1>
        <p className="hero-subtitle">一站式衍生品综合服务商</p>
      </div>
    </div>
  )
}

export default Hero




