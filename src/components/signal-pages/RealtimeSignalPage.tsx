import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import './RealtimeSignalPage.css'

// FFA信号数据结构
interface FFAContractData {
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

// 欧线信号数据结构
interface EuropeanLineData {
  price_signals: {
    predicted_value: string
    current_value: string
    deviation: string
  }
  trading_ranges: {
    short_entry_range: string
    short_exit_range: string
  }
  operation_suggestion: string
  closing_price_date: string
}

// 统一的数据格式
interface UnifiedContractData {
  contract_name: string
  predicted_value: string
  current_value: string
  deviation: string
  entry_range: string
  exit_range: string
  operation_suggestion: string
  month?: string
  days?: string
  date?: string // 用于欧线的收盘价日期
}

type SignalType = 'ffa' | 'european_line'

const RealtimeSignalPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [signalType, setSignalType] = useState<SignalType>('ffa')
  const [contracts, setContracts] = useState<Record<string, UnifiedContractData>>({})
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
        
        const apiUrl = signalType === 'ffa' 
          ? 'https://aqua.navgreen.cn/api/strategy/price/signal/ffa'
          : 'https://aqua.navgreen.cn/api/strategy/price/signal/european_line'
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error('网络请求失败')
        }

        const result = await response.json()
        
        if (result.code === 200 && result.data.records && result.data.records.length > 0) {
          const record = result.data.records[0]
          
          if (signalType === 'ffa') {
            // 处理FFA信号数据
            const contractData: Record<string, UnifiedContractData> = {}
            const ffaContracts = record.contracts || {}
            
            Object.keys(ffaContracts).forEach((key) => {
              const contract = ffaContracts[key] as FFAContractData
              if (contract.contract_name && contract.predicted_value) {
                contractData[key] = {
                  contract_name: contract.contract_name,
                  predicted_value: contract.predicted_value,
                  current_value: contract.current_value,
                  deviation: contract.deviation,
                  entry_range: contract.entry_range,
                  exit_range: contract.exit_range,
                  operation_suggestion: contract.operation_suggestion,
                  month: contract.month,
                  days: contract.days
                }
              }
            })
            
            const names = Object.keys(contractData).filter(name => name !== 'raw_table_data')
            setContracts(contractData)
            setContractNames(names)
            setSwapDate(record.swap_date || result.data.date || '')
            
            if (names.length > 0) {
              setSelectedContract(names[0])
            }
          } else {
            // 处理欧线信号数据
            const contractData: Record<string, UnifiedContractData> = {}
            const europeanContracts = record.contracts || {}
            
            // 查找european_line_analysis
            const europeanLineAnalysis = europeanContracts.european_line_analysis as any
            if (europeanLineAnalysis && europeanLineAnalysis.price_signals) {
              const data = europeanLineAnalysis as {
                price_signals: EuropeanLineData['price_signals']
                trading_ranges: EuropeanLineData['trading_ranges']
                operation_suggestion: string
                closing_price_date: string
              }
              
              contractData['欧线'] = {
                contract_name: '欧线',
                predicted_value: data.price_signals.predicted_value,
                current_value: data.price_signals.current_value,
                deviation: data.price_signals.deviation,
                entry_range: data.trading_ranges.short_entry_range,
                exit_range: data.trading_ranges.short_exit_range,
                operation_suggestion: data.operation_suggestion,
                date: data.closing_price_date
              }
              
              setContracts(contractData)
              setContractNames(['欧线'])
              setSwapDate(data.closing_price_date || result.data.date || '')
              setSelectedContract('欧线')
            }
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
  }, [signalType])

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
    const isPureShort = operation === '平空/空仓' || operation === '空仓' || operation === '平空'
    const isHoldLongAndShort = operation.includes('持有多单/空仓') || operation.includes('多单/空仓')
    
    // 特殊情况1：欧线信号 - 操作建议是"平空"
    // API数据：short_entry_range='>2312', short_exit_range='<1834'
    // 图片显示：开空入场区间='>2312', 平空离场区间='<1834'
    // 这是标准的开空平空模式，直接使用
    if (operation === '平空' && isShortEntry && isShortExit) {
      return {
        entryType: 'short',
        exitType: 'short',
        entryLabel: '开空入场区间',
        exitLabel: '平空离场区间',
        entryValue: entryRange,
        exitValue: exitRange
      }
    }
    
    // 特殊情况2：P4TC+1 的操作建议是"平空/空仓"
    // API数据：entry_range='<17500', exit_range='>21650'
    // 图片显示：开空入场区间='>21650', 平多离场区间='<17500'
    // 说明对于"平空/空仓"的情况，需要交换entry_range和exit_range
    if (isPureShort && isLongEntry && isLongExit) {
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
          <p className="realtime-signal-page-title">
            {signalType === 'ffa' ? 'FFA信号' : '欧线信号'}
          </p>

          {/* 信号类型选择 */}
          <div className="realtime-signal-type-selector">
            <button
              type="button"
              className={`realtime-signal-type-button ${signalType === 'ffa' ? 'active' : ''}`}
              onClick={() => setSignalType('ffa')}
            >
              FFA信号
            </button>
            <button
              type="button"
              className={`realtime-signal-type-button ${signalType === 'european_line' ? 'active' : ''}`}
              onClick={() => setSignalType('european_line')}
            >
              欧线
            </button>
          </div>

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
                  <span className="realtime-signal-date-label">
                    {signalType === 'ffa' ? '掉期日期：' : '收盘价日期：'}
                  </span>
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

