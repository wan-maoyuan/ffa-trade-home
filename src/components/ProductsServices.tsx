import React from 'react'
import './ProductsServices.css'
import backgroundImage from '../assets/images/product-background.jpeg'


const ProductsServices: React.FC = () => {
  return (
    <div className="products-services-page">
      {/* 白色主容器 */}
      <div className="products-main-container">
        {/* 背景图片 */}
        <div className="background-image-container">
          <img 
            alt="产品与服务背景" 
            className="background-image"
            src={backgroundImage}
          />
        </div>

        {/* 产品分类区域 */}
        <div className="products-categories">
          <div className="category-grid">
            <div className="category-item">
              <p className="category-title">课程</p>
              <p className="category-description">
                深度解析期权定价、风险管理等核心知识
              </p>
            </div>
            
            <div className="category-item">
              <p className="category-title">工具</p>
              <p className="category-description">
                专为航运从业者打造，实现科学决策与运营增效
              </p>
            </div>
            
            <div className="category-item">
              <p className="category-title">信号</p>
              <p className="category-description">
                为用户把握市场动态提供更丰富的信号参考
              </p>
            </div>
            
            <div className="category-item">
              <p className="category-title">策略</p>
              <p className="category-description">
                为用户量身定制做多或做空策略建议
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsServices
