import React, { useState, useRef } from 'react'
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

  return (
    <div className="signal-panel">
      <SideMenu currentPage="signal" />

      {/* 顶部标题和按钮 */}
      <div className="signal-header">
        <div className="signal-title-section">
          <h1 className="signal-title">AQUABRIDGE</h1>
          <p className="signal-subtitle">一站式衍生品综合服务商</p>
        </div>
        <button type="button" className="signal-button">
          <span>信号服务入口</span>
        </button>
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

      {/* 底部文字描述 */}
      <div className="signal-description">
        我们专注于航运市场信号的捕捉。依托海量且全面的航运市场数据，凭借先进的数据分析技术和专业模型，精准识别价格波动信号。这些信号犹如市场的"风向标"，能敏锐反映价格即将发生的变动趋势，无论是上涨还是下跌的先兆，都能及时被我们捕捉到，为用户提前感知市场变化提供关键指引。同时，我们深度剖析基差变化，基差波动往往蕴含着市场供需关系的微妙转变，通过对其细致分析，能进一步洞察市场潜在趋势，为用户把握市场动态提供更丰富的信号参考。
      </div>
    </div>
  )
}

export default SignalPanel
