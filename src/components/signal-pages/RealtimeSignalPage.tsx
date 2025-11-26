import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import './RealtimeSignalPage.css'

interface ContractData {
  contract_name: string
  predicted_value: string
  current_value: string
  deviation: string
  entry_range: string
  exit_range: string
  operation_suggestion: string
  month: string
  days?: string
}

interface ApiResponse {
  code: number
  msg: string
  data: {
    date: string
    count: number
    records: Array<{
      contracts: Record<string, ContractData>
      swap_date: string
    }>
  }
}

const RealtimeSignalPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contracts, setContracts] = useState<Record<string, ContractData>>({})
  const [selectedContract, setSelectedContract] = useState<string>('')
  const [swapDate, setSwapDate] = useState<string>('')
  const [contractNames, setContractNames] = useState<string[]>([])

  const handleBackClick = () => {
    navigate('/product-service/signal')
  }

  useEffect(() => {
    const fetchSignalData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://aqua.navgreen.cn/api/strategy/price/signal/ffa')
        
        if (!response.ok) {
          throw new Error('网络请求失败')
        }

        const result: ApiResponse = await response.json()
        
        if (result.code === 200 && result.data.records && result.data.records.length > 0) {
          const record = result.data.records[0]
          const contractData = record.contracts || {}
          const names = Object.keys(contractData)
          
          setContracts(contractData)
          setContractNames(names)
          setSwapDate(record.swap_date || result.data.date || '')
          
          // 默认选择第一个合约
          if (names.length > 0) {
            setSelectedContract(names[0])
          }
        } else {
          throw new Error('数据格式错误')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败')
        console.error('获取信号数据失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSignalData()
    
    // 每30秒刷新一次数据
    const interval = setInterval(fetchSignalData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const selectedData = contracts[selectedContract] || null

  // 判断是开多还是开空，以及离场类型
  // 根据API数据和图片逻辑进行解析
  const getTradeDirection = (entryRange: string, exitRange: string, operationSuggestion?: string) => {
    const entryNum = parseFloat(entryRange.replace(/[<>]/, ''))
    const exitNum = parseFloat(exitRange.replace(/[<>]/, ''))
    const isLongEntry = entryRange.startsWith('<')
    const isShortEntry = entryRange.startsWith('>')
    const isLongExit = exitRange.startsWith('>')
    const isShortExit = exitRange.startsWith('<')
    
    // 根据操作建议判断操作类型
    const operation = operationSuggestion || ''
    const isPureShort = operation === '平空/空仓' || operation === '空仓'
    const isHoldLongAndShort = operation.includes('持有多单/空仓') || operation.includes('多单/空仓')
    
    // 特殊情况：P4TC+1 的操作建议是"平空/空仓"
    // API数据：entry_range='<17500', exit_range='>21650'
    // 图片显示：开空入场区间='>21650', 平多离场区间='<17500'
    // 说明对于"平空/空仓"的情况，需要交换entry_range和exit_range
    if (isPureShort) {
      // 纯粹的平空/空仓操作：entry_range和exit_range的含义需要交换
      // entry_range实际是平多离场区间，exit_range实际是开空入场区间
      return {
        entryType: 'short',
        exitType: 'long',
        entryLabel: '开空入场区间',
        exitLabel: '平多离场区间',
        entryValue: exitRange, // 使用exit_range作为开空入场区间
        exitValue: entryRange  // 使用entry_range作为平多离场区间
      }
    }
    
    // 常规情况1: entry <xxx 且 exit >xxx -> 开多平多（C5TC+1的情况）
    // API数据：entry_range='<20850', exit_range='>32200'
    // 图片显示：开多入场区间='<20850', 平多离场区间='>32200'
    // 这是标准的开多平多模式，直接使用entry_range和exit_range
    if (isLongEntry && isLongExit) {
      return {
        entryType: 'long',
        exitType: 'long',
        entryLabel: '开多入场区间',
        exitLabel: '平多离场区间',
        entryValue: entryRange,
        exitValue: exitRange
      }
    }
    
    // 情况3: entry >xxx 且 exit <xxx -> 开空平多
    if (isShortEntry && isShortExit) {
      return {
        entryType: 'short',
        exitType: 'long',
        entryLabel: '开空入场区间',
        exitLabel: '平多离场区间',
        entryValue: entryRange,
        exitValue: exitRange
      }
    }
    
    // 情况4: entry >xxx 且 exit >xxx -> 开空平空
    if (isShortEntry && isLongExit) {
      return {
        entryType: 'short',
        exitType: 'short',
        entryLabel: '开空入场区间',
        exitLabel: '平空离场区间',
        entryValue: entryRange,
        exitValue: exitRange
      }
    }
    
    // 情况5: entry <xxx 且 exit <xxx -> 开多平空
    if (isLongEntry && isShortExit) {
      return {
        entryType: 'long',
        exitType: 'short',
        entryLabel: '开多入场区间',
        exitLabel: '平空离场区间',
        entryValue: entryRange,
        exitValue: exitRange
      }
    }
    
    // 默认情况：开多平多
    return {
      entryType: 'long',
      exitType: 'long',
      entryLabel: '开多入场区间',
      exitLabel: '平多离场区间',
      entryValue: entryRange,
      exitValue: exitRange
    }
  }

  const tradeDirection = selectedData 
    ? getTradeDirection(selectedData.entry_range, selectedData.exit_range, selectedData.operation_suggestion)
    : {
        entryType: 'long',
        exitType: 'long',
        entryLabel: '开多入场区间',
        exitLabel: '平多离场区间',
        entryValue: '',
        exitValue: ''
      }

  // 根据操作建议判断颜色
  const getActionColorClass = (suggestion: string) => {
    if (suggestion.includes('平空') || suggestion.includes('空仓')) {
      return 'action-green'
    }
    return 'action-orange'
  }

  const actionColorClass = selectedData ? getActionColorClass(selectedData.operation_suggestion) : 'action-orange'

  return (
    <div className="realtime-signal-panel">
      <SideMenu currentPage="signal" />
      
      <div className="realtime-signal-container">
        {/* 返回按钮 */}
        <button 
          className="realtime-signal-back-button"
          onClick={handleBackClick}
          type="button"
          aria-label="返回上一级"
        >
          <span className="realtime-signal-back-icon">←</span>
          <span className="realtime-signal-back-text">返回</span>
        </button>

        <div className="realtime-signal-page">
          {/* 页面标题 */}
          <p className="realtime-signal-page-title">FFA信号</p>

          {/* 合约选择区域 - 前置到顶部 */}
          {!loading && !error && contractNames.length > 0 && (
            <div className="realtime-signal-contract-selector">
              <div className="realtime-signal-contract-tags">
                {contractNames.map((name) => {
                  const contract = contracts[name]
                  return (
                    <button
                      key={name}
                      type="button"
                      className={`realtime-signal-contract-tag ${
                        selectedContract === name ? 'active' : ''
                      }`}
                      onClick={() => setSelectedContract(name)}
                    >
                      <span className="realtime-signal-contract-name">{name}</span>
                      {selectedContract === name && contract?.month && (
                        <span className="realtime-signal-contract-month">{contract.month}</span>
                      )}
                    </button>
                  )
                })}
              </div>
              {swapDate && (
                <div className="realtime-signal-date">
                  <span className="realtime-signal-date-label">掉期日期：</span>
                  <span className="realtime-signal-date-value">{swapDate}</span>
                </div>
              )}
            </div>
          )}

          {/* 主要内容区域 */}
          <div className="realtime-signal-page-content">
            {loading ? (
              <div className="realtime-signal-loading">
                <div className="realtime-signal-loading-spinner"></div>
                <p>加载中...</p>
              </div>
            ) : error ? (
              <div className="realtime-signal-error">
                <p>{error}</p>
              </div>
            ) : selectedData ? (
              <>

                {/* 预测值和当前值卡片 */}
                <div className="realtime-signal-value-cards">
                  <div className="realtime-signal-value-card">
                    <div className="realtime-signal-value-header">
                      <span className="realtime-signal-value-icon">¥</span>
                      <p className="realtime-signal-value-label">预测值</p>
                    </div>
                    <p className="realtime-signal-value-number">
                      {Number(selectedData.predicted_value).toLocaleString()}
                    </p>
                  </div>
                  <div className="realtime-signal-value-card">
                    <div className="realtime-signal-value-header">
                      <span className="realtime-signal-value-icon">▶</span>
                      <p className="realtime-signal-value-label">当前值</p>
                    </div>
                    <p className="realtime-signal-value-number">
                      {Number(selectedData.current_value).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 交易信息表格 */}
                <div className="realtime-signal-trade-info-table">
                  {/* 表头行 */}
                  <div className="realtime-signal-trade-info-table-header">
                    <div className="realtime-signal-trade-info-table-header-cell">
                      偏离度
                      <span className="realtime-signal-info-icon" title="价格偏离预测值的百分比">i</span>
                    </div>
                    <div className="realtime-signal-trade-info-table-header-cell">
                      {tradeDirection.entryLabel}
                    </div>
                    <div className="realtime-signal-trade-info-table-header-cell">
                      {tradeDirection.exitLabel}
                    </div>
                    <div className="realtime-signal-trade-info-table-header-cell">
                      操作建议
                    </div>
                  </div>
                  {/* 数据行 */}
                  <div className="realtime-signal-trade-info-table-row">
                    <div className="realtime-signal-trade-info-table-cell">
                      {selectedData.deviation}
                    </div>
                    <div className="realtime-signal-trade-info-table-cell">
                      {tradeDirection.entryValue || selectedData.entry_range}
                    </div>
                    <div className="realtime-signal-trade-info-table-cell">
                      {tradeDirection.exitValue || selectedData.exit_range}
                    </div>
                    <div className={`realtime-signal-trade-info-table-cell realtime-signal-trade-info-table-cell-action ${actionColorClass}`}>
                      {selectedData.operation_suggestion}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="realtime-signal-error">
                <p>暂无数据</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealtimeSignalPage

