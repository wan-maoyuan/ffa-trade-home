import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import P4TCDecisionPage from './P4TCDecisionPage'
import P5DecisionPage from './P5DecisionPage'
import P5_14dDecisionPage from './P5_14dDecisionPage'
import P5HistoricalForecastPage from './P5HistoricalForecastPage'
import P3A_42dDecisionPage from './P3A_42dDecisionPage'
import P3A_14dDecisionPage from './P3A_14dDecisionPage'
import P6_42dDecisionPage from './P6_42dDecisionPage'
import P6_14dDecisionPage from './P6_14dDecisionPage'
import C3_42dDecisionPage from './C3_42dDecisionPage'
import C5_42dDecisionPage from './C5_42dDecisionPage'
import C3_14dDecisionPage from './C3_14dDecisionPage'
import C5_14dDecisionPage from './C5_14dDecisionPage'
import P3AHistoricalForecastPage from './P3AHistoricalForecastPage'
import P6HistoricalForecastPage from './P6HistoricalForecastPage'
import C3HistoricalForecastPage from './C3HistoricalForecastPage'
import C5HistoricalForecastPage from './C5HistoricalForecastPage'
import strategyBackground from '../../assets/images/strategy-background.jpeg'
import LockOverlay from '../LockOverlay'
import './DecisionPageWrapper.css'

type MainStrategyType = 'p4tc' | 'p5' | 'p3a' | 'p6' | 'c3' | 'c5'
type P5SubStrategyType = '42d' | '14d' | 'historical'
type P3ASubStrategyType = '42d' | '14d' | 'historical'
type P6SubStrategyType = '42d' | '14d' | 'historical'
type C3SubStrategyType = '42d' | '14d' | 'historical'
type C5SubStrategyType = '42d' | '14d' | 'historical'

