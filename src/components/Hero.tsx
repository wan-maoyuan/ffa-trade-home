import { Link } from 'react-router-dom'
import './Hero.css'
import heroBackgroundImage from '../assets/images/hero-background.png'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-media">
        <img
          alt="远洋货轮行进在深蓝海面"
          className="hero-media-image"
          src={heroBackgroundImage}
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-gradient" />

      <div className="hero-content">
        <span className="hero-eyebrow">Global Maritime Derivatives</span>
        <h1 className="hero-title">AQUABRIDGE</h1>
        <p className="hero-subtitle">One Stop Derivatives Service Provider</p>
        <p className="hero-description">
          我们以国际化视野链接航运、贸易与金融伙伴，提供端到端的风险管理、策略咨询与交易执行支持，让衍生品能力成为企业全球化布局的核心竞争力。
        </p>
        <div className="hero-actions">
          <Link className="hero-button hero-button-primary" to="/product-service">
            探索产品与服务
          </Link>
          <Link className="hero-button hero-button-secondary" to="/about-us">
            了解我们的团队
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero