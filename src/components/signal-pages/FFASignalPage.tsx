import React from 'react'
import './SignalPage.css'

const FFASignalPage: React.FC = () => {
  return (
    <div className="signal-page ffa-signal-page">
      {/* 页面标题 */}
      <p className="signal-page-title">FFA信号</p>

      {/* 主要内容区域 */}
      <div className="signal-page-content">
        {/* 日期标签 */}
        <div className="signal-date-tags">
          <div className="signal-date-tag">
            <p>C5TC+1</p>
          </div>
          <div className="signal-date-tag">
            <p>Jul</p>
          </div>
        </div>

        {/* 预测值和当前值卡片 */}
        <div className="signal-value-cards">
          <div className="signal-value-card">
            <p className="signal-value-label">预测值</p>
            <p className="signal-value-number">20100</p>
          </div>
          <div className="signal-value-card">
            <p className="signal-value-label">当前值</p>
            <p className="signal-value-number">19000</p>
          </div>
        </div>

        {/* 交易信息卡片 */}
        <div className="signal-trade-info-card">
          <div className="signal-trade-info-row">
            <p className="signal-trade-info-label">偏高度</p>
            <p className="signal-trade-info-value">-6%</p>
          </div>
          <div className="signal-trade-info-row">
            <p className="signal-trade-info-label">开多入场区间</p>
            <p className="signal-trade-info-value">&lt;11050</p>
          </div>
          <div className="signal-trade-info-row">
            <p className="signal-trade-info-label">平多离场区间</p>
            <p className="signal-trade-info-value">&gt;17100</p>
          </div>
          <div className="signal-trade-info-row">
            <p className="signal-trade-info-label">操作建议</p>
            <p className="signal-trade-info-value signal-trade-info-action">平多</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FFASignalPage

