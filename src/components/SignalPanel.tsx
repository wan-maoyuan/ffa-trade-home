import React, { useState } from 'react'
import './CoursePanel.css'
import SideMenu from './SideMenu'

// FFA信号页面数据
interface FFASignalData {
  contract: string;
  month: string;
  predictedValue: number;
  currentValue: number;
  deviation: string;
  longEntryRange: string;
  longExitRange: string;
  operationSuggestion: string;
}

// 单头寸交易信号数据
interface SinglePositionSignal {
  symbol: string;
  direction: '做多' | '做空';
  profitLossRatio: string;
}

// 双头寸交易信号数据
interface DualPositionSignal {
  pair: string;
  direction: string;
  profitLossRatio: string;
}

const SignalPanel: React.FC = () => {
  const [activePage, setActivePage] = useState<number>(1);
  const [singlePositionTab, setSinglePositionTab] = useState<'现货' | '期货'>('现货');
  const [dualPositionTab, setDualPositionTab] = useState<'现货VS期货' | '现货VS现货' | '期货VS期货'>('现货VS期货');

  // FFA信号数据
  const ffaSignalData: FFASignalData = {
    contract: 'C5TC+1',
    month: 'Jul',
    predictedValue: 20100,
    currentValue: 19000,
    deviation: '-6%',
    longEntryRange: '<11050',
    longExitRange: '>17100',
    operationSuggestion: '平多'
  };

  // 单头寸现货数据
  const spotSignals: SinglePositionSignal[] = [
    { symbol: 'P2', direction: '做多', profitLossRatio: '63.55:1' },
    { symbol: 'C16', direction: '做空', profitLossRatio: '24.36:1' },
    { symbol: 'C14', direction: '做空', profitLossRatio: '10.14:1' },
    { symbol: 'P3A', direction: '做多', profitLossRatio: '9.65:1' },
    { symbol: 'P6', direction: '做多', profitLossRatio: '9.24:1' },
    { symbol: 'C5TC', direction: '做多', profitLossRatio: '7.53:1' },
    { symbol: 'P4TC', direction: '做多', profitLossRatio: '7.16:1' },
    { symbol: 'P5', direction: '做多', profitLossRatio: '6.88:1' },
    { symbol: 'C10', direction: '做多', profitLossRatio: '2.82:1' },
    { symbol: 'S5', direction: '做多', profitLossRatio: '1.8:1' },
    { symbol: 'S1C', direction: '做多', profitLossRatio: '1.55:1' },
    { symbol: 'P1A', direction: '做多', profitLossRatio: '1.45:1' },
  ];

  // 单头寸期货数据
  const futuresSignals: SinglePositionSignal[] = [
    { symbol: '欧线', direction: '做多', profitLossRatio: '18.6:1' },
    { symbol: 'P4TC+1', direction: '做多', profitLossRatio: '5.2:1' },
    { symbol: 'C5TC+1', direction: '做多', profitLossRatio: '2.96:1' },
  ];

  // 双头寸数据
  const spotVsFuturesSignals: DualPositionSignal[] = [
    { pair: 'P6 VS P4TC+1M', direction: 'P6做多 P4TC+1M做空', profitLossRatio: '3.38:1' },
    { pair: 'P5 VS P4TC+1M', direction: 'P5做空 P4TC+1M做多', profitLossRatio: '2.09:1' },
    { pair: 'P3A VS P4TC+1M', direction: 'P3A做多 P4TC+1M做空', profitLossRatio: '1.89:1' },
  ];

  const spotVsSpotSignals: DualPositionSignal[] = [
    { pair: 'P6 VS P3A', direction: 'P6做空 P3A做多', profitLossRatio: '1.96:1' },
  ];

  const futuresVsFuturesSignals: DualPositionSignal[] = [
    { pair: 'C5TC+1M VS P4TC+1M', direction: 'C5TC+1M做空 P4TC+1M做多', profitLossRatio: '31.68:1' },
  ];

  // 渲染FFA信号页面
  const renderFFASignalPage = () => (
    <div className="signal-carousel-page">
      <div className="signal-carousel-card">
        <h3 className="signal-carousel-title">FFA信号</h3>
        {/* 轮播切换按钮 */}
        <div className="signal-carousel-pagination">
          <button
            className={`signal-pagination-btn ${activePage === 1 ? 'active' : ''}`}
            onClick={() => setActivePage(1)}
            aria-label="切换到FFA信号页面"
          >
            1
          </button>
          <button
            className={`signal-pagination-btn ${activePage === 2 ? 'active' : ''}`}
            onClick={() => setActivePage(2)}
            aria-label="切换到单头寸交易信号汇总页面"
          >
            2
          </button>
          <button
            className={`signal-pagination-btn ${activePage === 3 ? 'active' : ''}`}
            onClick={() => setActivePage(3)}
            aria-label="切换到双头寸交易信号汇总页面"
          >
            3
          </button>
        </div>
        <div className="signal-ffa-content">
          <div className="signal-ffa-buttons">
            <button className="signal-ffa-button">{ffaSignalData.contract}</button>
            <button className="signal-ffa-button">{ffaSignalData.month}</button>
          </div>
          <div className="signal-ffa-values">
            <div className="signal-value-box">
              <p className="signal-value-label">预测值</p>
              <p className="signal-value-number">{ffaSignalData.predictedValue}</p>
            </div>
            <div className="signal-value-box">
              <p className="signal-value-label">当前值</p>
              <p className="signal-value-number">{ffaSignalData.currentValue}</p>
            </div>
          </div>
          <div className="signal-ffa-info">
            <div className="signal-info-label-row">
              <p className="signal-info-label">偏高度</p>
              <p className="signal-info-label">开多入场区间</p>
              <p className="signal-info-label">平多离场区间</p>
              <p className="signal-info-label">操作建议</p>
            </div>
            <div className="signal-info-row">
              <div className="signal-info-item">
                <p className="signal-info-value">{ffaSignalData.deviation}</p>
              </div>
              <div className="signal-info-item">
                <p className="signal-info-value">{ffaSignalData.longEntryRange}</p>
              </div>
              <div className="signal-info-item">
                <p className="signal-info-value">{ffaSignalData.longExitRange}</p>
              </div>
              <div className="signal-info-item">
                <p className="signal-info-value signal-operation">{ffaSignalData.operationSuggestion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染单头寸交易信号汇总页面
  const renderSinglePositionPage = () => (
    <div className="signal-carousel-page">
      <div className="signal-carousel-card">
        <h3 className="signal-carousel-title">单头寸交易信号汇总</h3>
        {/* 轮播切换按钮 */}
        <div className="signal-carousel-pagination">
          <button
            className={`signal-pagination-btn ${activePage === 1 ? 'active' : ''}`}
            onClick={() => setActivePage(1)}
            aria-label="切换到FFA信号页面"
          >
            1
          </button>
          <button
            className={`signal-pagination-btn ${activePage === 2 ? 'active' : ''}`}
            onClick={() => setActivePage(2)}
            aria-label="切换到单头寸交易信号汇总页面"
          >
            2
          </button>
          <button
            className={`signal-pagination-btn ${activePage === 3 ? 'active' : ''}`}
            onClick={() => setActivePage(3)}
            aria-label="切换到双头寸交易信号汇总页面"
          >
            3
          </button>
        </div>
        <div className="signal-single-position-content">
          <div className="signal-tabs">
            <button
              className={`signal-tab ${singlePositionTab === '现货' ? 'active' : ''}`}
              onClick={() => setSinglePositionTab('现货')}
            >
              现货
            </button>
            <button
              className={`signal-tab ${singlePositionTab === '期货' ? 'active' : ''}`}
              onClick={() => setSinglePositionTab('期货')}
            >
              期货
            </button>
          </div>
          <div className="signal-signal-list">
            {(singlePositionTab === '现货' ? spotSignals : futuresSignals).map((signal, index) => (
              <div key={index} className="signal-signal-item">
                <span className="signal-symbol">{signal.symbol}</span>
                <span className="signal-direction-label">
                  建议交易方向：
                  <span className={`signal-direction ${signal.direction === '做多' ? 'long' : 'short'}`}>
                    {signal.direction}
                  </span>
                </span>
                <span className="signal-ratio-label">
                  盈亏比：
                  <span className="signal-ratio">{signal.profitLossRatio}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染双头寸交易信号汇总页面
  const renderDualPositionPage = () => {
    const getCurrentSignals = () => {
      if (dualPositionTab === '现货VS期货') return spotVsFuturesSignals;
      if (dualPositionTab === '现货VS现货') return spotVsSpotSignals;
      return futuresVsFuturesSignals;
    };

    return (
      <div className="signal-carousel-page">
        <div className="signal-carousel-card">
          <h3 className="signal-carousel-title">双头寸交易信号汇总</h3>
          {/* 轮播切换按钮 */}
          <div className="signal-carousel-pagination">
            <button
              className={`signal-pagination-btn ${activePage === 1 ? 'active' : ''}`}
              onClick={() => setActivePage(1)}
              aria-label="切换到FFA信号页面"
            >
              1
            </button>
            <button
              className={`signal-pagination-btn ${activePage === 2 ? 'active' : ''}`}
              onClick={() => setActivePage(2)}
              aria-label="切换到单头寸交易信号汇总页面"
            >
              2
            </button>
            <button
              className={`signal-pagination-btn ${activePage === 3 ? 'active' : ''}`}
              onClick={() => setActivePage(3)}
              aria-label="切换到双头寸交易信号汇总页面"
            >
              3
            </button>
          </div>
          <div className="signal-dual-position-content">
            <div className="signal-tabs-dual">
              <button
                className={`signal-tab-dual ${dualPositionTab === '现货VS期货' ? 'active' : ''}`}
                onClick={() => setDualPositionTab('现货VS期货')}
              >
                现货VS期货
              </button>
              <button
                className={`signal-tab-dual ${dualPositionTab === '现货VS现货' ? 'active' : ''}`}
                onClick={() => setDualPositionTab('现货VS现货')}
              >
                现货VS现货
              </button>
              <button
                className={`signal-tab-dual ${dualPositionTab === '期货VS期货' ? 'active' : ''}`}
                onClick={() => setDualPositionTab('期货VS期货')}
              >
                期货VS期货
              </button>
            </div>
            <div className="signal-signal-list">
              {getCurrentSignals().map((signal, index) => (
                <div key={index} className="signal-signal-item-dual">
                  <span className="signal-pair">{signal.pair}</span>
                  <span className="signal-direction-label">
                    建议交易方向：
                    <span className="signal-direction long">{signal.direction}</span>
                  </span>
                  <span className="signal-ratio-label">
                    盈亏比：
                    <span className="signal-ratio">{signal.profitLossRatio}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="course-panel" data-node-id="1:3244">
      <SideMenu currentPage="signal" />

      {/* 顶部标题和按钮 */}
      <div className="signal-header-section">
        <h1 className="course-panel-title">AQUABRIDGE</h1>
        <p className="course-panel-subtitle">一站式衍生品综合服务商</p>
        <button type="button" className="course-panel-button">
          <span>信号服务入口</span>
        </button>
      </div>

      {/* 轮播图区域 */}
      <div className="signal-carousel-container">
        {activePage === 1 && renderFFASignalPage()}
        {activePage === 2 && renderSinglePositionPage()}
        {activePage === 3 && renderDualPositionPage()}
      </div>

      {/* 底部文字描述 */}
      <div className="course-panel-desc">
        我们专注于航运市场信号的捕捉。依托海量且全面的航运市场数据，凭借先进的数据分析技术和专业模型，精准识别价格波动信号。这些信号犹如市场的"风向标"，能敏锐反映价格即将发生的变动趋势，无论是上涨还是下跌的先兆，都能及时被我们捕捉到，为用户提前感知市场变化提供关键指引。同时，我们深度剖析基差变化，基差波动往往蕴含着市场供需关系的微妙转变，通过对其细致分析，能进一步洞察市场潜在趋势，为用户把握市场动态提供更丰富的信号参考。
      </div>
    </div>
  )
}

export default SignalPanel
