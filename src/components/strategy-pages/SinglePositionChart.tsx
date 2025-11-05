import React from 'react'
import './StrategyPage.css'

// 来自 Figma MCP 的图表图片资源（7天有效期）
const IMG_CHART_LINE1 = 'https://www.figma.com/api/mcp/asset/27fd4dc5-f512-4aa6-ab1a-ed912d81a4df'
const IMG_CHART_LINE2 = 'https://www.figma.com/api/mcp/asset/f748ce66-1cca-4667-a509-9e152acc6c79'
const IMG_MENU_ICON = 'https://www.figma.com/api/mcp/asset/7454cc4a-4e2e-441b-9f10-1c1eb36d599d'

const SinglePositionChart: React.FC = () => {
  return (
    <div className="strategy-page single-position-chart-figma">
      {/* 标题 */}
      <p className="chart-title-center">单头寸策略展示</p>

      {/* 控制区域 */}
      <div className="chart-controls-area">
        {/* 年份选择 */}
        <div className="chart-year-control">
          <span className="chart-year-label">年份：</span>
          <div className="chart-year-select">
            <span>2025</span>
            <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
              <path d="M3.5 4L0 0H7L3.5 4Z" fill="#2e56a3"/>
            </svg>
          </div>
        </div>

        {/* 国内运费按钮 */}
        <button type="button" className="chart-btn-freight">国内运费</button>

        {/* 查询按钮 */}
        <button type="button" className="chart-btn-query">查询</button>

        {/* 图表标题 */}
        <p className="chart-subtitle">实际价格VS预测价格</p>

        {/* 三点菜单 */}
        <div className="chart-menu-icon">
          <img src={IMG_MENU_ICON} alt="菜单" />
        </div>
      </div>

      {/* 图表区域 */}
      <div className="chart-area-container">
        {/* 图表网格 */}
        <div className="chart-grid">
          {/* Y轴标签 */}
          <div className="chart-y-labels">
            <span>60</span>
            <span>50</span>
            <span>40</span>
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
          </div>

          {/* 图表绘图区 */}
          <div className="chart-plot">
            {/* 折线图 */}
            <img src={IMG_CHART_LINE1} alt="折线图1" className="chart-line" />
            <img src={IMG_CHART_LINE2} alt="折线图2" className="chart-line" />
          </div>

          {/* X轴标签 */}
          <div className="chart-x-labels">
            <span>2025-01-08</span>
            <span>2025-02-13</span>
            <span>2025-03-13</span>
            <span>2025-04-10</span>
            <span>2025-05-09</span>
            <span>2025-06-20</span>
            <span>2025-07-24</span>
            <span>2025-08-21</span>
            <span>2025-09-18</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePositionChart

