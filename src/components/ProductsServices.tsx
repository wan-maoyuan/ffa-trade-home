import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './ProductsServices.css'
import backgroundImage from '../assets/images/product-background.jpeg'
import SignalPanel from './SignalPanel'
import StrategyPanel from './StrategyPanel'
import RealtimeSignalPage from './signal-pages/RealtimeSignalPage'

const ProductsServices: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'none' | 'signal' | 'strategy' | 'realtime'>('none')

  const handleSignalClick = () => {
    navigate('/product-service/signal')
  }
  const handleStrategyClick = () => {
    navigate('/product-service/strategy')
  }

  useEffect(() => {
    if (location.pathname === '/product-service/signal/realtime') {
      setActiveTab('realtime')
    } else if (location.pathname === '/product-service/signal') {
      setActiveTab('signal')
    } else if (location.pathname === '/product-service/strategy') {
      setActiveTab('strategy')
    } else {
      setActiveTab('none')
    }
  }, [location.pathname])

  const renderDefault = () => (
    <section className="products-landing">
      <img
        alt="远洋港口城市的黄昏景象"
        className="products-landing-background"
        src={backgroundImage}
      />
      <div className="products-landing-overlay" />
      <div className="products-landing-content">
        <span className="products-eyebrow">Products &amp; Services</span>
        <h1 className="products-title">航运衍生品全链路解决方案</h1>
        <p className="products-description">
          我们结合交易、风控与研究能力，为全球航运企业、贸易商及金融机构提供灵活的产品组合，帮助团队在复杂市场中保持敏捷、稳健与透明。
        </p>
        <div className="products-grid">
          <button
            className="products-card"
            onClick={handleSignalClick}
            type="button"
          >
            <span className="products-card-tag">Market Signals</span>
            <span className="products-card-title">信号洞察</span>
            <span className="products-card-description">
              多维度量化指标与实时监测，辅助决策团队更快识别趋势、风险与机会窗口。
            </span>
            <span aria-hidden className="products-card-arrow">→</span>
          </button>
          <button
            className="products-card"
            onClick={handleStrategyClick}
            type="button"
          >
            <span className="products-card-tag">Strategic Advisory</span>
            <span className="products-card-title">策略赋能</span>
            <span className="products-card-description">
              结合航运链路与金融衍生品实践，定制对冲方案与组合策略，驱动收益与稳健增长。
            </span>
            <span aria-hidden className="products-card-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  )

  const renderSignal = () => (
    <SignalPanel />
  )

  const renderStrategy = () => (
    <StrategyPanel />
  )

  const renderRealtime = () => (
    <RealtimeSignalPage />
  )

  return (
    <div className="products-services-page">
      {activeTab === 'realtime' && renderRealtime()}
      {activeTab === 'signal' && renderSignal()}
      {activeTab === 'strategy' && renderStrategy()}
      {activeTab === 'none' && renderDefault()}
    </div>
  )
}

export default ProductsServices
