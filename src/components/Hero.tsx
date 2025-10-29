import React from 'react'
import './Hero.css'
import heroBackgroundImage from '../assets/images/hero-background.png'

const Hero: React.FC = () => {
  return (
    <div className="hero">
      {/* Background Image */}
      <div className="hero-background">
        <img 
          alt="Hero Background" 
          className="background-image"
          src={heroBackgroundImage}
        />
        <div className="background-overlay" />
      </div>

      {/* Gradient Overlay */}
      <div className="gradient-overlay" />

      {/* Main Content */}
      <div className="hero-content">
        <h1 className="hero-title">AQUABRIDGE</h1>
        <p className="hero-subtitle">一站式衍生品综合服务商</p>
      </div>
    </div>
  )
}

export default Hero




