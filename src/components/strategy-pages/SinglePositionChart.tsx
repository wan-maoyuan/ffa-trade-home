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
            <span className="chart-control-label">年份：</span>
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
          <div className="chart-inner">
            {/* Y轴标签 */}
            <div className="chart-y-axis">
              <div>60</div>
              <div>50</div>
              <div>40</div>
              <div>30</div>
              <div>20</div>
              <div>10</div>
              <div>0</div>
            </div>

            {/* X轴标签 */}
            <div className="chart-x-axis">
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
            <div className="chart-lines">
              <img 
                src={IMG_CHART_LINE1} 
                alt="预测价格线" 
                className="chart-line-image"
              />
              <img 
                src={IMG_CHART_LINE2} 
                alt="实际价格线" 
                className="chart-line-image"
              />
            </div>

            {/* 图例 */}
            <div className="chart-legend">
              <div className="chart-legend-item">
                <div className="chart-legend-line" style={{ background: '#2e56a3' }}></div>
                <span>实际价格</span>
              </div>
              <div className="chart-legend-item">
                <div className="chart-legend-line" style={{ background: '#ff6b6b' }}></div>
                <span>预测价格</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePositionChart

