import React from 'react'
import './StrategyPage.css'

const DualPositionIcon: React.FC = () => (
  <svg width="92" height="82" viewBox="0 0 92 82" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d-dual)">
      <rect x="6" y="6" width="80" height="66" rx="18" fill="url(#paint0_linear-dual)" />
    </g>
    <path
      d="M29 40H41M51 40H63"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 48H38M54 48H60"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.86"
    />
    <path
      d="M27 32H43M49 32H65"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M46 27L56 19C56 19 55.5 24 61 24C66.5 24 65.5 19 65.5 19"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
    <path
      d="M46 27L36 19C36 19 36.5 24 31 24C25.5 24 26.5 19 26.5 19"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
    <defs>
      <filter
        id="filter0_d-dual"
        x="0"
        y="0"
        width="92"
        height="82"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.13 0 0 0 0 0.26 0 0 0 0 0.52 0 0 0 0.34 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <linearGradient id="paint0_linear-dual" x1="46" y1="6" x2="46" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3F65BE" />
        <stop offset="1" stopColor="#1F3E83" />
      </linearGradient>
    </defs>
  </svg>
)

const DoublePositionEvaluation: React.FC = () => {
  return (
    <div className="strategy-page double-position-evaluation-page">
      <p className="strategy-page-title">双头寸策略评价</p>

      <div className="double-position-evaluation-content">
        <div className="strategy-chips">
          <button type="button" className="strategy-chip strategy-chip-strong">
            基差缩小胜率统计
          </button>
          <button type="button" className="strategy-chip">盈亏比：31.68：1</button>
        </div>

        <div className="strategy-cards-container strategy-cards-container-wide">
          <div className="strategy-dual-card-left">
            <span className="strategy-card-left-badge">Pair Strategy</span>
            <div className="strategy-card-left-overlay dual">
              <div className="strategy-card-left-icon">
                <DualPositionIcon />
              </div>
              <div className="strategy-card-left-text">
                <div className="strategy-card-left-title dual-title">基差缩小</div>
                <div className="strategy-card-left-desc dual-desc">建议双头寸策略方向</div>
              </div>
            </div>
            <div className="strategy-card-left-glow" />
          </div>

          <div className="dual-metrics-grid">
            {[
              { label: '日期', value: '2025-08-07' },
              { label: 'C5TC+1当前值', value: '26550' },
              { label: 'PATC+1当前值', value: '13885' },
              { label: '基差', value: '12665' },
              { label: '基差区间', value: '11843 ~ 15168' },
              { label: '触发次数（从策略多空标中统计）', value: '7' },
              { label: '历史平均基差', value: '6388' },
              { label: '去年同策略胜率', value: '6.5%' }
            ].map((item) => (
              <div key={item.label} className="dual-metric-card">
                <span className="dual-metric-label">{item.label}</span>
                <span className="dual-metric-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dual-outcome-section">
          <div className="dual-outcome-column">
            <span className="dual-outcome-badge positive">正收益</span>
            <div className="dual-outcome-card">
              <div className="dual-outcome-card-item">
                <span className="dual-outcome-label">最差正收益占比</span>
                <span className="dual-outcome-value">85%</span>
              </div>
              <div className="dual-outcome-card-item">
                <span className="dual-outcome-label">最差正收益平均值</span>
                <span className="dual-outcome-value">6680</span>
              </div>
            </div>
          </div>

          <div className="dual-outcome-column negative">
            <span className="dual-outcome-badge negative">负收益</span>
            <div className="dual-outcome-card">
              <div className="dual-outcome-card-item">
                <span className="dual-outcome-label">最差负收益占比</span>
                <span className="dual-outcome-value">15%</span>
              </div>
              <div className="dual-outcome-card-item">
                <span className="dual-outcome-label">最差负收益平均值</span>
                <span className="dual-outcome-value">1200</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoublePositionEvaluation

