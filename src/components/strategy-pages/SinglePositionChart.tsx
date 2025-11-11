import React from 'react'
import './StrategyPage.css'
import strategyBackground from '../../assets/images/strategy-background.jpeg'

const yTicks = [60, 50, 40, 30, 20, 10, 0]
const xTicks = [
  '2025-01-08',
  '2025-02-13',
  '2025-03-13',
  '2025-04-10',
  '2025-05-09',
  '2025-06-20',
  '2025-07-24',
  '2025-08-21',
  '2025-09-18'
]

const actualSeries = [22, 20, 24, 30, 32, 33, 34, 37, 39]
const predictedSeries = [25, 27, 30, 34, 36, 38, 41, 43, 45]

const SVG_WIDTH = 720
const SVG_HEIGHT = 260
const TOP_PADDING = 10
const BOTTOM_PADDING = 34
const MAX_VALUE = 60

const mapX = (index: number, total: number) => {
  if (total <= 1) return 0
  return (index / (total - 1)) * SVG_WIDTH
}

const mapY = (value: number) => {
  const usableHeight = SVG_HEIGHT - TOP_PADDING - BOTTOM_PADDING
  return TOP_PADDING + ((MAX_VALUE - value) / MAX_VALUE) * usableHeight
}

const buildPath = (values: number[]) =>
  values
    .map((value, index, arr) => {
      const x = mapX(index, arr.length).toFixed(2)
      const y = mapY(value).toFixed(2)
      return `${index === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')

const SinglePositionChart: React.FC = () => {
  const actualPath = buildPath(actualSeries)
  const predictedPath = buildPath(predictedSeries)
  const gridPositions = yTicks.map((tick) => mapY(tick))
  const actualMarkers = actualSeries.map((value, index, arr) => ({
    x: mapX(index, arr.length),
    y: mapY(value)
  }))

  return (
    <div className="strategy-page single-position-chart-page">
      <div className="chart-shell">
        <div className="chart-shell-background">
          <img src={strategyBackground} alt="远洋货轮背景" />
          <div className="chart-shell-mask" />
        </div>

        <div className="chart-shell-content">
          <div className="chart-shell-header">
            <div className="chart-shell-title">单头寸策略展示</div>
          </div>

          <div className="chart-shell-body">
            <div className="chart-control-column">
              <label className="chart-field">
                <span className="chart-field-label">年份</span>
                <div className="chart-field-select">
                  <span>2025</span>
                  <svg
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 5L0 0H8L4 5Z" fill="#2e56a3" />
                  </svg>
                </div>
              </label>
              <button type="button" className="chart-control-button">
                国内运费
              </button>
              <button type="button" className="chart-control-secondary">
                查询
              </button>
              <span className="chart-control-caption">实际价格 VS 预测价格</span>
            </div>

            <div className="chart-main">
              <div className="chart-legend">
                <div className="chart-legend-item">
                  <span className="chart-legend-bullet chart-legend-bullet-primary" />
                  实际价格
                </div>
              <div className="chart-legend-item chart-legend-item-outline">
                <span className="chart-legend-bullet-outline" />
                预测价格
                </div>
              </div>

              <div className="chart-main-plot">
                <svg
                  className="chart-canvas"
                  viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(46, 86, 163, 0.28)" />
                      <stop offset="100%" stopColor="rgba(46, 86, 163, 0)" />
                    </linearGradient>
                  </defs>

                  {gridPositions.map((y, index) => (
                    <line
                      key={`grid-${index}`}
                      x1="0"
                      y1={y}
                      x2={SVG_WIDTH}
                      y2={y}
                      className="chart-grid-line"
                    />
                  ))}

                  <path d={actualPath} className="chart-line-primary" />
                  <path d={`${actualPath} L${SVG_WIDTH},${SVG_HEIGHT}`} fill="url(#chartAreaFill)" />
                  <path d={predictedPath} className="chart-line-secondary" />

                  {actualMarkers.map((point, index) => (
                    <circle
                      key={`marker-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r={4}
                      className="chart-marker"
                    />
                  ))}
                </svg>

                <div className="chart-axis chart-axis-y">
                  {yTicks.map((tick) => (
                    <span key={`y-${tick}`}>{tick}</span>
                  ))}
                </div>
                <div className="chart-axis chart-axis-x">
                  {xTicks.map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePositionChart

