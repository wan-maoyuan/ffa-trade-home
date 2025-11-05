import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './ProductsServices.css'
import backgroundImage from '../assets/images/product-background.jpeg'
import SignalPanel from './SignalPanel'
import StrategyPanel from './StrategyPanel'

const ProductsServices: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'none' | 'signal' | 'strategy'>('none')

  const handleSignalClick = () => {
    navigate('/product-service/signal')
  }
  const handleStrategyClick = () => {
    navigate('/product-service/strategy')
  }

  useEffect(() => {
    if (location.pathname === '/product-service/signal') {
      setActiveTab('signal')
    } else if (location.pathname === '/product-service/strategy') {
      setActiveTab('strategy')
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
          <div className="category-item category-item-clickable" onClick={handleSignalClick}>
            <p className="category-title">信号</p>
            <p className="category-description">为用户把握市场动态提供更丰富的信号参考</p>
          </div>
          <div className="category-item category-item-clickable" onClick={handleStrategyClick}>
            <p className="category-title">策略</p>
            <p className="category-description">为用户量身定制做多或做空策略建议</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSignal = () => (
    <div className="products-main-container">
      <SignalPanel />
    </div>
  )

  const renderStrategy = () => (
    <div className="products-main-container">
      <StrategyPanel />
    </div>
  )

  return (
    <div className="products-services-page">
      {activeTab === 'signal' && renderSignal()}
      {activeTab === 'strategy' && renderStrategy()}
      {activeTab === 'none' && renderDefault()}
    </div>
  )
}

export default ProductsServices
