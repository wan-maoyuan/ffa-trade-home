import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import P4TCDecisionPage from './P4TCDecisionPage'
import P5DecisionPage from './P5DecisionPage'
import P5_14dDecisionPage from './P5_14dDecisionPage'
import P3A_42dDecisionPage from './P3A_42dDecisionPage'
import P3A_14dDecisionPage from './P3A_14dDecisionPage'
import P6_42dDecisionPage from './P6_42dDecisionPage'
import P6_14dDecisionPage from './P6_14dDecisionPage'
import './DecisionPageWrapper.css'

type MainStrategyType = 'p4tc' | 'p5' | 'p3a' | 'p6'
type P5SubStrategyType = '42d' | '14d'
type P3ASubStrategyType = '42d' | '14d'
type P6SubStrategyType = '42d' | '14d'

const DecisionPageWrapper: React.FC = () => {
  const navigate = useNavigate()
  const [activeMainStrategy, setActiveMainStrategy] = useState<MainStrategyType>('p4tc')
  const [activeP5SubStrategy, setActiveP5SubStrategy] = useState<P5SubStrategyType>('42d')
  const [activeP3ASubStrategy, setActiveP3ASubStrategy] = useState<P3ASubStrategyType>('42d')
  const [activeP6SubStrategy, setActiveP6SubStrategy] = useState<P6SubStrategyType>('42d')

  const handleBackClick = () => {
    navigate('/product-service/strategy')
  }

  const handleMainStrategyChange = (strategy: MainStrategyType) => {
    setActiveMainStrategy(strategy)
    // 切换到P5时，默认选择42天后
    if (strategy === 'p5') {
      setActiveP5SubStrategy('42d')
    }
    // 切换到P3A时，默认选择42天后
    if (strategy === 'p3a') {
      setActiveP3ASubStrategy('42d')
    }
    // 切换到P6时，默认选择42天后
    if (strategy === 'p6') {
      setActiveP6SubStrategy('42d')
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
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p3a' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p3a')}
          >
            P3A的现货应用决策
          </button>
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p6' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p6')}
          >
            P6的现货应用决策
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

        {/* P3A子标签切换（仅在P3A选中时显示） */}
        {activeMainStrategy === 'p3a' && (
          <div className="decision-page-sub-tabs">
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP3ASubStrategy === '42d' ? 'active' : ''}`}
              onClick={() => setActiveP3ASubStrategy('42d')}
            >
              42天后
            </button>
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP3ASubStrategy === '14d' ? 'active' : ''}`}
              onClick={() => setActiveP3ASubStrategy('14d')}
            >
              14天后
            </button>
          </div>
        )}

        {/* P6子标签切换（仅在P6选中时显示） */}
        {activeMainStrategy === 'p6' && (
          <div className="decision-page-sub-tabs">
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP6SubStrategy === '42d' ? 'active' : ''}`}
              onClick={() => setActiveP6SubStrategy('42d')}
            >
              42天后
            </button>
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP6SubStrategy === '14d' ? 'active' : ''}`}
              onClick={() => setActiveP6SubStrategy('14d')}
            >
              14天后
            </button>
          </div>
        )}

        {/* 根据选中的策略显示对应页面 */}
        <div className="decision-page-content">
          {activeMainStrategy === 'p4tc' ? (
            <P4TCDecisionPage />
          ) : activeMainStrategy === 'p5' ? (
            activeP5SubStrategy === '42d' ? (
              <P5DecisionPage />
            ) : (
              <P5_14dDecisionPage />
            )
          ) : activeMainStrategy === 'p3a' ? (
            activeP3ASubStrategy === '42d' ? (
              <P3A_42dDecisionPage />
            ) : (
              <P3A_14dDecisionPage />
            )
          ) : activeP6SubStrategy === '42d' ? (
            <P6_42dDecisionPage />
          ) : (
            <P6_14dDecisionPage />
          )}
        </div>
      </div>
    </div>
  )
}

export default DecisionPageWrapper