const DecisionPageWrapper: React.FC = () => {
  const navigate = useNavigate()
  const [activeMainStrategy, setActiveMainStrategy] = useState<MainStrategyType>('p5')
  const [activeP5SubStrategy, setActiveP5SubStrategy] = useState<P5SubStrategyType>('42d')
  const [activeP3ASubStrategy, setActiveP3ASubStrategy] = useState<P3ASubStrategyType>('42d')
  const [activeP6SubStrategy, setActiveP6SubStrategy] = useState<P6SubStrategyType>('42d')
  const [activeC3SubStrategy, setActiveC3SubStrategy] = useState<C3SubStrategyType>('42d')

  const [activeC5SubStrategy, setActiveC5SubStrategy] = useState<C5SubStrategyType>('42d')

  const [permissions, setPermissions] = useState<string[]>([])
  const [permissionLevel, setPermissionLevel] = useState<number>(0)
  const [loadingPermissions, setLoadingPermissions] = useState(true)

  useEffect(() => {
    const fetchPermissions = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('请先登录')
        navigate('/login')
        return
      }

      try {
        const response = await fetch('https://aqua.navgreen.cn/api/user/permissions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        })

        const data = await response.json()
        
        // 处理 token 过期的情况
        if (data.code === 4002) {
          // 清除本地存储的认证信息
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          // 显示提示信息
          alert(data.msg || '登录已过期，请重新登录')
          // 跳转到登录页面
          navigate('/login')
          return
        }

        if (response.ok && data.code === 200) {
          setPermissions(data.data.strategy || [])
          // Get permission level from localStorage as it's not in this API response
          const userStr = localStorage.getItem('user')
          if (userStr) {
            try {
              const user = JSON.parse(userStr)
              setPermissionLevel(user.permission || 0)
            } catch (e) {
              console.error('Failed to parse user data', e)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
      } finally {
        setLoadingPermissions(false)
      }
    }

    fetchPermissions()
  }, [navigate])

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
    if (strategy === 'c3') {
      setActiveC3SubStrategy('42d')
    }
    if (strategy === 'c5') {
      setActiveC5SubStrategy('42d')
    }
  }

  return (
    <div className="decision-page-wrapper">
      <div className="decision-page-bg">
        <img alt="背景" src={strategyBackground} />
        <div className="decision-page-bg-mask" />
      </div>
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
          {/* <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p4tc' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p4tc')}
          >
            P4TC现货应用决策
          </button> */}
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p5' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p5')}
          >
            P5现货
          </button>
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p3a' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p3a')}
          >
            P3A现货
          </button>
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'p6' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('p6')}
          >
            P6现货
          </button>
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'c3' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('c3')}
          >
            C3现货
          </button>
          <button
            type="button"
            className={`decision-page-tab ${activeMainStrategy === 'c5' ? 'active' : ''}`}
            onClick={() => handleMainStrategyChange('c5')}
          >
            C5现货
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
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP5SubStrategy === 'historical' ? 'active' : ''}`}
              onClick={() => setActiveP5SubStrategy('historical')}
            >
              历史预测
            </button>
          </div>
        )}

        {/* P3A子标签切换（仅在P3A选中时显示） */}
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
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP3ASubStrategy === 'historical' ? 'active' : ''}`}
              onClick={() => setActiveP3ASubStrategy('historical')}
            >
              历史预测
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
            <button
              type="button"
              className={`decision-page-sub-tab ${activeP6SubStrategy === 'historical' ? 'active' : ''}`}
              onClick={() => setActiveP6SubStrategy('historical')}
            >
              历史预测
            </button>
          </div>
        )}

        {/* C3子标签切换（仅在C3选中时显示） */}
        {activeMainStrategy === 'c3' && (
          <div className="decision-page-sub-tabs">
            <button
              type="button"
              className={`decision-page-sub-tab ${activeC3SubStrategy === '42d' ? 'active' : ''}`}
              onClick={() => setActiveC3SubStrategy('42d')}
            >
              42天后
            </button>
            <button
              type="button"
              className={`decision-page-sub-tab ${activeC3SubStrategy === '14d' ? 'active' : ''}`}
              onClick={() => setActiveC3SubStrategy('14d')}
            >
              14天后
            </button>
            <button
              type="button"
              className={`decision-page-sub-tab ${activeC3SubStrategy === 'historical' ? 'active' : ''}`}
              onClick={() => setActiveC3SubStrategy('historical')}
            >
              历史预测
            </button>
          </div>
        )}

        {/* C5子标签切换（仅在C5选中时显示） */}
        {activeMainStrategy === 'c5' && (
          <div className="decision-page-sub-tabs">
            <button
              type="button"
              className={`decision-page-sub-tab ${activeC5SubStrategy === '42d' ? 'active' : ''}`}
              onClick={() => setActiveC5SubStrategy('42d')}
            >
              42天后
            </button>
            <button
              type="button"
              className={`decision-page-sub-tab ${activeC5SubStrategy === '14d' ? 'active' : ''}`}
              onClick={() => setActiveC5SubStrategy('14d')}
            >
              14天后
            </button>
            <button
              type="button"
              className={`decision-page-sub-tab ${activeC5SubStrategy === 'historical' ? 'active' : ''}`}
              onClick={() => setActiveC5SubStrategy('historical')}
            >
              历史预测
            </button>
          </div>
        )}

        {/* 根据选中的策略显示对应页面 */}
        <div className="decision-page-content" style={{ position: 'relative', minHeight: '400px' }}>
          {activeMainStrategy === 'p4tc' ? (
            <P4TCDecisionPage />
          ) : activeMainStrategy === 'p5' ? (
            permissionLevel !== 99 && !permissions.includes('P5') ? (
              <LockOverlay />
            ) : activeP5SubStrategy === '42d' ? (
              <P5DecisionPage />
            ) : activeP5SubStrategy === '14d' ? (
              <P5_14dDecisionPage />
            ) : (
              <P5HistoricalForecastPage />
            )
          ) : activeMainStrategy === 'p3a' ? (
            permissionLevel !== 99 && !permissions.includes('P3A') ? (
              <LockOverlay />
            ) : activeP3ASubStrategy === '42d' ? (
              <P3A_42dDecisionPage />
            ) : activeP3ASubStrategy === '14d' ? (
              <P3A_14dDecisionPage />
            ) : (
              <P3AHistoricalForecastPage />
            )
          ) : activeMainStrategy === 'p6' ? (
            permissionLevel !== 99 && !permissions.includes('P6') ? (
              <LockOverlay />
            ) : activeP6SubStrategy === '42d' ? (
              <P6_42dDecisionPage />
            ) : activeP6SubStrategy === '14d' ? (
              <P6_14dDecisionPage />
            ) : (
              <P6HistoricalForecastPage />
            )
          ) : activeMainStrategy === 'c3' ? (
            permissionLevel !== 99 && !permissions.includes('C3') ? (
              <LockOverlay />
            ) : activeC3SubStrategy === '42d' ? (
              <C3_42dDecisionPage />
            ) : activeC3SubStrategy === '14d' ? (
              <C3_14dDecisionPage />
            ) : (
              <C3HistoricalForecastPage />
            )
          ) : (
            permissionLevel !== 99 && !permissions.includes('C5') ? (
              <LockOverlay />
            ) : activeC5SubStrategy === '42d' ? (
              <C5_42dDecisionPage />
            ) : activeC5SubStrategy === '14d' ? (
              <C5_14dDecisionPage />
            ) : (
              <C5HistoricalForecastPage />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default DecisionPageWrapper
