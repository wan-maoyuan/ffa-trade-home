import React from 'react'
import './StrategyPage.css'

// 来自 Figma MCP 的图表图片资源（7天有效期）
const IMG_CHART1 = 'https://www.figma.com/api/mcp/asset/4e649ae9-c471-486e-85c2-8f172f1f4e8f'
const IMG_CHART2 = 'https://www.figma.com/api/mcp/asset/4ee4dcfa-51ca-44eb-9059-054b8174e5ca'
const IMG_CHART3 = 'https://www.figma.com/api/mcp/asset/5cd3e836-1c1d-4a61-96b5-7b0df7c114c8'

const DoublePositionChart: React.FC = () => {
  return (
    <div className="strategy-page double-position-chart-page">
      <p className="strategy-page-title">双头寸策略展示</p>
      
      <div className="double-position-chart-content">
        {/* 策略标签 */}
        <div className="strategy-chips">
          <button type="button" className="strategy-chip">对比</button>
          <button type="button" className="strategy-chip" style={{ marginLeft: '458px' }}>基差展示</button>
          <button type="button" className="strategy-chip" style={{ marginLeft: '362px' }}>基差比例</button>
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
                  <img 
                    src={IMG_CHART1} 
                    alt="5TC图表" 
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
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
                  <img 
                    src={IMG_CHART2} 
                    alt="基差图表" 
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
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
                  <img 
                    src={IMG_CHART3} 
                    alt="基差比例图表" 
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
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

