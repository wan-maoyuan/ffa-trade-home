import React from 'react'
import './SignalPage.css'

const DoublePositionSignalPage: React.FC = () => {
  return (
    <div className="signal-page double-position-signal-page">
      {/* 页面标题 */}
      <p className="signal-page-title">双头寸交易信号汇总</p>

      {/* 主要内容区域 */}
      <div className="signal-page-content">
        {/* 左侧：现货VS期货 */}
        <div className="signal-pair-trade-list signal-pair-trade-list-left">
          <div className="signal-pair-trade-list-header">
            <div className="signal-pair-trade-list-tag">
              <p>现货VS期货</p>
            </div>
            <p className="signal-pair-trade-list-date">2025-08-07</p>
          </div>
          <div className="signal-pair-trade-list-content">
            <div className="signal-pair-trade-item">
              <p className="signal-pair-trade-item-pair">P6    VS    P4TC+1M</p>
              <p className="signal-pair-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">P6做多 P4TC+1M做空</span>
              </p>
              <p className="signal-pair-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">3.38：1</span>
              </p>
            </div>
            <div className="signal-pair-trade-item">
              <p className="signal-pair-trade-item-pair">P5    VS    P4TC+1M</p>
              <p className="signal-pair-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">P5做空 P4TC+1M做多</span>
              </p>
              <p className="signal-pair-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">2.09：1</span>
              </p>
            </div>
            <div className="signal-pair-trade-item">
              <p className="signal-pair-trade-item-pair">P3A    VS    P4TC+1M</p>
              <p className="signal-pair-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">P3A做多 P4TC+1M做空</span>
              </p>
              <p className="signal-pair-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">1.89：1</span>
              </p>
            </div>
          </div>
        </div>

        {/* 右侧：两个方块 */}
        <div className="signal-pair-trade-list-right">
          {/* 现货VS现货 */}
          <div className="signal-pair-trade-list">
            <div className="signal-pair-trade-list-header">
              <div className="signal-pair-trade-list-tag">
                <p>现货VS现货</p>
              </div>
              <p className="signal-pair-trade-list-date">2025-08-07</p>
            </div>
            <div className="signal-pair-trade-list-content">
              <div className="signal-pair-trade-item">
                <p className="signal-pair-trade-item-pair">P6    VS    P3A</p>
                <p className="signal-pair-trade-item-direction">
                  建议交易方向：<span className="signal-trade-item-long">P6做空 P3A做多</span>
                </p>
                <p className="signal-pair-trade-item-ratio">
                  盈亏比：<span className="signal-trade-item-ratio-value">1.96：1</span>
                </p>
              </div>
            </div>
          </div>

          {/* 期货VS期货 */}
          <div className="signal-pair-trade-list">
            <div className="signal-pair-trade-list-header">
              <div className="signal-pair-trade-list-tag signal-pair-trade-list-tag-active">
                <p>期货VS期货</p>
              </div>
              <p className="signal-pair-trade-list-date">2025-08-07</p>
            </div>
            <div className="signal-pair-trade-list-content">
              <div className="signal-pair-trade-item">
                <p className="signal-pair-trade-item-pair">C5TC+1M    VS    P4TC+1M</p>
                <p className="signal-pair-trade-item-direction">
                  建议交易方向: <span className="signal-trade-item-long">C5TC+1M做空 PATC+1M做多</span>
                </p>
                <p className="signal-pair-trade-item-ratio">
                  盈亏比：<span className="signal-trade-item-ratio-value">31.68：1</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoublePositionSignalPage

