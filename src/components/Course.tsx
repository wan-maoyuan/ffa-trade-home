import React from 'react'
import './Course.css'
import backgroundImage from '../assets/images/product-background.jpeg'

const Course: React.FC = () => {
  return (
    <div className="course-page">
      <div className="course-main-container">
        {/* 左侧导航栏 */}
        <div className="course-sidebar">
          <div className="course-sidebar-active-bg"></div>
          <div className="course-sidebar-content">
            <div className="course-sidebar-item active">
              <p>课程</p>
            </div>
            <div className="course-sidebar-item">
              <p>工具</p>
            </div>
            <div className="course-sidebar-item">
              <p>信号</p>
            </div>
            <div className="course-sidebar-item">
              <p>策略</p>
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="course-content">
          {/* 标题区域 */}
          <h1 className="course-title">AQUABRIDGE</h1>
          <p className="course-subtitle">一站式衍生品综合服务商</p>
          <p className="course-subtitle-en">One-stop derivatives integrated service provider</p>

          {/* 课程描述 */}
          <div className="course-description">
            <p className="course-desc-text">
              课程由资深讲师管大宇领衔，聚焦期权与衍生品领域。
            </p>
            <p className="course-desc-text highlight">
              课程深度解析期权定价、风险管理等核心知识，结合实战案例，助力学员掌握衍生品交易策略，提升金融实战能力，是金融从业者进阶的优选课程。
            </p>
          </div>

          {/* 课程入口按钮 */}
          <button className="course-entrance-button">
            <span>课程入口</span>
          </button>

          {/* 右侧课程图片 */}
          <div className="course-image-container">
            <img 
              alt="课程图片" 
              className="course-image"
              src={backgroundImage}
            />
          </div>

          {/* 讲师信息卡片 */}
          <div className="course-instructor-card">
            <div className="course-instructor-card-bg"></div>
            <div className="course-instructor-content">
              <p className="course-instructor-title">管大宇</p>
              <div className="course-instructor-subtitle-container">
                <p className="course-instructor-subtitle">恒力衍生品学院院长</p>
              </div>
              <div className="course-instructor-description">
                <p>毕业于中国科技大学少年班。</p>
                <p>国内顶级期权实战专家，曾在全球金融市场创造8年300倍的收益率，培养出了多位稳定盈利的优秀期权交易员。</p>
                <p>国内期权服务实体产业的开创者，累计实现大宗商品含权贸易额超过600亿元，将中国大宗商品产业带进权现结合时代。</p>
                <p>多家交易所和金融机构特邀讲师，参与国内多个期权合约的设计。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Course

