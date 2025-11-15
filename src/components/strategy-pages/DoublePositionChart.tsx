import React, { useState } from 'react'
import './StrategyPage.css'

// 来自 Figma MCP 的图表图片资源（7天有效期）
const IMG_CHART1 = 'https://www.figma.com/api/mcp/asset/4e649ae9-c471-486e-85c2-8f172f1f4e8f'
const IMG_CHART2 = 'https://www.figma.com/api/mcp/asset/4ee4dcfa-51ca-44eb-9059-054b8174e5ca'
const IMG_CHART3 = 'https://www.figma.com/api/mcp/asset/5cd3e836-1c1d-4a61-96b5-7b0df7c114c8'

// 创建占位符图表的SVG
const ChartPlaceholder: React.FC<{ color?: string }> = ({ color = '#2e56a3' }) => (
  <svg width="100%" height="100%" viewBox="0 0 200 180" preserveAspectRatio="none">
    <defs>
      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
      </linearGradient>
    </defs>
    {/* 网格线 */}
    {[0, 25, 50, 75, 100].map((y) => (
      <line
        key={y}
        x1="10"
        y1={10 + y * 1.6}
        x2="190"
        y2={10 + y * 1.6}
        stroke="#e0e0e0"
        strokeWidth="0.5"
      />
    ))}
    {/* 示例折线 */}
    <path
      d="M 20 150 Q 60 120 100 100 T 180 60"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 20 150 Q 60 120 100 100 T 180 60 L 180 170 L 20 170 Z"
      fill="url(#chartGradient)"
    />
    {/* 数据点 */}
    {[
      { x: 20, y: 150 },
      { x: 60, y: 120 },
      { x: 100, y: 100 },
      { x: 140, y: 75 },
      { x: 180, y: 60 }
    ].map((point, i) => (
      <circle
        key={i}
        cx={point.x}
        cy={point.y}
        r="3"
        fill={color}
        stroke="#fff"
        strokeWidth="1"
      />
    ))}
  </svg>
)

const ChartImage: React.FC<{ src: string; alt: string; placeholder: React.ReactNode }> = ({
  src,
  alt,
  placeholder
}) => {
  const [imageError, setImageError] = useState(false)

  const handleError = () => {
    setImageError(true)
  }

  if (imageError) {
    return (
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        {placeholder}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }}
    />
  )
}

const DoublePositionChart: React.FC = () => {
  return (
    <div className="strategy-page double-position-chart-page">
      <p className="strategy-page-title">双头寸策略展示</p>
      
      <div className="double-position-chart-content">
        {/* 策略标签 */}
        <div className="strategy-chips" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
          <button type="button" className="strategy-chip strategy-chip-strong">对比</button>
          <button type="button" className="strategy-chip">基差展示</button>
          <button type="button" className="strategy-chip">基差比例</button>
        </div>

        {/* 三个图表对比容器 */}
        <div className="charts-comparison-container">
          {/* 第一个图表：5TC_C+1MON */}
          <div className="chart-comparison-section">
            <div className="chart-comparison-title">
              <span>5TC_C+1MON</span>
              <div className="chart-legend-line" style={{ background: '#2e56a3' }}></div>
            </div>
            <div className="chart-comparison-box">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Y轴标签 */}
                <div style={{ 
                  position: 'absolute', 
                  left: '5px', 
                  top: '0', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  paddingTop: '5px',
                  paddingBottom: '20px',
                  fontSize: '8.64px',
                  color: '#212a37',
                  opacity: 0.5,
                  fontFamily: 'Source Han Sans CN, sans-serif'
                }}>
                  <div>30000</div>
                  <div>25000</div>
                  <div>20000</div>
                  <div>15000</div>
                  <div>10000</div>
                  <div>5000</div>
                  <div>0</div>
                </div>

                {/* X轴标签 */}
                <div style={{ 
                  position: 'absolute', 
                  left: '45px', 
                  right: '5px',
                  bottom: '0', 
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '8.64px',
                  color: '#212a37',
                  opacity: 0.5,
                  fontFamily: 'Source Han Sans CN, sans-serif'
                }}>
                  <div>2025-02</div>
                  <div>2025-05</div>
                  <div>2025-06</div>
                </div>

                {/* 图表线条 */}
                <div style={{ 
                  position: 'absolute',
                  left: '45px',
                  top: '5px',
                  right: '5px',
                  bottom: '20px'
                }}>
                  <ChartImage 
                    src={IMG_CHART1} 
                    alt="5TC图表"
                    placeholder={<ChartPlaceholder color="#2e56a3" />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 第二个图表：基差实际值 */}
          <div className="chart-comparison-section">
            <div className="chart-comparison-title">
              <span>基差实际值</span>
              <div className="chart-legend-line" style={{ background: '#ff6b6b' }}></div>
            </div>
            <div className="chart-comparison-box">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Y轴标签 */}
                <div style={{ 
                  position: 'absolute', 
                  left: '5px', 
                  top: '0', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  paddingTop: '5px',
                  paddingBottom: '20px',
                  fontSize: '8.64px',
                  color: '#212a37',
                  opacity: 0.5,
                  fontFamily: 'Source Han Sans CN, sans-serif'
                }}>
                  <div style={{ height: '8px' }}>14000</div>
                </div>

                {/* X轴标签 */}
                <div style={{ 
                  position: 'absolute', 
                  left: '45px', 
                  right: '5px',
                  bottom: '0', 
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '8.64px',
                  color: '#212a37',
                  opacity: 0.5,
                  fontFamily: 'Source Han Sans CN, sans-serif'
                }}>
                  <div>2025-02</div>
                  <div>2025-05</div>
                  <div>2025-08</div>
                </div>

                {/* 图表线条 */}
                <div style={{ 
                  position: 'absolute',
                  left: '45px',
                  top: '5px',
                  right: '5px',
                  bottom: '20px'
                }}>
                  <ChartImage 
                    src={IMG_CHART2} 
                    alt="基差图表"
                    placeholder={<ChartPlaceholder color="#ff6b6b" />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 第三个图表：基差比例 */}
          <div className="chart-comparison-section">
            <div className="chart-comparison-title">
              <span>基差比例</span>
              <div className="chart-legend-line" style={{ background: '#66bb6a' }}></div>
            </div>
            <div className="chart-comparison-box">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Y轴标签 */}
                <div style={{ 
                  position: 'absolute', 
                  left: '5px', 
                  top: '0', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  paddingTop: '5px',
                  paddingBottom: '20px',
                  fontSize: '8.64px',
                  color: '#212a37',
                  opacity: 0.5,
                  fontFamily: 'Source Han Sans CN, sans-serif'
                }}>
                  <div>120%</div>
                  <div>100%</div>
                  <div>80%</div>
                  <div>60%</div>
                  <div>40%</div>
                  <div>20%</div>
                  <div>0%</div>
                </div>

                {/* X轴标签 */}
                <div style={{ 
                  position: 'absolute', 
                  left: '45px', 
                  right: '5px',
                  bottom: '0', 
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '8.64px',
                  color: '#212a37',
                  opacity: 0.5,
                  fontFamily: 'Source Han Sans CN, sans-serif'
                }}>
                  <div>2025-02</div>
                  <div>2025-05</div>
                  <div>2025-08</div>
                </div>

                {/* 图表线条 */}
                <div style={{ 
                  position: 'absolute',
                  left: '45px',
                  top: '5px',
                  right: '5px',
                  bottom: '20px'
                }}>
                  <ChartImage 
                    src={IMG_CHART3} 
                    alt="基差比例图表"
                    placeholder={<ChartPlaceholder color="#66bb6a" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoublePositionChart

