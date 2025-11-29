import React from 'react'
import './StrategyPage.css'
import strategyCarouselBg from '../../assets/images/strategy-carousel-bg.png'

const SinglePositionEvaluation: React.FC = () => {
  return (
    <div className="strategy-page single-position-evaluation-page">


      <div className="strategy-page-content-wrapper">
        <p className="strategy-page-title">单头寸策略评价</p>

        <div className="single-position-evaluation-content">
          {/* 策略标签 */}
          <div className="strategy-chips">
            <button type="button" className="strategy-chip">做多胜率统计</button>
            <button type="button" className="strategy-chip">盈亏比：0.76：1</button>
          </div>

          {/* 卡片和指标容器 */}
          <div className="strategy-cards-container">
            {/* 左侧策略卡片 */}
            <div className="strategy-card-left">
              <span className="strategy-card-left-badge">多头策略</span>
              <div className="strategy-card-glow" />
              <div className="strategy-card-left-overlay">
                <div className="strategy-card-left-title">做 多</div>
                <div className="strategy-card-left-desc">建议交易方向</div>
              </div>
            </div>

            {/* 右侧指标网格 */}
            <div className="strategy-metrics-grid">
              <div className="strategy-metric-card">
                <p className="strategy-metric-label">日期</p>
                <p className="strategy-metric-value">2025-08-07</p>
              </div>
              <div className="strategy-metric-card">
                <p className="strategy-metric-label">当前值</p>
                <p className="strategy-metric-value">39.6</p>
              </div>
              <div className="strategy-metric-card">
                <p className="strategy-metric-label">综合价差比</p>
                <p className="strategy-metric-value">20%</p>
              </div>
              <div className="strategy-metric-card">
                <p className="strategy-metric-label">综合价差比区间</p>
                <p className="strategy-metric-value">15%-30%</p>
              </div>
              <div className="strategy-metric-card">
                <p className="strategy-metric-label">2025-09-18预测值</p>
                <p className="strategy-metric-value">48</p>
              </div>
              <div className="strategy-metric-card">
                <p className="strategy-metric-label">在全部交易日期中出现概率</p>
                <p className="strategy-metric-value">9%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePositionEvaluation

