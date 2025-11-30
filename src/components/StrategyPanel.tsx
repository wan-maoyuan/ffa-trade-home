import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './StrategyPanel.css'
import strategyBackground from '../assets/images/strategy-background.jpeg'
import SideMenu from './SideMenu'
import SinglePositionEvaluation from './strategy-pages/SinglePositionEvaluation'
import SinglePositionChart from './strategy-pages/SinglePositionChart'
import DoublePositionEvaluation from './strategy-pages/DoublePositionEvaluation'
import DoublePositionChart from './strategy-pages/DoublePositionChart'
import LoginModal from './LoginModal'

const StrategyPanel: React.FC = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
  }

  const handleButtonClick = (index: number) => {
    setActiveIndex(index)
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  const handleStrategyDecisionClick = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setShowLoginModal(true)
      return
    }
    navigate('/product-service/strategy/decision')
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    navigate('/login')
  }

  return (
    <div className="strategy-panel" data-node-id="1:1966">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
      />
      {/* 背景与渐变遮罩 */}
      <div className="strategy-bg">
        <img alt="策略背景" src={strategyBackground} />
        <div className="strategy-bg-mask" />
      </div>

      <SideMenu currentPage="strategy" />

      {/* 顶部信息区域 */}
      <div className="strategy-hero">
        <div className="strategy-hero-content">
          <span className="strategy-eyebrow">Strategic Advisory</span>
          <h1 className="strategy-hero-title">航运衍生品策略赋能</h1>
          <div className="strategy-hero-detail">
            <p>
              我们依托精准的价格波动信号捕捉系统，结合深厚的航运市场研究底蕴与实时形势研判，为您量身定制多空交易策略。不仅提供切实可行的操作指引，助您敏锐捕捉市场良机；更通过对基差变化的深度剖析，全方位解读市场趋势。我们致力于帮您在复杂多变的航运市场中拨云见日，制定贴合实际的投资组合，实现决策智慧与收益最大化的双重跃升。
            </p>
          </div>
          <button
            className="strategy-entry-button"
            onClick={handleStrategyDecisionClick}
            type="button"
          >
            策略入口
          </button>
        </div>
      </div>

      {/* 轮播图容器 */}
      <div className="strategy-carousel-container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          className="strategy-swiper"
        >
          <SwiperSlide>
            <SinglePositionEvaluation />
          </SwiperSlide>
          <SwiperSlide>
            <DoublePositionEvaluation />
          </SwiperSlide>
        </Swiper>

        {/* 圆形按钮控制 */}
        <div className="strategy-carousel-controls">
          <button
            type="button"
            className={`strategy-control-btn ${activeIndex === 0 ? 'active' : ''}`}
            onClick={() => handleButtonClick(0)}
          >
            1
          </button>
          <button
            type="button"
            className={`strategy-control-btn ${activeIndex === 1 ? 'active' : ''}`}
            onClick={() => handleButtonClick(1)}
          >
            2
          </button>
        </div>
      </div>
    </div>
  )
}

export default StrategyPanel
