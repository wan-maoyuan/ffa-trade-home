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

      {/* 顶部信息区域 */}
      <div className="strategy-hero">
        <div className="strategy-hero-content">
          <span className="strategy-eyebrow">Strategic Advisory</span>
          <h1 className="strategy-hero-title">航运衍生品策略赋能</h1>
          <p className="strategy-hero-text">
            结合对航运供需、运价周期与金融衍生品的深度洞察，我们为企业构建一体化的策略框架，实现风险对冲、收益放大与资本效率提升的平衡。
          </p>
          <div className="strategy-hero-detail">
            <p>
              我们将信号洞察转化为可执行的策略，配合专业团队的定制化陪伴，帮助您在复杂多变的市场中保持敏捷与稳健。
            </p>
            <p>
              通过动态评估仓位组合、仿真回测和风险情景分析，策略建议始终与业务节奏相匹配，助力团队建立长期可持续的衍生品体系。
            </p>
          </div>
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
