import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import './P6_14dDecisionPage.css'

interface TradingRecommendation {
  profit_loss_ratio: number
  recommended_direction: string
  direction_confidence: string
}

interface CurrentForecast {
  date: string
  current_value: number
  overall_price_difference_ratio: string
  gear_interval: string
  forecast_date: string
  forecast_value: number
  probability: number
}

interface CoreData {
  trading_recommendation: TradingRecommendation
  current_forecast: CurrentForecast
  statistics: {
    total_rows: number
    data_quality: string
  }
}

interface PositiveReturns {
  final_positive_returns_percentage: number
  final_positive_returns_average: number
}

interface NegativeReturns {
  final_negative_returns_percentage: number
  final_negative_returns_average: number
}

interface P6CurrentEvaluation {
  date: string
  current_price: number
  evaluated_price: number
  price_difference_ratio: string
}

interface EvaluationRange {
  range: string
  historical_accuracy_rate: number
  historical_actual_value: number
  historical_fit_value: number
}

interface ModelEvaluation {
  date: string
  current_price: number
  forecast_14day_price_difference: number
  forecast_14day_price: number
  price_difference_ratio: string
  evaluation_ranges: EvaluationRange[]
}

interface P6_14dAnalysis {
  trading_recommendation: TradingRecommendation
  current_forecast: CurrentForecast
  positive_returns: PositiveReturns
  negative_returns: NegativeReturns
  p6_current_evaluation: P6CurrentEvaluation
  model_evaluation: ModelEvaluation
}

interface ApiResponse {
  code: number
  msg: string
  data: {
    date: string
    count: number
    records: Array<{
      _id?: string
      metadata?: {
        swap_date?: string
      }
      contracts?: {
        raw_table_data?: {
          data?: any[][]
        }
      }
      core_data?: CoreData
      swap_date?: string
      raw_data?: {
        contracts?: {
          p6_14d_analysis?: P6_14dAnalysis
        }
      }
    }>
  }
}

