import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './SignalPanel.css'
import SideMenu from './SideMenu'
import FFASignalPage from './signal-pages/FFASignalPage'
import SinglePositionSignalPage from './signal-pages/SinglePositionSignalPage'
import DoublePositionSignalPage from './signal-pages/DoublePositionSignalPage'

const SignalPanel: React.FC = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
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

  const handleRealtimeSignalClick = () => {
    navigate('/product-service/signal/realtime')
  }

  return (
    <div className="signal-panel">
      <SideMenu currentPage="signal" />

      {/* 顶部信息区域 */}
      <div className="signal-hero">
        <div className="signal-hero-content">
          <span className="signal-eyebrow">Market Signals</span>
          <h1 className="signal-hero-title">航运衍生品信号洞察</h1>
          <div className="signal-hero-detail">
          聚焦全球航运市场的价差、基差与运价指标，通过数据建模与实时监测，帮助您的团队更快捕捉行情变化，建立前瞻性的交易视角。
          我们以多维度数据为基础，持续追踪航运市场的结构性变化，甄别各类价格驱动因素，形成透明、可解释的信号体系，让决策者能够更早洞察趋势。
          无论是短期波动还是中长期周期，我们提供的指标与解读都可协助团队制定行动计划，兼顾风险控制与收益捕捉。
          </div>
          <button 
            className="signal-entry-button" 
            onClick={handleRealtimeSignalClick}
            type="button"
          >
            信号入口
          </button>
        </div>
      </div>

      {/* 轮播图容器 */}
      <div className="signal-carousel-container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          className="signal-swiper"
        >
          <SwiperSlide>
            <FFASignalPage />
          </SwiperSlide>
          <SwiperSlide>
            <SinglePositionSignalPage />
          </SwiperSlide>
          <SwiperSlide>
            <DoublePositionSignalPage />
          </SwiperSlide>
        </Swiper>

        {/* 圆形按钮控制 */}
        <div className="signal-carousel-controls">
          <button
            type="button"
            className={`signal-control-btn ${activeIndex === 0 ? 'active' : ''}`}
            onClick={() => handleButtonClick(0)}
          >
            1
          </button>
          <button
            type="button"
            className={`signal-control-btn ${activeIndex === 1 ? 'active' : ''}`}
            onClick={() => handleButtonClick(1)}
          >
            2
          </button>
          <button
            type="button"
            className={`signal-control-btn ${activeIndex === 2 ? 'active' : ''}`}
            onClick={() => handleButtonClick(2)}
          >
            3
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignalPanel
