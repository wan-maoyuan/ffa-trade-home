import React from 'react'
import './SignalPage.css'

const SinglePositionSignalPage: React.FC = () => {
  return (
    <div className="signal-page single-position-signal-page">
      {/* 页面标题 */}
      <p className="signal-page-title">单头寸交易信号汇总</p>

      {/* 主要内容区域 */}
      <div className="signal-page-content">
        {/* 现货交易列表 */}
        <div className="signal-trade-list">
          <div className="signal-trade-list-header">
            <div className="signal-trade-list-tag">
              <p>现货</p>
            </div>
            <p className="signal-trade-list-date">2025-08-07</p>
          </div>
          <div className="signal-trade-list-content">
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">P2</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">63.55：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">C16</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-short">做空</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">24.36：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">C14</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-short">做空</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">10.14：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">P3A</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">9.65：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">P6</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">9.24：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">C5TC</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">7.53：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">P4TC</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">7.16：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">P5</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">6.88：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">C10</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">2.82：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">S5</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">1.8：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">S1C</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">1.55：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">P1A</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">1.45：1</span>
              </p>
            </div>
          </div>
        </div>

        {/* 期货交易列表 */}
        <div className="signal-trade-list">
          <div className="signal-trade-list-header">
            <div className="signal-trade-list-tag">
              <p>期货</p>
            </div>
            <p className="signal-trade-list-date">2025-08-07</p>
          </div>
          <div className="signal-trade-list-content">
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">欧线</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">18.6：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">P4TC+1</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">5.2：1</span>
              </p>
            </div>
            <div className="signal-trade-item">
              <p className="signal-trade-item-code">C5TC+1</p>
              <p className="signal-trade-item-direction">
                建议交易方向：<span className="signal-trade-item-long">做多</span>
              </p>
              <p className="signal-trade-item-ratio">
                盈亏比：<span className="signal-trade-item-ratio-value">2.96：1</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePositionSignalPage

