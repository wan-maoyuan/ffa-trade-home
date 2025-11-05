import React from 'react'
import './StrategyPage.css'

// 来自 Figma MCP 的图片资源（7天有效期）
const IMG_CARD_BG = 'https://www.figma.com/api/mcp/asset/8bf65e56-a1ee-4003-9f5e-49183c04a4b3'

// 趋势图标 SVG
const TrendIcon: React.FC = () => (
  <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 55H62V60H6V55Z" fill="#2e56a3" opacity="0.87" />
    <path d="M6 32.5H15V47.5H6V32.5Z" fill="#2e56a3" opacity="0.87" />
    <path d="M20 25H35V37.5H20V25Z" fill="#2e56a3" opacity="0.87" />
    <path d="M52 15H68V32.5H52V15Z" fill="#2e56a3" opacity="0.87" />
    <path d="M6 5H62V12.5H6V5Z" fill="#2e56a3" opacity="0.87" />
  </svg>
)

const DoublePositionEvaluation: React.FC = () => {
  return (
    <div className="strategy-page double-position-evaluation-page">
      <p className="strategy-page-title">双头寸策略评价</p>
      
      <div className="double-position-evaluation-content">
        {/* 策略标签 */}
        <div className="strategy-chips">
          <button type="button" className="strategy-chip">基差做小胜率统计</button>
          <button type="button" className="strategy-chip">盈亏比：31.68：1</button>
        </div>

        {/* 卡片和指标容器 */}
        <div className="strategy-cards-container">
          {/* 左侧策略卡片 */}
          <div className="strategy-card-left">
            <div className="strategy-card-left-bg">
              <img alt="策略背景" src={IMG_CARD_BG} />
            </div>
            <div className="strategy-card-left-overlay">
              <div className="strategy-card-left-title">基差缩小</div>
              <div className="strategy-card-left-subtitle">C5TC做空 P4TC做多</div>
              <div className="strategy-card-left-desc">建议交易方向</div>
            </div>
            <div className="strategy-card-icon">
              <TrendIcon />
            </div>
          </div>

          {/* 右侧指标网格 */}
          <div className="strategy-metrics-grid">
            <div className="strategy-metric-card" style={{ width: '120px' }}>
              <p className="strategy-metric-label">日期</p>
              <p className="strategy-metric-value">2025-08-07</p>
            </div>
            <div className="strategy-metric-card" style={{ width: '120px' }}>
              <p className="strategy-metric-label">C5TC+1当前值</p>
              <p className="strategy-metric-value">26550</p>
            </div>
            <div className="strategy-metric-card" style={{ width: '120px' }}>
              <p className="strategy-metric-label">P4TC+1当前值</p>
              <p className="strategy-metric-value">13885</p>
            </div>
            <div className="strategy-metric-card" style={{ width: '125px' }}>
              <p className="strategy-metric-label">基差</p>
              <p className="strategy-metric-value">12665</p>
            </div>
            <div className="strategy-metric-card" style={{ width: '124px' }}>
              <p className="strategy-metric-label">基差区间</p>
              <p className="strategy-metric-value">11843~15168</p>
            </div>
            <div className="strategy-metric-card" style={{ width: '125px' }}>
              <p className="strategy-metric-label">基差分位数<br/>（从强到弱 会计10分位）</p>
              <p className="strategy-metric-value">7</p>
            </div>
            <div className="strategy-metric-card" style={{ width: '125px' }}>
              <p className="strategy-metric-label">历史平均基差</p>
              <p className="strategy-metric-value">6388</p>
            </div>
            <div className="strategy-metric-card" style={{ width: '125px' }}>
              <p className="strategy-metric-label">在全部交易日期中<br/>出现概率</p>
              <p className="strategy-metric-value">6.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoublePositionEvaluation

