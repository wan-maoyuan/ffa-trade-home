import React from 'react'
import './StrategyPageOptimization.css'

const SinglePositionEvaluation: React.FC = () => {
  return (
    <div className="strategy-page single-position-evaluation-page">
      <p className="strategy-page-title">单头寸策略评价</p>

      <div className="strategy-page-content">
        {/* 策略标签 */}
        <div className="strategy-tags">
          <div className="strategy-tag">
            <p>做多胜率统计</p>
          </div>
          <div className="strategy-tag">
            <p>盈亏比：0.76：1</p>
          </div>
        </div>

        {/* 内容卡片 */}
        <div className="strategy-content-card">
          <div className="strategy-layout-grid">
            {/* 左侧策略方向卡片 */}
            <div className="strategy-direction-card">
              <div className="strategy-direction-badge">多头策略</div>
              <div className="strategy-direction-title">做 多</div>
              <div className="strategy-direction-subtitle">建议交易方向</div>
            </div>

            {/* 右侧指标网格 */}
            <div className="strategy-metrics-grid">
              <div className="strategy-metric-item">
                <p className="strategy-metric-label">日期</p>
                <p className="strategy-metric-value">2025-08-07</p>
              </div>
              <div className="strategy-metric-item">
                <p className="strategy-metric-label">当前值</p>
                <p className="strategy-metric-value">39.6</p>
              </div>
              <div className="strategy-metric-item">
                <p className="strategy-metric-label">综合价差比</p>
                <p className="strategy-metric-value">20%</p>
              </div>
              <div className="strategy-metric-item">
                <p className="strategy-metric-label">综合价差比区间</p>
                <p className="strategy-metric-value">15%-30%</p>
              </div>
              <div className="strategy-metric-item">
                <p className="strategy-metric-label">2025-09-18预测值</p>
                <p className="strategy-metric-value">48</p>
              </div>
              <div className="strategy-metric-item">
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

