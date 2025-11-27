import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import P4TCDecisionPage from './P4TCDecisionPage'
import P5DecisionPage from './P5DecisionPage'
import P5_14dDecisionPage from './P5_14dDecisionPage'
import './DecisionPageWrapper.css'

type MainStrategyType = 'p4tc' | 'p5'
type P5SubStrategyType = '42d' | '14d'

const DecisionPageWrapper: React.FC = () => {
  const navigate = useNavigate()
  const [activeMainStrategy, setActiveMainStrategy] = useState<MainStrategyType>('p4tc')
  const [activeP5SubStrategy, setActiveP5SubStrategy] = useState<P5SubStrategyType>('42d')

  const handleBackClick = () => {
    navigate('/product-service/strategy')
  }

  const handleMainStrategyChange = (strategy: MainStrategyType) => {
    setActiveMainStrategy(strategy)
    // 切换到P5时，默认选择42天后
    if (strategy === 'p5') {
      setActiveP5SubStrategy('42d')
    }
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

        {/* 主策略标签切换 */}
        <div className="decision-page-tabs">
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p4tc' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p4tc')}
          >
            P4TC现货应用决策
          </button>
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p5' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p5')}
          >
            P5的现货应用决策
          </button>
        </div>

        {/* P5子标签切换（仅在P5选中时显示） */}
        {activeMainStrategy === 'p5' && (
          <div className="decision-page-sub-tabs">
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP5SubStrategy === '42d' ? 'active' : ''}`}
              onClick={() => setActiveP5SubStrategy('42d')}
            >
              42天后
            </button>
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP5SubStrategy === '14d' ? 'active' : ''}`}
              onClick={() => setActiveP5SubStrategy('14d')}
            >
              14天后
            </button>
          </div>
        )}

        {/* 根据选中的策略显示对应页面 */}
        <div className="decision-page-content">
          {activeMainStrategy === 'p4tc' ? (
            <P4TCDecisionPage />
          ) : activeP5SubStrategy === '42d' ? (
            <P5DecisionPage />
          ) : (
            <P5_14dDecisionPage />
          )}
        </div>
      </div>
    </div>
  )
}

export default DecisionPageWrapper

