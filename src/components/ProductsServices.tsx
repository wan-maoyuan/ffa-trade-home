import React, { useState } from 'react'
import './ProductsServices.css'

// 导入本地图片资源
import logoImage from '../assets/images/logo.png'
import decorativeImage from '../assets/images/decorative-image.png'
import arrowIcon from '../assets/images/arrow-icon.png'
import routeIcon from '../assets/images/route-icon.png'
import chartLine from '../assets/images/chart-line.png'
import chartFrame from '../assets/images/chart-frame.png'
import chartVector from '../assets/images/chart-vector.png'

const ProductsServices: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: '运费转换工具',
      description: '程租期租运费转换',
      content: (
        <div className="freight-conversion-content">
          <div className="conversion-section">
            <div className="conversion-card">
              <div className="conversion-header">
                <span className="conversion-label">程租</span>
                <img src={arrowIcon} alt="转换箭头" className="conversion-arrow" />
                <span className="conversion-label">期租</span>
              </div>
              <div className="conversion-values">
                <span className="value">美元/吨</span>
                <span className="value">0/天</span>
              </div>
            </div>
            <div className="conversion-card">
              <div className="conversion-header">
                <span className="conversion-label">期租</span>
                <img src={arrowIcon} alt="转换箭头" className="conversion-arrow" />
                <span className="conversion-label">程租</span>
              </div>
              <div className="conversion-values">
                <span className="value">12000/天</span>
                <span className="value">0美元/吨</span>
              </div>
            </div>
          </div>
          <div className="calculation-section">
            <div className="calculation-item">
              <span className="label">净租金收入/美元：</span>
              <span className="amount">12000</span>
            </div>
            <div className="calculation-item">
              <span className="label">总天数：</span>
              <span className="amount">30</span>
            </div>
            <div className="calculation-item">
              <span className="label">实际盈亏/美元：</span>
              <span className="amount">0</span>
            </div>
          </div>
          <div className="swap-date">
            掉期日期： 2025-06-23
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '最优船舶工具',
      description: '船舶最优航线',
      content: (
        <div className="ship-optimization-content">
          <div className="route-section">
            <div className="route-card">
              <div className="route-header">
                <img src={routeIcon} alt="航线图标" className="route-icon" />
                <span className="route-label">航线</span>
                <span className="rent-label">期租金：</span>
                <span className="rent-unit">美元/天</span>
              </div>
            </div>
            <div className="optimization-button">
              船舶最优航线
            </div>
            <div className="ship-info">
              <span className="ship-label">船舶：</span>
              <span className="swap-date">掉期日期： 2025-06-23</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '最优业务工具',
      description: '船舶最优航线',
      content: (
        <div className="business-optimization-content">
          <div className="route-section">
            <div className="route-card">
              <div className="route-header">
                <img src={routeIcon} alt="航线图标" className="route-icon" />
                <span className="route-label">航线</span>
                <span className="rent-label">期租金：</span>
                <span className="rent-unit">美元/天</span>
              </div>
            </div>
            <div className="optimization-button">
              船舶最优航线
            </div>
            <div className="ship-info">
              <span className="ship-label">船舶：</span>
              <span className="swap-date">掉期日期： 2025-06-23</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '模拟交易',
      description: '策略回顾',
      content: (
        <div className="trading-simulation-content">
          <div className="strategy-section">
            <div className="strategy-header">策略回顾</div>
            <div className="trading-stats">
              <div className="stat-item">
                <span className="stat-label">交易时间/天</span>
                <span className="stat-value">6</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">交易次数/次</span>
                <span className="stat-value">2</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">交易量/手</span>
                <span className="stat-value">45</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">总盈利/元</span>
                <span className="stat-value">-326849</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">年化收益率/%</span>
                <span className="stat-value">-1988%</span>
              </div>
            </div>
          </div>
          <div className="chart-section">
            <img src={chartFrame} alt="交易图表" className="chart-image" />
            <img src={chartLine} alt="交易曲线" className="chart-line" />
            <img src={chartVector} alt="交易向量" className="chart-vector" />
          </div>
          <div className="trading-table">
            <div className="table-header">
              <span>合约名称</span>
              <span>日期</span>
              <span>策略</span>
              <span>价格/元</span>
              <span>交易量/手</span>
              <span>持仓量/手</span>
              <span>交易总额/元</span>
              <span>资金占用率</span>
              <span>前期累计盈亏/元</span>
              <span>累计权益/元</span>
            </div>
            <div className="table-row">
              <span>8月合约</span>
              <span>2025-07-15</span>
              <span>开多</span>
              <span>21500</span>
              <span>15</span>
              <span>30</span>
              <span>327500</span>
              <span>61%</span>
              <span>52651</span>
              <span>1052650</span>
            </div>
            <div className="table-row">
              <span>8月合约</span>
              <span>2025-07-21</span>
              <span>平多</span>
              <span>23400</span>
              <span>30</span>
              <span>60</span>
              <span>702000</span>
              <span>209%</span>
              <span>-326849</span>
              <span>673151</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '运费转换工具',
      description: '程租期租运费转换',
      content: (
        <div className="freight-conversion-content">
          <div className="position-section">
            <div className="position-card">
              <div className="position-header">现货多单</div>
              <div className="position-list">
                <div className="position-item">
                  <span className="voyage-name">TIANYI 8820250715</span>
                  <span className="remaining-days">剩余天数/天：8</span>
                  <span className="amount">未执行总额/美元：105848</span>
                </div>
                <div className="position-item">
                  <span className="voyage-name">20250721F0油型号</span>
                  <span className="remaining-days">剩余天数/天：-</span>
                  <span className="amount">未执行总额/美元：456000</span>
                </div>
              </div>
            </div>
            <div className="position-card">
              <div className="position-header">现货空单</div>
              <div className="position-list">
                <div className="position-item">
                  <span className="voyage-name">TIANYI 8820250715coal</span>
                  <span className="remaining-days">剩余天数/天：8</span>
                  <span className="amount">未执行总额/美元：108000</span>
                </div>
              </div>
            </div>
          </div>
          <div className="summary-section">
            <div className="summary-item">
              <span className="label">多单汇总/美元</span>
              <span className="amount">1230676</span>
            </div>
            <div className="summary-item">
              <span className="label">空单汇总/美元：</span>
              <span className="amount">204000</span>
            </div>
            <div className="summary-item">
              <span className="label">净多/美元：</span>
              <span className="amount">1026676</span>
            </div>
          </div>
        </div>
      )
    }
  ]


  const goToSlide = (index: number) => {
    console.log('点击按钮:', index + 1, '当前轮播图:', currentSlide + 1)
    setCurrentSlide(index)
  }

  return (
    <div className="products-services">
      {/* Background */}
      <div className="products-background">
        <div className="background-gradient" />
      </div>

      {/* Main Content */}
      <div className="products-content">
        {/* Title Section */}
        <div className="title-section">
          <h1 className="main-title">AQUABRIDGE</h1>
          <p className="main-subtitle">一站式衍生品综合服务商</p>
          <p className="english-subtitle">One-stop derivatives integrated service provider</p>
        </div>

        {/* Description */}
        <div className="description-section">
          <p className="description-text">
            <span className="highlight">本工具专为航运从业者打造，提供程租/期租智能转换、船-航线精准匹配及头寸风控管理一站式解决方案。通过实时整合燃油价格、港口费用、船舶性能等数据，实现租船模式灵活转换；基于船舶参数、航线特征与货盘需求智能推荐最优配对；</span>
            同时归集现货与衍生品头寸，助力用户快速评估业务收益与风险、优化船队部署并捕捉市场套利机会，实现科学决策与运营增效。
          </p>
        </div>

        {/* Carousel Container */}
        <div className="carousel-container">
          {/* Carousel Slides */}
          <div className="carousel-wrapper">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={slide.id} className="carousel-slide">
                  <div className="slide-content">
                    <div className="slide-card">
                      <h3 className="slide-title">{slide.title}</h3>
                      <div className="slide-body">
                        <div className="slide-description">{slide.description}</div>
                        <div className="slide-details">{slide.content}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Slide Indicators */}
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('按钮点击事件触发:', index + 1)
                  goToSlide(index)
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  console.log('按钮按下:', index + 1)
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Entry Button */}
        <div className="tool-entry-section">
          <button className="tool-entry-button">
            工具入口
          </button>
        </div>

        {/* Decorative Image */}
        <div className="decorative-image">
          <img 
            alt="Decorative Element" 
            className="decorative-img"
            src={decorativeImage}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductsServices
