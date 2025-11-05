import React from 'react'
import './StrategyPage.css'

// 来自 Figma MCP 的图表图片资源（7天有效期）
const IMG_CHART_LINE1 = 'https://www.figma.com/api/mcp/asset/ceb63b63-29b6-4c36-be41-49e94ea1b3f8'
const IMG_CHART_LINE2 = 'https://www.figma.com/api/mcp/asset/cf69431c-3c93-4b61-8b70-e4697715b861'

const SinglePositionChart: React.FC = () => {
  return (
    <div className="strategy-page single-position-chart-page">
      <p className="strategy-page-title">单头寸策略展示</p>
      
      <div className="single-position-chart-content">
        {/* 图表控制区域 */}
        <div className="chart-controls">
          <div className="chart-control-group">
            <p className="chart-control-label">年份：</p>
            <div className="chart-control-select">
              <span>2025</span>
              <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 4L0 0H7L3.5 4Z" fill="#2e56a3"/>
              </svg>
            </div>
          </div>
          <button type="button" className="chart-button">国内运费</button>
          <button type="button" className="chart-button">查询</button>
        </div>

        {/* 图表标题 */}
        <p className="chart-section-title">实际价格VS预测价格</p>

        {/* 图表容器 */}
        <div className="chart-container">
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Y轴标签 */}
            <div style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '0', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingTop: '10px',
              paddingBottom: '30px',
              fontSize: '8.64px',
              color: '#212a37',
              opacity: 0.5,
              fontFamily: 'Source Han Sans CN, sans-serif'
            }}>
              <div>60</div>
              <div>50</div>
              <div>40</div>
              <div>30</div>
              <div>20</div>
              <div>10</div>
              <div>0</div>
            </div>

            {/* X轴标签 */}
            <div style={{ 
              position: 'absolute', 
              left: '50px', 
              right: '10px',
              bottom: '0', 
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '8.64px',
              color: '#212a37',
              opacity: 0.5,
              fontFamily: 'Source Han Sans CN, sans-serif'
            }}>
              <div>2025-01-08</div>
              <div>2025-02-13</div>
              <div>2025-03-13</div>
              <div>2025-04-10</div>
              <div>2025-05-09</div>
              <div>2025-06-20</div>
              <div>2025-07-24</div>
              <div>2025-08-21</div>
              <div>2025-09-18</div>
            </div>

            {/* 图表线条 */}
            <div style={{ 
              position: 'absolute',
              left: '50px',
              top: '10px',
              right: '10px',
              bottom: '30px'
            }}>
              <img 
                src={IMG_CHART_LINE1} 
                alt="预测价格线" 
                style={{ 
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
              <img 
                src={IMG_CHART_LINE2} 
                alt="实际价格线" 
                style={{ 
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* 图例 */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              display: 'flex',
              gap: '16px',
              fontSize: '8.64px',
              color: '#212a37',
              fontFamily: 'Source Han Sans CN, sans-serif'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '18px', height: '3.456px', background: '#2e56a3' }}></div>
                <span style={{ opacity: 0.5 }}>实际价格</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '18px', height: '3.456px', background: '#ff6b6b' }}></div>
                <span style={{ opacity: 0.5 }}>预测价格</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePositionChart

