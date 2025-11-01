import React from 'react'
import './CoursePanel.css'
import SideMenu from './SideMenu'

// 来自 Figma MCP 的临时图片资源（7天有效）。如需长期使用请下载到本地 assets。
const IMG_SIG_BADGE = 'https://www.figma.com/api/mcp/asset/1786a95c-e501-4def-885a-54adde6f226b'

const SignalPanel: React.FC = () => {
  return (
    <div className="course-panel" data-node-id="1:1753">
      <SideMenu currentPage="signal" />

      <h1 className="course-panel-title">AQUABRIDGE</h1>
      <p className="course-panel-subtitle">一站式衍生品综合服务商</p>
      <p className="course-panel-subtitle-en">One-stop derivatives integrated service provider</p>

      <div className="course-panel-desc">
        我们专注于航运市场信号的捕捉。依托海量且全面的航运市场数据，凭借先进的数据分析技术和专业模型，精准识别价格波动信号。这些信号犹如市场的“风向标”，能敏锐反映价格即将发生的变动趋势，无论是上涨还是下跌的先兆，都能及时被我们捕捉到，为用户提前感知市场变化提供关键指引。同时，我们深度剖析基差变化，基差波动往往蕴含着市场供需关系的微妙转变，通过对其细致分析，能进一步洞察市场潜在趋势，为用户把握市场动态提供更丰富的信号参考。
      </div>

      <button type="button" className="course-panel-button">
        <span>信号服务入口</span>
      </button>

      <div className="course-panel-image-wrap">
        <img alt="信号示意" className="course-panel-image" src={IMG_SIG_BADGE} />
      </div>
    </div>
  )
}

export default SignalPanel


