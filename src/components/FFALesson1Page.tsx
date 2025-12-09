import React, { useState, useCallback, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import './FFALesson1Page.css'

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const FFALesson1Page: React.FC = () => {
  const [marketPrice, setMarketPrice] = useState(15000)
  const [calcResults, setCalcResults] = useState<{
    totalValue: number
    initialMargin: number
    commission: number
  } | null>(null)
  const [shipType, setShipType] = useState<'cape' | 'pmx'>('cape')
  const [contractPrice, setContractPrice] = useState(20000)
  const [days, setDays] = useState(30)

  const LOCKED_PRICE = 20000

  // 生成机制图表数据
  const mechanismChartData = useMemo(() => {
    const days = Array.from({ length: 60 }, (_, i) => `D${i + 1}`)
    const volatileData: number[] = []
    const averageData: number[] = []
    let currentPrice = 20000
    let sum = 0

    for (let i = 0; i < 60; i++) {
      const change = Math.sin(i * 0.2) * 2000 + (Math.random() - 0.5) * 1500
      currentPrice += change
      if (currentPrice < 10000) currentPrice = 10000
      if (currentPrice > 35000) currentPrice = 35000

      volatileData.push(currentPrice)
      sum += currentPrice
      averageData.push(sum / (i + 1))
    }

    return {
      labels: days,
      datasets: [
        {
          label: '每日指数 (Daily Index)',
          data: volatileData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: false
        },
        {
          label: '结算均价 (Asian Average)',
          data: averageData,
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          borderWidth: 4,
          pointRadius: 0,
          tension: 0.4,
          fill: false
        }
      ]
    }
  }, [])

  // 对冲图表数据
  const hedgingChartData = useMemo(() => {
    const ffaResult = LOCKED_PRICE - marketPrice
    const netResult = marketPrice + ffaResult

    let unhedgedColor = '#94a3b8'
    if (marketPrice < LOCKED_PRICE) unhedgedColor = '#ef4444'
    if (marketPrice > LOCKED_PRICE) unhedgedColor = '#22c55e'

    return {
      labels: ['未对冲 (Unhedged)', 'FFA 对冲后 (Hedged)'],
      datasets: [
        {
          label: '最终净收入 (Net Revenue)',
          data: [marketPrice, netResult],
          backgroundColor: [unhedgedColor, '#d97706'],
          borderRadius: 6,
          barPercentage: 0.6
        }
      ]
    }
  }, [marketPrice])

  // 计算对冲结果
  const hedgingResults = useMemo(() => {
    const ffaResult = LOCKED_PRICE - marketPrice
    const netResult = marketPrice + ffaResult
    const isProfit = ffaResult >= 0

    return {
      physicalRevenue: marketPrice,
      ffaPnL: ffaResult,
      netRevenue: netResult,
      isProfit
    }
  }, [marketPrice])

  // 计算成本
  const handleCalculate = useCallback(() => {
    if (contractPrice <= 0 || days <= 0) {
      alert('请输入有效的价格和天数')
      return
    }

    const totalVal = contractPrice * days
    const marginRate = shipType === 'cape' ? 0.30 : 0.20
    const margin = totalVal * marginRate
    const comm = totalVal * 0.001

    setCalcResults({
      totalValue: totalVal,
      initialMargin: margin,
      commission: comm
    })
  }, [shipType, contractPrice, days])

  // 图表选项
  const mechanismChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.dataset.label + ': $' + Math.round(context.raw).toLocaleString()
          }
        }
      }
    },
    scales: {
      y: {
        display: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: function (value: any) {
            return '$' + value / 1000 + 'k'
          },
          color: '#94a3b8'
        }
      },
      x: { display: false }
    }
  }

  const hedgingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return '净收入: $' + Math.round(context.raw).toLocaleString()
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 40000,
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: function (value: any) {
            return '$' + value / 1000 + 'k'
          },
          color: '#64748b'
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold' as const }, color: '#334155' }
      }
    }
  }

  // 平滑滚动
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="ffa-lesson1-page">
      {/* Navigation */}
      <nav className="ffa-nav">
        <div className="ffa-nav-container">
          <div className="ffa-nav-logo">
            <span className="ffa-logo-text">
              Aquabridge.<span className="ffa-logo-accent">AI</span>
            </span>
          </div>
          <div className="ffa-nav-menu">
            <button onClick={() => handleScrollTo('mechanism')} className="ffa-nav-link">
              机制原理
            </button>
            <button onClick={() => handleScrollTo('strategy')} className="ffa-nav-link">
              对冲模拟
            </button>
            <button onClick={() => handleScrollTo('execution')} className="ffa-nav-link">
              交易流程
            </button>
            <button onClick={() => handleScrollTo('ecosystem')} className="ffa-nav-link">
              生态系统
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="ffa-hero">
        <div className="ffa-hero-bg"></div>
        <div className="ffa-hero-content">
          <h1 className="ffa-hero-title">
            FFA - 航运世界的<span className="ffa-hero-accent">反脆弱</span>工具
          </h1>
          <div className="ffa-hero-buttons">
            <button
              onClick={() => handleScrollTo('mechanism')}
              className="ffa-btn-primary"
            >
              探索 FFA 机制
            </button>
            <button
              onClick={() => handleScrollTo('ecosystem')}
              className="ffa-btn-secondary"
            >
              了解 Aquabridge 体系
            </button>
          </div>
        </div>
      </header>

      {/* Section I: Mechanism */}
      <section id="mechanism" className="ffa-section">
        <div className="ffa-container">
          <div className="ffa-section-header">
            <h2 className="ffa-section-title">I. 什么是 FFA？</h2>
            <p className="ffa-section-description">
              FFA (Forward Freight Agreement 远期运费协议) 是针对运费波动的现金结算工具。它通过"亚式定价"机制，将剧烈的市场波动转化为平稳的财务预期。
            </p>
          </div>

          <div className="ffa-grid">
            <div className="ffa-grid-left">
              <div className="ffa-card">
                <div className="ffa-card-icon">💰</div>
                <div>
                  <h3 className="ffa-card-title">现金差价结算</h3>
                  <p className="ffa-card-text">
                    不涉及实物交割。仅结算合约价格与市场价格的差额，极大提高了资金效率。
                  </p>
                </div>
              </div>

              <div className="ffa-card">
                <div className="ffa-card-icon">📈</div>
                <div>
                  <h3 className="ffa-card-title">亚式定价 (Asian Pricing)</h3>
                  <p className="ffa-card-text">
                    结算价为到期月整月的<strong>平均价格</strong>。平滑单日极端波动，提供稳定的对冲基准。
                  </p>
                </div>
              </div>

              <div className="ffa-contract-card">
                <h3 className="ffa-contract-title">🚢 活跃合约构成 (占总成交约 80%)</h3>
                <div className="ffa-contract-list">
                  <div className="ffa-contract-item">
                    <div>
                      <span className="ffa-contract-name">C5TC</span>
                      <span className="ffa-contract-desc">好望角型 (Capesize)</span>
                    </div>
                    <div className="ffa-contract-info">
                      由 <span className="ffa-contract-highlight">5</span> 条 Capesize 船型的平均期租租金构成
                    </div>
                  </div>
                  <div className="ffa-contract-item">
                    <div>
                      <span className="ffa-contract-name">P5TC</span>
                      <span className="ffa-contract-desc">巴拿马型 (Panamax)</span>
                    </div>
                    <div className="ffa-contract-info">
                      由 <span className="ffa-contract-highlight">5</span> 条 Panamax 船型的平均期租租金构成
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ffa-grid-right">
              <div className="ffa-chart-card">
                <h4 className="ffa-chart-title">亚式定价平滑效应演示</h4>
                <div className="ffa-chart-container">
                  <Line data={mechanismChartData} options={mechanismChartOptions} />
                </div>
                <div className="ffa-chart-legend">
                  <div className="ffa-legend-item">
                    <span className="ffa-legend-dot blue"></span>
                    每日市场波动 (高风险)
                  </div>
                  <div className="ffa-legend-item">
                    <span className="ffa-legend-dot amber"></span>
                    月度结算均价 (平稳)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section II: Strategy */}
      <section id="strategy" className="ffa-section bg-gray">
        <div className="ffa-container">
          <div className="ffa-section-header">
            <h2 className="ffa-section-title">II. 对冲策略：构建"反脆弱"护城河</h2>
            <p className="ffa-section-description">
              通过 FFA，无论市场暴涨还是暴跌，企业都能锁定预期的经营利润。这就叫"确定性"。
            </p>
          </div>

          <div className="ffa-simulator">
            <div className="ffa-simulator-header">
              <div>
                <h3 className="ffa-simulator-title">
                  <span>🎮</span> 船东对冲模拟器
                </h3>
                <p className="ffa-simulator-subtitle">
                  场景：您拥有一艘船，并在 FFA 市场做空 (卖出) 以锁定运费。
                </p>
              </div>
              <div className="ffa-target-box">
                <span className="ffa-target-label">锁定目标收益</span>
                <span className="ffa-target-value">$20,000 / 天</span>
              </div>
            </div>

            <div className="ffa-simulator-content">
              <div className="ffa-simulator-controls">
                <div className="ffa-slider-group">
                  <label className="ffa-slider-label">
                    <span>模拟：到期时实际市场运费</span>
                    <span className="ffa-slider-value">${marketPrice.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="35000"
                    step="500"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(Number(e.target.value))}
                    className="ffa-slider"
                  />
                  <div className="ffa-slider-labels">
                    <span>$5,000 (暴跌)</span>
                    <span>$35,000 (暴涨)</span>
                  </div>
                </div>

                <div className="ffa-results-panel">
                  <div className="ffa-result-item">
                    <span>实物市场收入</span>
                    <span className="ffa-result-value">
                      ${hedgingResults.physicalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className={`ffa-result-item ${hedgingResults.isProfit ? 'profit' : 'loss'}`}>
                    <span>FFA 盈亏对冲</span>
                    <span className={`ffa-result-value ${hedgingResults.isProfit ? 'text-green' : 'text-red'}`}>
                      {hedgingResults.ffaPnL >= 0 ? '+' : ''}${hedgingResults.ffaPnL.toLocaleString()}
                    </span>
                  </div>
                  <div className="ffa-result-item final">
                    <span>最终净收入</span>
                    <span className="ffa-result-value large">
                      ${hedgingResults.netRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="ffa-simulator-note">
                  * 观察右图：无论蓝色柱子（市场价）如何剧烈波动，橙色柱子（最终收入）始终稳如磐石。这就是护城河。
                </p>
              </div>

              <div className="ffa-simulator-chart">
                <div className="ffa-chart-container">
                  <Bar data={hedgingChartData} options={hedgingChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section III: Execution */}
      <section id="execution" className="ffa-section">
        <div className="ffa-container">
          <div className="ffa-section-header">
            <h2 className="ffa-section-title">III. 交易流程与模式</h2>
            <p className="ffa-section-description">
              理解从场外撮合到中央清算的完整链路，是保障资金安全的前提。
            </p>
          </div>

          <div className="ffa-execution-grid">
            <div className="ffa-process-column">
              <h3 className="ffa-process-title">安全交易闭环</h3>

              <div className="ffa-flow">
                <div className="ffa-flow-step">
                  <div className="ffa-flow-icon">🗣️</div>
                  <h4 className="ffa-flow-title">Broker 场外撮合</h4>
                  <p className="ffa-flow-text">买卖双方通过经纪人达成价格与数量</p>
                </div>
                <div className="ffa-flow-arrow">➜</div>
                <div className="ffa-flow-step highlight-green">
                  <div className="ffa-flow-icon">🏦</div>
                  <h4 className="ffa-flow-title">清算商介入清算</h4>
                  <p className="ffa-flow-text">负责客户结账单</p>
                  <p className="ffa-flow-text bold">逐日盯市（M-t-M）确保履约安全</p>
                </div>
                <div className="ffa-flow-arrow">➜</div>
                <div className="ffa-flow-step highlight-blue">
                  <div className="ffa-flow-icon">⚖️</div>
                  <h4 className="ffa-flow-title">交易所中央清算</h4>
                  <p className="ffa-flow-text">作为所有交易的最终对手方（CCP）</p>
                  <p className="ffa-flow-text bold">彻底消除对手方信用风险</p>
                </div>
              </div>

              <div className="ffa-info-box">
                <div className="ffa-info-icon">💡</div>
                <p className="ffa-info-text">
                  <strong>中央清算机制 (CCP)</strong> 是 FFA 区别于普通远期合同的关键。它通过保证金制度，几乎消除了交易对手违约的风险。
                </p>
              </div>
            </div>

            <div className="ffa-calculator-column">
              <div className="ffa-calculator">
                <div className="ffa-calculator-bg"></div>
                <h3 className="ffa-calculator-title">保证金与成本计算器</h3>

                <div className="ffa-calculator-form">
                  <div className="ffa-form-group">
                    <label className="ffa-form-label">船型 (Ship Type)</label>
                    <select
                      value={shipType}
                      onChange={(e) => setShipType(e.target.value as 'cape' | 'pmx')}
                      className="ffa-form-select"
                    >
                      <option value="cape">Cape Size (好望角型) - 保证金 ~30%</option>
                      <option value="pmx">Panamax (巴拿马型) - 保证金 ~20%</option>
                    </select>
                  </div>

                  <div className="ffa-form-row">
                    <div className="ffa-form-group">
                      <label className="ffa-form-label">合约价格 ($)</label>
                      <input
                        type="number"
                        value={contractPrice}
                        onChange={(e) => setContractPrice(Number(e.target.value))}
                        className="ffa-form-input"
                      />
                    </div>
                    <div className="ffa-form-group">
                      <label className="ffa-form-label">天数 (Days)</label>
                      <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="ffa-form-input"
                      />
                    </div>
                  </div>

                  <button onClick={handleCalculate} className="ffa-calc-button">
                    计算资金要求
                  </button>

                  {calcResults && (
                    <div className="ffa-calc-results">
                      <div className="ffa-calc-result-item">
                        <p className="ffa-calc-result-label">合约总价值</p>
                        <p className="ffa-calc-result-value">
                          ${calcResults.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="ffa-calc-result-item">
                        <p className="ffa-calc-result-label">预估初始保证金</p>
                        <p className="ffa-calc-result-value highlight">
                          ${calcResults.initialMargin.toLocaleString()}
                        </p>
                      </div>
                      <div className="ffa-calc-result-item">
                        <p className="ffa-calc-result-label">预估佣金 (0.1%)</p>
                        <p className="ffa-calc-result-value">
                          ${calcResults.commission.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section IV: Ecosystem */}
      <section id="ecosystem" className="ffa-section dark">
        <div className="ffa-container">
          <div className="ffa-section-header">
            <h2 className="ffa-section-title">IV. 认知套利与高效执行</h2>
            <p className="ffa-section-description">
              从建立认知体系到高效落地执行，我们为您提供完整的解决方案。
            </p>
          </div>

          <div className="ffa-ecosystem-grid">
            <div className="ffa-ecosystem-card">
              <div className="ffa-ecosystem-bg">🧠</div>
              <div className="ffa-ecosystem-content">
                <h3 className="ffa-ecosystem-title">Aquabridge</h3>
                <p className="ffa-ecosystem-subtitle">以科技和金融赋能航运</p>

                <ul className="ffa-ecosystem-list">
                  <li>
                    <span className="ffa-list-bullet">•</span>
                    <span>
                      <strong>教育和培训</strong>
                      <br />
                      建立长期正EV和反脆弱的认知体系。
                    </span>
                  </li>
                  <li>
                    <span className="ffa-list-bullet">•</span>
                    <span>
                      <strong>信号和策略</strong>
                      <br />
                      基于大数据与 AI 的量化价格锚点。
                    </span>
                  </li>
                  <li>
                    <span className="ffa-list-bullet">•</span>
                    <span>
                      <strong>体系赋能</strong>
                      <br />
                      提供跨界融合的策略服务。
                    </span>
                  </li>
                </ul>

                <a
                  href="http://www.aquabridge.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ffa-ecosystem-link blue"
                >
                  www.aquabridge.ai
                </a>
              </div>
            </div>

            <div className="ffa-ecosystem-card">
              <div className="ffa-ecosystem-bg">⚡</div>
              <div className="ffa-ecosystem-content">
                <h3 className="ffa-ecosystem-title">FFATrade</h3>
                <p className="ffa-ecosystem-subtitle">最好的航运衍生品服务平台</p>

                <ul className="ffa-ecosystem-list">
                  <li>
                    <span className="ffa-list-bullet">•</span>
                    <span>
                      <strong>实时报价和成交信息</strong>
                      <br />
                      掌握市场动态，让场外交易场内化。
                    </span>
                  </li>
                  <li>
                    <span className="ffa-list-bullet">•</span>
                    <span>
                      <strong>一站式数据服务</strong>
                      <br />
                      提供高效的数据分析和 K 线图指标服务。
                    </span>
                  </li>
                  <li>
                    <span className="ffa-list-bullet">•</span>
                    <span>
                      <strong>模拟交易</strong>
                      <br />
                      低成本试错，感受真实市场脉搏。
                    </span>
                  </li>
                </ul>

                <a
                  href="http://www.ffatrade.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ffa-ecosystem-link amber"
                >
                  www.ffatrade.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ffa-footer">
        <div className="ffa-container">
          <p className="ffa-footer-copyright">
            &copy; 2025 Aquabridge & FFATrade.
          </p>
          <p className="ffa-footer-disclaimer">
            Risk Disclaimer: Trading Forward Freight Agreements (FFAs) involves a significant risk of loss and is not suitable for all investors. The content provided here is for educational purposes only and does not constitute financial advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default FFALesson1Page

