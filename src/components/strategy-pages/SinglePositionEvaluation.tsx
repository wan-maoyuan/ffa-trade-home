import React from 'react'
import './StrategyPage.css'

// 来自 Figma MCP 的图片资源（7天有效期）
const IMG_CARD_BG = 'https://www.figma.com/api/mcp/asset/8bf65e56-a1ee-4003-9f5e-49183c04a4b3'

// 分析图标 SVG
const AnalysisIcon: React.FC = () => (
  <svg width="68" height="60" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 6.25H61V13.75H7V6.25Z" fill="#2e56a3" opacity="0.87" />
    <path d="M12 33.75H43V43.75H12V33.75Z" fill="#2e56a3" opacity="0.87" />
    <path d="M0 20.25H2V53.75H0V20.25Z" fill="#2e56a3" opacity="0.87" />
    <path d="M62 20.25H64V42.5H62V20.25Z" fill="#2e56a3" opacity="0.87" />
    <path d="M7 53.75H18V60H7V53.75Z" fill="#2e56a3" opacity="0.87" />
    <path d="M24 13.75H30V60H24V13.75Z" fill="#2e56a3" opacity="0.87" />
    <path d="M52 13.75H53V60H52V13.75Z" fill="#2e56a3" opacity="0.87" />
  </svg>
)

const SinglePositionEvaluation: React.FC = () => {
  return (
    <div className="strategy-page single-position-evaluation-page">
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
            <div className="strategy-card-left-bg">
              <img alt="策略背景" src={IMG_CARD_BG} />
            </div>
            <div className="strategy-card-left-overlay">
              <div className="strategy-card-left-title">做  多</div>
              <div className="strategy-card-left-desc">建议交易方向</div>
            </div>
            <div className="strategy-card-icon">
              <AnalysisIcon />
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
  )
}

export default SinglePositionEvaluation

