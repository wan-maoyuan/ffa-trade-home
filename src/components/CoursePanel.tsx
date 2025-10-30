import React from 'react'
import './CoursePanel.css'
import backgroundImage from '../assets/images/product-background.jpeg'

const CoursePanel: React.FC = () => {
  return (
    <div className="course-panel">
      <h1 className="course-panel-title">AQUABRIDGE</h1>
      <p className="course-panel-subtitle">一站式衍生品综合服务商</p>
      <p className="course-panel-subtitle-en">One-stop derivatives integrated service provider</p>

      <div className="course-panel-desc">
        <p>课程由资深讲师管大宇领衔，聚焦期权与衍生品领域。</p>
        <p className="highlight">课程深度解析期权定价、风险管理等核心知识，结合实战案例，助力学员掌握衍生品交易策略，提升金融实战能力，是金融从业者进阶的优选课程。</p>
      </div>

      <button className="course-panel-button"><span>课程入口</span></button>

      <div className="course-panel-image-wrap">
        <img alt="课程图片" className="course-panel-image" src={backgroundImage} />
      </div>
    </div>
  )
}

export default CoursePanel


