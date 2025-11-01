import React from 'react'
import './CoursePanel.css'
// 来自 Figma MCP (node 1:1485) 的课程主图资源，7 天有效
// const courseImageUrl = "https://www.figma.com/api/mcp/asset/ab94109b-3b8d-4f52-9d28-3522bf400810"
import courseImage from '../assets/images/course-background.png'
import SideMenu from './SideMenu'

const CoursePanel: React.FC = () => {
  return (
    <div className="course-panel">
      <SideMenu currentPage="course" />

      <h1 className="course-panel-title">AQUABRIDGE</h1>
      <p className="course-panel-subtitle">一站式衍生品综合服务商</p>
      <p className="course-panel-subtitle-en">One-stop derivatives integrated service provider</p>

      <div className="course-panel-desc">
        <p>课程由资深讲师管大宇领衔，聚焦期权与衍生品领域。</p>
        <p className="highlight">课程深度解析期权定价、风险管理等核心知识，结合实战案例，助力学员掌握衍生品交易策略，提升金融实战能力，是金融从业者进阶的优选课程。</p>
      </div>

      <button className="course-panel-button"><span>课程入口</span></button>

      <div className="course-panel-image-wrap">
        <img alt="课程图片" className="course-panel-image" src={courseImage} />
      </div>
    </div>
  )
}

export default CoursePanel


