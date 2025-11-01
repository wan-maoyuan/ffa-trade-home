import React, { useState } from 'react'
import './CoursePanel.css'
import './StrategyPanel.css'
import { useNavigate } from 'react-router-dom'
import strategyBackground from '../assets/images/strategy-background.jpeg'

// 来自 Figma MCP 的临时图片资源（7天有效）。如需长期使用请下载到本地 assets。
// const IMG_BG_BLUR = 'https://www.figma.com/api/mcp/asset/4fe6b157-cac1-4fdf-8d93-1fff7e44f6af'
const IMG_CARD_LEFT = 'https://www.figma.com/api/mcp/asset/a574e5c8-8025-4da1-aeda-26e869afc426'

const StrategyPanel: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleToggle = () => setMenuOpen(v => !v)

  const goCourse = () => navigate('/product-service/course')
  const goTools = () => navigate('/product-service/tool')
  const goSignals = () => navigate('/product-service/signal')
  const goStrategy = () => navigate('/product-service/strategy')

  return (
    <div className="strategy-panel" data-node-id="1:1966">
      {/* 背景与渐变遮罩 */}
      <div className="strategy-bg">
        <img alt="策略背景" src={strategyBackground} />
        <div className="strategy-bg-mask" />
      </div>

      {/* 左侧浮动开关与菜单（复用课程页样式） */}
      <button
        type="button"
        className={`floating-toggle ${menuOpen ? 'open' : ''}`}
        onClick={handleToggle}
        aria-expanded={menuOpen}
        aria-label="展开/折叠菜单"
      >
        <span className="chevron" />
      </button>

      <div className={`floating-menu ${menuOpen ? 'show' : ''}`}>
        <button type="button" className="floating-item" onClick={goCourse}>课程</button>
        <button type="button" className="floating-item" onClick={goTools}>工具</button>
        <button type="button" className="floating-item" onClick={goSignals}>信号</button>
        <button type="button" className="floating-item active" onClick={goStrategy}>策略</button>
      </div>

      {/* 居中内容区域 */}
      <div className="strategy-content">
        <h1 className="strategy-title">AQUABRIDGE</h1>
        <p className="strategy-subtitle">一站式衍生品综合服务商</p>
        <button type="button" className="strategy-button">
          <span>策略服务入口</span>
        </button>
        <div className="strategy-desc">
          在策略服务方面，我们根据精准捕捉到的价格波动信号，为用户量身定制做多或做空策略建议。结合对航运市场长期的研究和经验积累，以及当前市场形势的判断，为用户提供切实可行的操作方向，助力用户抓住市场机会。并且，基于对基差变化的深度分析，我们帮助用户更全面地理解市场趋势，综合考虑各种因素，为用户制定出更贴合市场实际的投资策略，让用户在复杂多变的航运市场中，能够做出明智决策，从而实现收益最大化。
        </div>
      </div>

      <div className="strategy-chips">
        <button type="button" className="chip">做多胜率统计</button>
        <button type="button" className="chip">盈亏比：0.76：1</button>
      </div>

      {/* 单头寸策略评价标题 */}
      <p className="strategy-evaluation-title">单头寸策略评价</p>

      {/* 左侧卡片与右侧指标卡组 */}
      <div className="strategy-cards">
        <div className="card-left">
          <div className="card-left-bg">
            <img alt="卡片底图" src={IMG_CARD_LEFT} />
          </div>
          <div className="card-left-content">
            <div className="card-left-title">做  多</div>
            <div className="card-left-sub">建议交易方向</div>
          </div>
        </div>
        <div className="card-metrics">
          <div className="metric-card">
            <p className="label">日期</p>
            <p className="value">2025-08-07</p>
          </div>
          <div className="metric-card">
            <p className="label">当前值</p>
            <p className="value">39.6</p>
          </div>
          <div className="metric-card">
            <p className="label">综合价差比</p>
            <p className="value">20%</p>
          </div>
          <div className="metric-card">
            <p className="label">综合价差比区间</p>
            <p className="value">15%-30%</p>
          </div>
          <div className="metric-card">
            <p className="label">2025-09-18预测值</p>
            <p className="value">48</p>
          </div>
          <div className="metric-card">
            <p className="label">在全部交易日期中出现概率</p>
            <p className="value">9%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StrategyPanel


