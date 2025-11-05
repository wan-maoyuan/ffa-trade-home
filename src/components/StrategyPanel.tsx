import React, { useState, useRef } from 'react'
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

const StrategyPanel: React.FC = () => {
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
    <div className="strategy-panel" data-node-id="1:1966">
      {/* 背景与渐变遮罩 */}
      <div className="strategy-bg">
        <img alt="策略背景" src={strategyBackground} />
        <div className="strategy-bg-mask" />
      </div>

      <SideMenu currentPage="strategy" />

      {/* 居中内容区域 */}
      <div className="strategy-content">
        <h1 className="strategy-title">AQUABRIDGE</h1>
        <p className="strategy-subtitle">一站式衍生品综合服务商</p>
        <button type="button" className="strategy-button">
          <span>策略服务入口</span>
        </button>
        <div className="strategy-desc">
          在策略服务方面，我们根据精准捕捉到的价格波动信号，为用户量身定制做多或做空策略建议。结合对航运市场长期的研究和经验积累，以及当前市场形势的判断，为用户提供切实可行的操作方向，助力用户抓住市场机会。并且，基于对基差变化的深度分析，我们帮助用户更全面地理解市场趋势，综合考虑各种因素，为用户制定出更贴合市场实际的投资策略，让用户在复杂多变的航运市场中，能够做出明智决策，从而实现收益最大化。
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
            <SinglePositionChart />
          </SwiperSlide>
          <SwiperSlide>
            <DoublePositionEvaluation />
          </SwiperSlide>
          <SwiperSlide>
            <DoublePositionChart />
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
          <button
            type="button"
            className={`strategy-control-btn ${activeIndex === 2 ? 'active' : ''}`}
            onClick={() => handleButtonClick(2)}
          >
            3
          </button>
          <button
            type="button"
            className={`strategy-control-btn ${activeIndex === 3 ? 'active' : ''}`}
            onClick={() => handleButtonClick(3)}
          >
            4
          </button>
        </div>
      </div>
    </div>
  )
}

export default StrategyPanel
