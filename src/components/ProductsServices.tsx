import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './ProductsServices.css'
import backgroundImage from '../assets/images/product-background.jpeg'
import CoursePanel from './CoursePanel'

const ProductsServices: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'none' | 'course'>('none')

  const handleCourseClick = () => {
    navigate('/product-service/course')
  }

  useEffect(() => {
    if (location.pathname === '/product-service/course') {
      setActiveTab('course')
    } else {
      setActiveTab('none')
    }
  }, [location.pathname])

  const renderDefault = () => (
    <div className="products-main-container">
      <div className="background-image-container">
        <img 
          alt="产品与服务背景" 
          className="background-image"
          src={backgroundImage}
        />
      </div>

      <div className="products-categories">
        <div className="category-grid">
          <div className="category-item category-item-clickable" onClick={handleCourseClick}>
            <p className="category-title">课程</p>
            <p className="category-description">深度解析期权定价、风险管理等核心知识</p>
          </div>
          <div className="category-item">
            <p className="category-title">工具</p>
            <p className="category-description">专为航运从业者打造，实现科学决策与运营增效</p>
          </div>
          <div className="category-item">
            <p className="category-title">信号</p>
            <p className="category-description">为用户把握市场动态提供更丰富的信号参考</p>
          </div>
          <div className="category-item">
            <p className="category-title">策略</p>
            <p className="category-description">为用户量身定制做多或做空策略建议</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCourse = () => (
    <div className="products-main-container">
      <CoursePanel />
    </div>
  )

  return (
    <div className="products-services-page">
      {activeTab === 'course' ? renderCourse() : renderDefault()}
    </div>
  )
}

export default ProductsServices