const P6_14dDecisionPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<P6_14dAnalysis | null>(null)
  const [swapDate, setSwapDate] = useState<string>('')

  const handleBackClick = () => {
    navigate('/product-service/strategy')
  }

  useEffect(() => {
    const fetchDecisionData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://aqua.navgreen.cn/api/strategy/p6_14d/decision')
        
        if (!response.ok) {
          throw new Error('网络请求失败')
        }

        const result: ApiResponse = await response.json()
        
        if (result.code === 200 && result.data.records && result.data.records.length > 0) {
          const record = result.data.records[0]
          const rawTableData = record.contracts?.raw_table_data?.data || record.raw_data?.contracts?.raw_table_data?.data
          const p6_14dAnalysis = record.raw_data?.contracts?.p6_14d_analysis
          
          // 根据P6_14d的实际数据结构解析数据
          let parsedData: P6_14dAnalysis | null = null
          
          if (rawTableData && Array.isArray(rawTableData)) {
            // 解析基础信息
            // Row 1: ["做多胜率统计","盈亏比：","4.47：1"]
            // Row 2: ["做多","2025-11-26","16413","5%"]
            // Row 3: ["日期","当期值","综合价差比"]
            // Row 4: ["建议交易方向","-1077 ~ -344","17307","11%"]
            // Row 5: ["档位区间","2025-12-10预测值","在全部交易日期中出现概率"]
            
            let profitLossRatio = 4.47
            let recommendedDirection = '做多'
            let date = ''
            let currentValue = 0
            let overallPriceDiffRatio = ''
            let gearInterval = ''
            let forecastDate = ''
            let forecastValue = 0
            let probability = 0
            
            // 解析盈亏比
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                const rowStr = row.join('')
                if (rowStr.includes('盈亏比') && rowStr.includes('：')) {
                  const ratioMatch = rowStr.match(/(\d+\.?\d*)：1/)
                  if (ratioMatch) {
                    profitLossRatio = parseFloat(ratioMatch[1])
                  }
                }
                // 解析做多和日期、当期值、价差比
                if (row[0] === '做多' && row.length >= 4) {
                  recommendedDirection = '做多'
                  date = String(row[1] || '')
                  currentValue = parseFloat(String(row[2] || '0').replace(/,/g, '')) || 0
                  overallPriceDiffRatio = String(row[3] || '')
                }
                // 解析建议交易方向行（Row 4）
                // Row 4: ["建议交易方向","171 ~ 1758","17006","13%"]
                if (row[0] === '建议交易方向' && row.length >= 4) {
                  gearInterval = String(row[1] || '')
                  forecastValue = parseFloat(String(row[2] || '0').replace(/,/g, '')) || 0
                  probability = parseFloat(String(row[3] || '0').replace('%', '')) || 0
                }
                // 解析档位区间行（Row 5）获取预测日期
                // Row 5: ["档位区间","2025-12-09预测值","在全部交易日期中出现概率"]
                if (row[0] === '档位区间' && row.length >= 2) {
                  const forecastDateMatch = String(row[1] || '').match(/(\d{4}-\d{2}-\d{2})/)
                  if (forecastDateMatch) {
                    forecastDate = forecastDateMatch[1]
                  }
                }
              }
            }
            
            // 解析正收益数据
            // Row 6: ["正收益"]
            // Row 7: ["74%","894"]
            // Row 8: ["最终正收益占比","最终正收益平均值"]
            let finalPositiveReturnsPercentage = 0
            let finalPositiveReturnsAverage = 0
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                // 查找"正收益"行
                if (row[0] === '正收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalPositiveReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalPositiveReturnsAverage = parseFloat(String(nextRow[1] || '0').replace(/,/g, '')) || 0
                  }
                }
              }
            }
            
            // 解析负收益数据
            // Row 9: ["负收益"]
            // Row 10: ["26%","-559"]
            // Row 11: ["最终负收益比例","最终负收益平均值"]
            let finalNegativeReturnsPercentage = 0
            let finalNegativeReturnsAverage = 0
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                // 查找"负收益"行
                if (row[0] === '负收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalNegativeReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalNegativeReturnsAverage = parseFloat(String(nextRow[1] || '0').replace(/,/g, '')) || 0
                  }
                }
              }
            }
            
            // 解析P6当前评估价格数据
            // Row 13: ["P6当前评估价格"]
            // Row 14: ["2025-11-26","16413","17307","5%"]
            // Row 15: ["日期","当前价格/元每吨","评估价格/元每吨","价差比"]
            let p6CurrentEvalData: P6CurrentEvaluation | null = null
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0 && row[0] === 'P6当前评估价格') {
                if (i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 4) {
                    p6CurrentEvalData = {
                      date: String(dataRow[0] || ''),
                      current_price: parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0,
                      evaluated_price: parseFloat(String(dataRow[2] || '0').replace(/,/g, '')) || 0,
                      price_difference_ratio: String(dataRow[3] || '')
                    }
                    break
                  }
                }
              }
            }
            
            // 解析P5TC二周后预测模型评价数据
            // Row 16: ["P5TC二周后预测模型评价"]
            // Row 17: ["2025-11-14","16903","2025-12-26","369","17271","2%"]
            // Row 18: ["日期","当前价格/元每吨","预测14天后价差/元每吨","预测14天后价格/元每吨","价差比"]
            // Row 19: ["区间","历史判断正确率","历史预测实际值/元每吨","历史预测拟合值/元每吨"]
            // Row 20-25: 表格数据行
            let modelEvalDate = date || result.data.date
            let modelEvalCurrentPrice = currentValue
            let modelEvalForecastDiff = 0
            let modelEvalForecastPrice = forecastValue
            let modelEvalPriceDiffRatio = overallPriceDiffRatio
            let evaluationRanges: EvaluationRange[] = []
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                // 查找"P5TC二周后预测模型评价"
                if (row[0] === 'P5TC二周后预测模型评价' && i + 1 < rawTableData.length) {
                  // Row 17: 数据行
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 6) {
                    modelEvalDate = String(dataRow[0] || '')
                    modelEvalCurrentPrice = parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastDiff = parseFloat(String(dataRow[3] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastPrice = parseFloat(String(dataRow[4] || '0').replace(/,/g, '')) || 0
                    modelEvalPriceDiffRatio = String(dataRow[5] || '')
                  }
                  // 查找评价表格数据（从Row 20开始，跳过Row 18和Row 19标题行）
                  for (let j = i + 4; j < rawTableData.length; j++) {
                    const evalRow = rawTableData[j]
                    if (Array.isArray(evalRow) && evalRow.length >= 4) {
                      const firstCol = String(evalRow[0] || '')
                      const secondCol = String(evalRow[1] || '')
                      
                      // 检查是否是表格数据行
                      const hasIntervalSymbol = firstCol.includes('<') || firstCol.includes('>') || firstCol.includes('=')
                      const isNumber = firstCol.match(/^-?\d+$/) || firstCol.match(/^-?\d+\.\d+$/)
                      const secondIsPercent = secondCol.includes('%')
                      const thirdIsPercent = evalRow.length >= 3 && String(evalRow[2] || '').includes('%')
                      
                      const isDataRow = (hasIntervalSymbol || isNumber) && (secondIsPercent || thirdIsPercent)
                      
                      if (isDataRow) {
                        let rangeStr = firstCol
                        let accuracyRate = 0
                        let actualValue = 0
                        let fitValue = 0
                        
                        // 如果是两列区间格式（5列，第二列是数字，第三列是百分比）
                        if (evalRow.length >= 5 && !secondIsPercent && thirdIsPercent &&
                            (secondCol.match(/^-?\d+$/) || secondCol.match(/^-?\d+\.\d+$/))) {
                          rangeStr = `${firstCol} ~ ${secondCol}`
                          accuracyRate = parseFloat(String(evalRow[2] || '0').replace('%', '')) || 0
                          actualValue = parseFloat(String(evalRow[3] || '0').replace(/,/g, '')) || 0
                          fitValue = parseFloat(String(evalRow[4] || '0').replace(/,/g, '')) || 0
                        } else if (secondIsPercent) {
                          // 单列区间格式（4列，第二列是百分比）
                          accuracyRate = parseFloat(secondCol.replace('%', '')) || 0
                          actualValue = parseFloat(String(evalRow[2] || '0').replace(/,/g, '')) || 0
                          fitValue = parseFloat(String(evalRow[3] || '0').replace(/,/g, '')) || 0
                        }
                        
                        // 只有当所有值都解析成功时才添加
                        if (rangeStr && accuracyRate !== 0) {
                          evaluationRanges.push({
                            range: rangeStr,
                            historical_accuracy_rate: accuracyRate,
                            historical_actual_value: actualValue,
                            historical_fit_value: fitValue
                          })
                        }
                      }
                    }
                  }
                  break
                }
              }
            }
            
            // 构造解析后的数据
            parsedData = {
              trading_recommendation: {
                profit_loss_ratio: profitLossRatio,
                recommended_direction: recommendedDirection,
                direction_confidence: ''
              },
              current_forecast: {
                date: date || result.data.date,
                current_value: currentValue,
                overall_price_difference_ratio: overallPriceDiffRatio,
                gear_interval: gearInterval,
                forecast_date: forecastDate,
                forecast_value: forecastValue,
                probability: probability
              },
              positive_returns: {
                final_positive_returns_percentage: finalPositiveReturnsPercentage,
                final_positive_returns_average: finalPositiveReturnsAverage
              },
              negative_returns: {
                final_negative_returns_percentage: finalNegativeReturnsPercentage,
                final_negative_returns_average: finalNegativeReturnsAverage
              },
              p6_current_evaluation: p6CurrentEvalData || {
                date: date || result.data.date,
                current_price: currentValue,
                evaluated_price: 0,
                price_difference_ratio: overallPriceDiffRatio
              },
              model_evaluation: {
                date: modelEvalDate,
                current_price: modelEvalCurrentPrice,
                forecast_14day_price_difference: modelEvalForecastDiff,
                forecast_14day_price: modelEvalForecastPrice,
                price_difference_ratio: modelEvalPriceDiffRatio,
                evaluation_ranges: evaluationRanges
              }
            }
          }
          
          if (p6_14dAnalysis) {
            setAnalysis(p6_14dAnalysis)
          } else if (parsedData) {
            setAnalysis(parsedData)
          } else if (record.core_data) {
            // 如果p6_14d_analysis不存在，使用core_data构造基本数据
            const constructed: P6_14dAnalysis = {
              trading_recommendation: record.core_data.trading_recommendation,
              current_forecast: {
                date: record.core_data.current_forecast.date,
                current_value: record.core_data.current_forecast.high_expected_value || 0,
                overall_price_difference_ratio: record.core_data.current_forecast.price_difference_ratio || '',
                gear_interval: record.core_data.current_forecast.price_difference_range || '',
                forecast_date: '',
                forecast_value: record.core_data.current_forecast.forecast_value || 0,
                probability: record.core_data.current_forecast.probability || 0
              },
              positive_returns: {
                final_positive_returns_percentage: 0,
                final_positive_returns_average: 0
              },
              negative_returns: {
                final_negative_returns_percentage: 0,
                final_negative_returns_average: 0
              },
              p6_current_evaluation: {
                date: record.core_data.current_forecast.date,
                current_price: record.core_data.current_forecast.high_expected_value || 0,
                evaluated_price: 0,
                price_difference_ratio: record.core_data.current_forecast.price_difference_ratio || ''
              },
              model_evaluation: {
                date: record.core_data.current_forecast.date,
                current_price: record.core_data.current_forecast.high_expected_value || 0,
                forecast_14day_price_difference: 0,
                forecast_14day_price: record.core_data.current_forecast.forecast_value || 0,
                price_difference_ratio: record.core_data.current_forecast.price_difference_ratio || '',
                evaluation_ranges: []
              }
            }
            setAnalysis(constructed)
          } else {
            throw new Error('数据格式错误')
          }
          
          setSwapDate(record.metadata?.swap_date || record.swap_date || result.data.date || '')
        } else {
          throw new Error('数据格式错误')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败')
        console.error('获取决策数据失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDecisionData()
    
    // 每30秒刷新一次数据
    const interval = setInterval(fetchDecisionData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p6-14d-decision-panel">
      <SideMenu currentPage="strategy" />
      
      <div className="p6-14d-decision-container">
        {/* 返回按钮 */}
        <button 
          className="p6-14d-decision-back-button"
          onClick={handleBackClick}
          type="button"
          aria-label="返回上一级"
        >
          <span className="p6-14d-decision-back-icon">←</span>
          <span className="p6-14d-decision-back-text">返回</span>
        </button>

        <div className="p6-14d-decision-page">
          {/* 页面标题 */}
          <p className="p6-14d-decision-page-title">P6现货应用决策（14天后）</p>

          {loading ? (
            <div className="p6-14d-decision-loading">
              <div className="p6-14d-decision-loading-spinner"></div>
              <p>加载中...</p>
            </div>
          ) : error ? (
            <div className="p6-14d-decision-error">
              <p>{error}</p>
            </div>
          ) : analysis ? (
            <>
              {/* 做多胜率统计 */}
              <div className="p6-14d-decision-header">
                <div className="p6-14d-decision-chips">
                  <button type="button" className="p6-14d-decision-chip">做多胜率统计</button>
                  <button type="button" className="p6-14d-decision-chip">
                    盈亏比：{analysis.trading_recommendation.profit_loss_ratio.toFixed(2)}：1
                  </button>
                </div>
              </div>

              {/* 主要内容区域 */}
              <div className="p6-14d-decision-content">
                {/* 左侧策略卡片和右侧指标网格 */}
                <div className="p6-14d-decision-cards-container">
                  {/* 左侧策略卡片 */}
                  <div className="p6-14d-decision-card-left">
                    <span className="p6-14d-decision-card-badge">多头策略</span>
                    <div className="p6-14d-decision-card-glow" />
                    <div className="p6-14d-decision-card-overlay">
                      <div className="p6-14d-decision-card-title">
                        {analysis.trading_recommendation.recommended_direction}
                      </div>
                      <div className="p6-14d-decision-card-desc">建议交易方向</div>
                    </div>
                  </div>

                  {/* 右侧指标网格 */}
                  <div className="p6-14d-decision-metrics-grid">
                    <div className="p6-14d-decision-metric-card">
                      <p className="p6-14d-decision-metric-label">日期</p>
                      <p className="p6-14d-decision-metric-value">{analysis.current_forecast.date}</p>
                    </div>
                    <div className="p6-14d-decision-metric-card">
                      <p className="p6-14d-decision-metric-label">当期值</p>
                      <p className="p6-14d-decision-metric-value">
                        {analysis.current_forecast.current_value.toLocaleString()}
                      </p>
                    </div>
                    <div className="p6-14d-decision-metric-card">
                      <p className="p6-14d-decision-metric-label">综合价差比</p>
                      <p className="p6-14d-decision-metric-value">{analysis.current_forecast.overall_price_difference_ratio}</p>
                    </div>
                    <div className="p6-14d-decision-metric-card">
                      <p className="p6-14d-decision-metric-label">档位区间</p>
                      <p className="p6-14d-decision-metric-value">{analysis.current_forecast.gear_interval}</p>
                    </div>
                    <div className="p6-14d-decision-metric-card">
                      <p className="p6-14d-decision-metric-label">
                        {analysis.current_forecast.forecast_date ? `${analysis.current_forecast.forecast_date}预测值` : '预测值'}
                      </p>
                      <p className="p6-14d-decision-metric-value">
                        {analysis.current_forecast.forecast_value.toLocaleString()}
                      </p>
                    </div>
                    <div className="p6-14d-decision-metric-card">
                      <p className="p6-14d-decision-metric-label">在全部交易日期中出现概率</p>
                      <p className="p6-14d-decision-metric-value">{analysis.current_forecast.probability}%</p>
                    </div>
                  </div>
                </div>

                {/* 正收益和负收益部分 */}
                <div className="p6-14d-decision-returns-section">
                  <div className="p6-14d-decision-returns-column positive">
                    <h3 className="p6-14d-decision-returns-column-title">正收益</h3>
                    <div className="p6-14d-decision-returns-header">
                      <div className="p6-14d-decision-returns-bar positive-bar">
                        <span className="p6-14d-decision-returns-value">{analysis.positive_returns.final_positive_returns_percentage}%</span>
                        <span className="p6-14d-decision-returns-label">最终正收益占比</span>
                      </div>
                      <div className="p6-14d-decision-returns-bar average-bar">
                        <span className="p6-14d-decision-returns-value">{analysis.positive_returns.final_positive_returns_average.toLocaleString()}</span>
                        <span className="p6-14d-decision-returns-label">最终正收益平均值</span>
                      </div>
                    </div>
                  </div>

                  {/* 负收益部分 */}
                  <div className="p6-14d-decision-returns-column negative">
                    <h3 className="p6-14d-decision-returns-column-title">负收益</h3>
                    <div className="p6-14d-decision-returns-header">
                      <div className="p6-14d-decision-returns-bar negative-bar">
                        <span className="p6-14d-decision-returns-value">{analysis.negative_returns.final_negative_returns_percentage}%</span>
                        <span className="p6-14d-decision-returns-label">最终负收益比例</span>
                      </div>
                      <div className="p6-14d-decision-returns-bar average-bar">
                        <span className="p6-14d-decision-returns-value">{analysis.negative_returns.final_negative_returns_average.toLocaleString()}</span>
                        <span className="p6-14d-decision-returns-label">最终负收益平均值</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* P6当前评估价格部分 */}
                {analysis.p6_current_evaluation && (
                  <div className="p6-14d-decision-evaluation-section">
                    <p className="p6-14d-decision-evaluation-title">P6当前评估价格</p>
                    <div className="p6-14d-decision-evaluation-summary">
                      <div className="p6-14d-decision-evaluation-card">
                        <p className="p6-14d-decision-evaluation-label">日期</p>
                        <p className="p6-14d-decision-evaluation-value">{analysis.p6_current_evaluation.date}</p>
                      </div>
                      <div className="p6-14d-decision-evaluation-card">
                        <p className="p6-14d-decision-evaluation-label">当前价格/元每吨</p>
                        <p className="p6-14d-decision-evaluation-value">{analysis.p6_current_evaluation.current_price.toLocaleString()}</p>
                      </div>
                      <div className="p6-14d-decision-evaluation-card">
                        <p className="p6-14d-decision-evaluation-label">评估价格/元每吨</p>
                        <p className="p6-14d-decision-evaluation-value">{analysis.p6_current_evaluation.evaluated_price.toLocaleString()}</p>
                      </div>
                      <div className="p6-14d-decision-evaluation-card">
                        <p className="p6-14d-decision-evaluation-label">价差比</p>
                        <p className="p6-14d-decision-evaluation-value">{analysis.p6_current_evaluation.price_difference_ratio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* P5TC二周后预测模型评价 */}
                <div className="p6-14d-decision-model-section">
                  <p className="p6-14d-decision-model-title">P5TC二周后预测模型评价</p>
                  <div className="p6-14d-decision-model-summary">
                    <div className="p6-14d-decision-model-summary-card">
                      <p className="p6-14d-decision-model-summary-label">日期</p>
                      <p className="p6-14d-decision-model-summary-value">{analysis.model_evaluation.date}</p>
                    </div>
                    <div className="p6-14d-decision-model-summary-card">
                      <p className="p6-14d-decision-model-summary-label">当前价格/元每吨</p>
                      <p className="p6-14d-decision-model-summary-value">{analysis.model_evaluation.current_price.toLocaleString()}</p>
                    </div>
                    <div className="p6-14d-decision-model-summary-card">
                      <p className="p6-14d-decision-model-summary-label">预测14天后价差/元每吨</p>
                      <p className="p6-14d-decision-model-summary-value">{analysis.model_evaluation.forecast_14day_price_difference.toLocaleString()}</p>
                    </div>
                    <div className="p6-14d-decision-model-summary-card">
                      <p className="p6-14d-decision-model-summary-label">预测14天后价格/元每吨</p>
                      <p className="p6-14d-decision-model-summary-value">{analysis.model_evaluation.forecast_14day_price.toLocaleString()}</p>
                    </div>
                    <div className="p6-14d-decision-model-summary-card">
                      <p className="p6-14d-decision-model-summary-label">价差比</p>
                      <p className="p6-14d-decision-model-summary-value">{analysis.model_evaluation.price_difference_ratio}</p>
                    </div>
                  </div>

                  {/* 评价表格 */}
                  <div className="p6-14d-decision-model-table">
                    <div className="p6-14d-decision-model-table-header">
                      <div className="p6-14d-decision-model-table-header-cell">区间</div>
                      <div className="p6-14d-decision-model-table-header-cell">历史判断正确率</div>
                      <div className="p6-14d-decision-model-table-header-cell">历史预测实际值/元每吨</div>
                      <div className="p6-14d-decision-model-table-header-cell">历史预测拟合值/元每吨</div>
                    </div>
                    {analysis.model_evaluation.evaluation_ranges.map((range, index) => (
                      <div key={index} className="p6-14d-decision-model-table-row">
                        <div className="p6-14d-decision-model-table-cell">{range.range}</div>
                        <div className="p6-14d-decision-model-table-cell">{range.historical_accuracy_rate.toFixed(2)}%</div>
                        <div className="p6-14d-decision-model-table-cell">{range.historical_actual_value.toLocaleString()}</div>
                        <div className="p6-14d-decision-model-table-cell">{range.historical_fit_value.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p6-14d-decision-error">
              <p>暂无数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default P6_14dDecisionPage

