import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import P4TCDecisionPage from './P4TCDecisionPage'
import P5DecisionPage from './P5DecisionPage'
import './DecisionPageWrapper.css'

type StrategyType = 'p4tc' | 'p5'

const DecisionPageWrapper: React.FC = () => {
  const navigate = useNavigate()
  const [activeStrategy, setActiveStrategy] = useState<StrategyType>('p4tc')

  const handleBackClick = () => {
    navigate('/product-service/strategy')
  }

  return (
    <div className="decision-page-wrapper">
      <SideMenu currentPage="strategy" />
      
      <div className="decision-page-container">
        {/* 返回按钮 */}
        <button 
          className="decision-page-back-button"
          onClick={handleBackClick}
          type="button"
          aria-label="返回上一级"
        >
          <span className="decision-page-back-icon">←</span>
          <span className="decision-page-back-text">返回</span>
        </button>

        {/* 策略标签切换 */}
        <div className="decision-page-tabs">
          <button
            type="button"
            className={`decision-page-tab ${activeStrategy === 'p4tc' ? 'active' : ''}`}
            onClick={() => setActiveStrategy('p4tc')}
          >
            P4TC现货应用决策
          </button>
          <button
            type="button"
            className={`decision-page-tab ${activeStrategy === 'p5' ? 'active' : ''}`}
            onClick={() => setActiveStrategy('p5')}
          >
            P5现货应用决策（42天后）
          </button>
        </div>

        {/* 根据选中的策略显示对应页面 */}
        <div className="decision-page-content">
          {activeStrategy === 'p4tc' ? (
            <P4TCDecisionPage />
          ) : (
            <P5DecisionPage />
          )}
        </div>
      </div>
    </div>
  )
}

export default DecisionPageWrapper

