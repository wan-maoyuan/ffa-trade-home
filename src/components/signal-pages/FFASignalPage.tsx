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

        {/* 交易信息表格 */}
        <div className="signal-trade-info-table">
          {/* 表头行 */}
          <div className="signal-trade-info-table-header">
            <div className="signal-trade-info-table-header-cell">偏高度</div>
            <div className="signal-trade-info-table-header-cell">开多入场区间</div>
            <div className="signal-trade-info-table-header-cell">平多离场区间</div>
            <div className="signal-trade-info-table-header-cell">操作建议</div>
          </div>
          {/* 数据行 */}
          <div className="signal-trade-info-table-row">
            <div className="signal-trade-info-table-cell">-6%</div>
            <div className="signal-trade-info-table-cell">&lt;11050</div>
            <div className="signal-trade-info-table-cell">&gt;17100</div>
            <div className="signal-trade-info-table-cell signal-trade-info-table-cell-action action-short">平多</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FFASignalPage

