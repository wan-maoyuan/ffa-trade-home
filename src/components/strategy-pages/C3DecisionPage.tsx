import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import './P4TCDecisionPage.css'

interface TradingRecommendation {
  profit_loss_ratio: number
  recommended_direction: string
  direction_confidence: string
}

interface CurrentForecast {
  date: string
  high_expected_value: number
  price_difference_ratio: string
  price_difference_range: string
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
  distribution: {
    '0-15%': number
    '15.01-30%': number
    '30-60%': number
    '>60%': number
  }
  statistics: {
    max_positive_returns_average: number
    max_positive_returns_maximum: number
    max_positive_returns_avg_time: number
  }
  timing_distribution: {
    '0-14_days': number
    '15-28_days': number
    '29-42_days': number
  }
}

interface NegativeReturns {
  final_negative_returns_percentage: number
  final_negative_returns_average: number
  distribution: {
    '0-15%': number
    '15.01-30%': number
    '30-60%': number
    '<60%': number
  }
  statistics: {
    min_negative_returns_average: number
    min_negative_returns_minimum: number
  }
}

interface EvaluationRange {
  range: string
  historical_accuracy_rate: number
  historical_actual_value: number
  historical_fit_value: number
}

interface ModelEvaluation {
  current_price: number
  forecast_42day_price_difference: number
  forecast_42day_price: number
  price_difference_ratio: string
  evaluation_ranges: EvaluationRange[]
}

interface P4TCAnalysis {
  trading_recommendation: TradingRecommendation
  current_forecast: CurrentForecast
  positive_returns: PositiveReturns
  negative_returns: NegativeReturns
  model_evaluation: ModelEvaluation
  historical_forecasts?: Array<{
    date: string
    value: number
  }>
}

interface ApiResponse {
  code: number
  msg: string
  data: {
    date: string
    count: number
    records: Array<{
      core_data: CoreData
      swap_date: string
      raw_data?: {
        contracts?: {
          p4tc_analysis?: P4TCAnalysis
        }
      }
    }>
  }
}

const P4TCDecisionPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<P4TCAnalysis | null>(null)
  const [swapDate, setSwapDate] = useState<string>('')
  const [forecastDates, setForecastDates] = useState<Array<{ date: string; value: number }>>([])
  const [correctedStats, setCorrectedStats] = useState<{
    max_positive_returns_average: number
    max_positive_returns_maximum: number
    max_positive_returns_avg_time: number
    timing_distribution: {
      '0-14_days': number
      '15-28_days': number
      '29-42_days': number
    }
    min_negative_returns_average: number
    min_negative_returns_minimum: number
  } | null>(null)

  const handleBackClick = () => {
    navigate('/product-service/strategy')
  }

  useEffect(() => {
    const fetchDecisionData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://aqua.navgreen.cn/api/strategy/p4tc/decision')
        
        if (!response.ok) {
          throw new Error('网络请求失败')
        }

        const result: ApiResponse = await response.json()
        
        if (result.code === 200 && result.data.records && result.data.records.length > 0) {
          const record = result.data.records[0]
          const p4tcAnalysis = record.raw_data?.contracts?.p4tc_analysis
          const rawTableData = record.raw_data?.contracts?.raw_table_data?.data
          
          // 解析日期列表数据
          // 根据API数据，Row 7是日期行，Row 8是对应的数值行
          if (rawTableData && Array.isArray(rawTableData)) {
            // 查找日期行：包含5个连续日期的行
            let dateRowIndex = -1
            let valueRowIndex = -1
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length >= 5) {
                // 检查是否是日期行（5个连续的日期格式）
                const dateCount = row.filter((item: any) => 
                  typeof item === 'string' && item.match(/^\d{4}-\d{2}-\d{2}$/)
                ).length
                
                if (dateCount === 5) {
                  dateRowIndex = i
                  // 下一行应该是对应的数值行
                  if (i + 1 < rawTableData.length) {
                    const nextRow = rawTableData[i + 1]
                    if (Array.isArray(nextRow) && nextRow.length >= 5) {
                      // 检查下一行是否都是数字
                      const numCount = nextRow.filter((item: any) => {
                        if (typeof item === 'string') {
                          return !isNaN(parseFloat(item)) && isFinite(parseFloat(item))
                        }
                        return typeof item === 'number'
                      }).length
                      
                      if (numCount === 5) {
                        valueRowIndex = i + 1
                        break
                      }
                    }
                  }
                }
              }
            }
            
            if (dateRowIndex >= 0 && valueRowIndex >= 0) {
              const dateRow = rawTableData[dateRowIndex] as string[]
              const valueRow = rawTableData[valueRowIndex] as any[]
              
              // 提取日期和对应的数值
              const dates = dateRow.filter((item: any) => 
                typeof item === 'string' && item.match(/^\d{4}-\d{2}-\d{2}$/)
              )
              
              const forecastData = dates.map((date: string, idx: number) => {
                const val = valueRow[idx]
                const numValue = typeof val === 'string' ? parseFloat(val) : (typeof val === 'number' ? val : 0)
                return {
                  date,
                  value: isNaN(numValue) ? 0 : numValue
                }
              }).filter(item => item.date)
              
              setForecastDates(forecastData)
            }
            
            // 解析正收益统计数据和负收益统计数据
            // Row 15: ['收益统计']
            // Row 16: ['最大正收益平均值', '最大正收益最大值', '最大正收益出现时间平均值']
            // Row 17: ['30%', '61%', '34']
            // Row 18: ['最大正收益平均出现天数']
            // Row 19: ['0～14天内', '15～28天内', '29～42天内']
            // Row 20: ['32%', '29%', '39%']
            
            let statsRowIndex = -1
            let timingRowIndex = -1
            let negativeStatsRowIndex = -1
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                const firstItem = String(row[0] || '')
                
                // 查找"收益统计"行（正收益）
                if (firstItem.includes('收益统计') && statsRowIndex === -1 && i < 20) {
                  // 下一行应该是标题行，再下一行应该是数据行
                  if (i + 2 < rawTableData.length) {
                    const dataRow = rawTableData[i + 2]
                    if (Array.isArray(dataRow) && dataRow.length >= 3) {
                      statsRowIndex = i + 2
                    }
                  }
                }
                
                // 查找"最大正收益平均出现天数"行
                if (firstItem.includes('最大正收益平均出现天数')) {
                  // 下一行应该是标题行，再下一行应该是数据行
                  if (i + 2 < rawTableData.length) {
                    const dataRow = rawTableData[i + 2]
                    if (Array.isArray(dataRow) && dataRow.length >= 3) {
                      timingRowIndex = i + 2
                    }
                  }
                }
              }
            }
            
            // 解析正收益统计数据
            if (statsRowIndex >= 0) {
              const statsRow = rawTableData[statsRowIndex] as any[]
              if (statsRow && statsRow.length >= 3) {
                const avg = parseFloat(String(statsRow[0] || '0').replace('%', ''))
                const max = parseFloat(String(statsRow[1] || '0').replace('%', ''))
                const time = parseFloat(String(statsRow[2] || '0').replace('天', ''))
                
                // 解析时间分布数据
                let timingData = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
                if (timingRowIndex >= 0) {
                  const timingRow = rawTableData[timingRowIndex] as any[]
                  if (timingRow && timingRow.length >= 3) {
                    timingData = {
                      '0-14_days': parseFloat(String(timingRow[0] || '0').replace('%', '')),
                      '15-28_days': parseFloat(String(timingRow[1] || '0').replace('%', '')),
                      '29-42_days': parseFloat(String(timingRow[2] || '0').replace('%', ''))
                    }
                  }
                }
                
                // 查找负收益统计数据
                let negativeAvg = 0
                let negativeMin = 0
                
                // 查找负收益的收益统计部分
                // Row 27: ['收益统计']
                // Row 28: ['最小负收益平均值', '最小负收益最大值']
                // Row 29: ['-15%', '-43%']
                // 需要在正收益统计之后查找（通常在索引15之后）
                for (let i = Math.max(15, statsRowIndex + 5); i < rawTableData.length; i++) {
                  const row = rawTableData[i]
                  if (Array.isArray(row) && row.length > 0) {
                    const firstItem = String(row[0] || '')
                    
                    // 查找负收益的"收益统计"（在正收益统计之后）
                    if (firstItem.includes('收益统计') && negativeStatsRowIndex === -1) {
                      // 检查下一行是否是负收益的标题行
                      if (i + 1 < rawTableData.length) {
                        const titleRow = rawTableData[i + 1]
                        if (Array.isArray(titleRow) && titleRow.length > 0) {
                          const titleFirst = String(titleRow[0] || '')
                          // 如果标题行包含"最小负收益"，说明这是负收益的收益统计
                          if (titleFirst.includes('最小负收益')) {
                            // 再下一行应该是数据行
                            if (i + 2 < rawTableData.length) {
                              const dataRow = rawTableData[i + 2]
                              if (Array.isArray(dataRow) && dataRow.length >= 2) {
                                negativeStatsRowIndex = i + 2
                                const negRow = dataRow
                                // 处理负号，确保正确解析
                                const avgStr = String(negRow[0] || '0').replace('%', '').trim()
                                const minStr = String(negRow[1] || '0').replace('%', '').trim()
                                negativeAvg = parseFloat(avgStr) || 0
                                negativeMin = parseFloat(minStr) || 0
                                break
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                
                setCorrectedStats({
                  max_positive_returns_average: avg,
                  max_positive_returns_maximum: max,
                  max_positive_returns_avg_time: time,
                  timing_distribution: timingData,
                  min_negative_returns_average: negativeAvg,
                  min_negative_returns_minimum: negativeMin
                })
              }
            }
          }
          
          if (p4tcAnalysis) {
            // 根据图片描述，价差比应该是"2%"而不是API返回的"86%"
            // 使用model_evaluation中的price_difference_ratio
            const adjustedAnalysis = {
              ...p4tcAnalysis,
              current_forecast: {
                ...p4tcAnalysis.current_forecast,
                price_difference_ratio: p4tcAnalysis.model_evaluation?.price_difference_ratio || p4tcAnalysis.current_forecast.price_difference_ratio
              }
            }
            setAnalysis(adjustedAnalysis)
          } else if (record.core_data) {
            // 如果p4tc_analysis不存在，使用core_data构造基本数据
            const constructed: P4TCAnalysis = {
              trading_recommendation: record.core_data.trading_recommendation,
              current_forecast: record.core_data.current_forecast,
              positive_returns: {
                final_positive_returns_percentage: 0,
                final_positive_returns_average: 0,
                distribution: { '0-15%': 0, '15.01-30%': 0, '30-60%': 0, '>60%': 0 },
                statistics: { max_positive_returns_average: 0, max_positive_returns_maximum: 0, max_positive_returns_avg_time: 0 },
                timing_distribution: { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
              },
              negative_returns: {
                final_negative_returns_percentage: 0,
                final_negative_returns_average: 0,
                distribution: { '0-15%': 0, '15.01-30%': 0, '30-60%': 0, '<60%': 0 },
                statistics: { min_negative_returns_average: 0, min_negative_returns_minimum: 0 }
              },
              model_evaluation: {
                current_price: record.core_data.current_forecast.high_expected_value,
                forecast_42day_price_difference: 0,
                forecast_42day_price: record.core_data.current_forecast.forecast_value,
                price_difference_ratio: record.core_data.current_forecast.price_difference_ratio,
                evaluation_ranges: []
              }
            }
            setAnalysis(constructed)
          } else {
            throw new Error('数据格式错误')
          }
          
          setSwapDate(record.swap_date || result.data.date || '')
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
    <div className="p4tc-decision-panel">
      <SideMenu currentPage="strategy" />
      
      <div className="p4tc-decision-container">
        {/* 返回按钮 */}
        <button 
          className="p4tc-decision-back-button"
          onClick={handleBackClick}
          type="button"
          aria-label="返回上一级"
        >
          <span className="p4tc-decision-back-icon">←</span>
          <span className="p4tc-decision-back-text">返回</span>
        </button>

        <div className="p4tc-decision-page">
          {/* 页面标题 */}
          <p className="p4tc-decision-page-title">P4TC现货应用决策</p>

          {loading ? (
            <div className="p4tc-decision-loading">
              <div className="p4tc-decision-loading-spinner"></div>
              <p>加载中...</p>
            </div>
          ) : error ? (
            <div className="p4tc-decision-error">
              <p>{error}</p>
            </div>
          ) : analysis ? (
            <>
              {/* 做多胜率统计 */}
              <div className="p4tc-decision-header">
                <div className="p4tc-decision-chips">
                  <button type="button" className="p4tc-decision-chip">做多胜率统计</button>
                  <button type="button" className="p4tc-decision-chip">
                    盈亏比：{analysis.trading_recommendation.profit_loss_ratio.toFixed(2)}：1
                  </button>
                </div>
              </div>

              {/* 主要内容区域 */}
              <div className="p4tc-decision-content">
                {/* 左侧策略卡片和右侧指标网格 */}
                <div className="p4tc-decision-cards-container">
                  {/* 左侧策略卡片 */}
                  <div className="p4tc-decision-card-left">
                    <span className="p4tc-decision-card-badge">多头策略</span>
                    <div className="p4tc-decision-card-glow" />
                    <div className="p4tc-decision-card-overlay">
                      <div className="p4tc-decision-card-title">
                        {analysis.trading_recommendation.recommended_direction}
                      </div>
                      <div className="p4tc-decision-card-desc">建议交易方向</div>
                    </div>
                  </div>

                  {/* 右侧指标网格 */}
                  <div className="p4tc-decision-metrics-grid">
                    <div className="p4tc-decision-metric-card">
                      <p className="p4tc-decision-metric-label">日期</p>
                      <p className="p4tc-decision-metric-value">{analysis.current_forecast.date}</p>
                    </div>
                    <div className="p4tc-decision-metric-card">
                      <p className="p4tc-decision-metric-label">当前值</p>
                      <p className="p4tc-decision-metric-value">
                        {analysis.model_evaluation.current_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="p4tc-decision-metric-card">
                      <p className="p4tc-decision-metric-label">价差比</p>
                      <p className="p4tc-decision-metric-value">{analysis.model_evaluation.price_difference_ratio}</p>
                    </div>
                    <div className="p4tc-decision-metric-card">
                      <p className="p4tc-decision-metric-label">价差比区间</p>
                      <p className="p4tc-decision-metric-value">{analysis.current_forecast.price_difference_range}</p>
                    </div>
                    <div className="p4tc-decision-metric-card">
                      <p className="p4tc-decision-metric-label">2026-01-06预测值</p>
                      <p className="p4tc-decision-metric-value">
                        {analysis.model_evaluation.forecast_42day_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="p4tc-decision-metric-card">
                      <p className="p4tc-decision-metric-label">在全部交易日期中出现概率</p>
                      <p className="p4tc-decision-metric-value">{analysis.current_forecast.probability}%</p>
                    </div>
                  </div>
                </div>

                {/* 日期列表 - 表格格式 */}
                {forecastDates.length > 0 && (
                  <div className="p4tc-decision-dates-table-container">
                    <table className="p4tc-decision-dates-table">
                      <thead>
                        <tr>
                          {forecastDates.map((item, index) => (
                            <th key={index} className="p4tc-decision-dates-table-header">
                              {item.date}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {forecastDates.map((item, index) => (
                            <td key={index} className="p4tc-decision-dates-table-cell">
                              {item.value.toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 正收益和负收益部分 */}
                <div className="p4tc-decision-returns-section">
                  <div className="p4tc-decision-returns-column positive">
                    <h3 className="p4tc-decision-returns-column-title">正收益</h3>
                    <div className="p4tc-decision-returns-header">
                      <div className="p4tc-decision-returns-bar positive-bar">
                        <span className="p4tc-decision-returns-value">{analysis.positive_returns.final_positive_returns_percentage}%</span>
                        <span className="p4tc-decision-returns-label">最终正收益占比</span>
                      </div>
                      <div className="p4tc-decision-returns-bar average-bar">
                        <span className="p4tc-decision-returns-value">{analysis.positive_returns.final_positive_returns_average}%</span>
                        <span className="p4tc-decision-returns-label">最终正收益平均值</span>
                      </div>
                    </div>

                    <div className="p4tc-decision-returns-card">
                      <p className="p4tc-decision-returns-card-title">分布情况</p>
                      <div className="p4tc-decision-returns-table">
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">正收益比例0~15%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.positive_returns.distribution['0-15%']}%</span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">正收益比例15.01~30%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.positive_returns.distribution['15.01-30%']}%</span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">正收益比例30~60%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.positive_returns.distribution['30-60%']}%</span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">正收益比例大于60%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.positive_returns.distribution['>60%']}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p4tc-decision-returns-card">
                      <p className="p4tc-decision-returns-card-title">收益统计</p>
                      <div className="p4tc-decision-returns-table">
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">最大正收益平均值</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.max_positive_returns_average || analysis.positive_returns.statistics.max_positive_returns_average}%
                          </span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">最大正收益最大值</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.max_positive_returns_maximum || analysis.positive_returns.statistics.max_positive_returns_maximum}%
                          </span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">最大正收益出现时间平均值</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.max_positive_returns_avg_time || analysis.positive_returns.statistics.max_positive_returns_avg_time}天
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p4tc-decision-returns-card">
                      <p className="p4tc-decision-returns-card-title">最大正收益平均出现天数</p>
                      <div className="p4tc-decision-returns-table">
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">0~14天内</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.timing_distribution['0-14_days'] || analysis.positive_returns.timing_distribution['0-14_days']}%
                          </span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">15~28天内</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.timing_distribution['15-28_days'] || analysis.positive_returns.timing_distribution['15-28_days']}%
                          </span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">29~42天内</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.timing_distribution['29-42_days'] || analysis.positive_returns.timing_distribution['29-42_days']}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 负收益部分 */}
                  <div className="p4tc-decision-returns-column negative">
                    <h3 className="p4tc-decision-returns-column-title">负收益</h3>
                    <div className="p4tc-decision-returns-header">
                      <div className="p4tc-decision-returns-bar negative-bar">
                        <span className="p4tc-decision-returns-value">{analysis.negative_returns.final_negative_returns_percentage}%</span>
                        <span className="p4tc-decision-returns-label">最终负收益比例</span>
                      </div>
                      <div className="p4tc-decision-returns-bar average-bar">
                        <span className="p4tc-decision-returns-value">{analysis.negative_returns.final_negative_returns_average}%</span>
                        <span className="p4tc-decision-returns-label">最终负收益平均值</span>
                      </div>
                    </div>

                    <div className="p4tc-decision-returns-card">
                      <p className="p4tc-decision-returns-card-title">分布情况</p>
                      <div className="p4tc-decision-returns-table">
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">负收益比例0~15%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.negative_returns.distribution['0-15%']}%</span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">负收益比例15.01~30%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.negative_returns.distribution['15.01-30%']}%</span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">负收益比例30~60%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.negative_returns.distribution['30-60%']}%</span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">负收益比例小于60%</span>
                          <span className="p4tc-decision-returns-table-value">{analysis.negative_returns.distribution['<60%']}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p4tc-decision-returns-card">
                      <p className="p4tc-decision-returns-card-title">收益统计</p>
                      <div className="p4tc-decision-returns-table">
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">最小负收益平均值</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.min_negative_returns_average || analysis.negative_returns.statistics.min_negative_returns_average}%
                          </span>
                        </div>
                        <div className="p4tc-decision-returns-table-row">
                          <span className="p4tc-decision-returns-table-label">最小负收益最小值</span>
                          <span className="p4tc-decision-returns-table-value">
                            {correctedStats?.min_negative_returns_minimum || analysis.negative_returns.statistics.min_negative_returns_minimum}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* P4TC六周后预测模型评价 */}
                <div className="p4tc-decision-model-section">
                  <p className="p4tc-decision-model-title">P4TC六周后预测模型评价</p>
                  <div className="p4tc-decision-model-summary">
                    <div className="p4tc-decision-model-summary-card">
                      <p className="p4tc-decision-model-summary-label">日期</p>
                      <p className="p4tc-decision-model-summary-value">{analysis.current_forecast.date}</p>
                    </div>
                    <div className="p4tc-decision-model-summary-card">
                      <p className="p4tc-decision-model-summary-label">当前价格/元每吨</p>
                      <p className="p4tc-decision-model-summary-value">{analysis.model_evaluation.current_price.toLocaleString()}</p>
                    </div>
                    <div className="p4tc-decision-model-summary-card">
                      <p className="p4tc-decision-model-summary-label">预测42天价差/元每吨</p>
                      <p className="p4tc-decision-model-summary-value">{analysis.model_evaluation.forecast_42day_price_difference.toLocaleString()}</p>
                    </div>
                    <div className="p4tc-decision-model-summary-card">
                      <p className="p4tc-decision-model-summary-label">预测42天价格/元每吨</p>
                      <p className="p4tc-decision-model-summary-value">{analysis.model_evaluation.forecast_42day_price.toLocaleString()}</p>
                    </div>
                    <div className="p4tc-decision-model-summary-card">
                      <p className="p4tc-decision-model-summary-label">价差比</p>
                      <p className="p4tc-decision-model-summary-value">{analysis.model_evaluation.price_difference_ratio}</p>
                    </div>
                  </div>

                  {/* 评价表格 */}
                  <div className="p4tc-decision-model-table">
                    <div className="p4tc-decision-model-table-header">
                      <div className="p4tc-decision-model-table-header-cell">区间</div>
                      <div className="p4tc-decision-model-table-header-cell">历史判断正确率</div>
                      <div className="p4tc-decision-model-table-header-cell">历史预测实际值/元每吨</div>
                      <div className="p4tc-decision-model-table-header-cell">历史预测拟合值/元每吨</div>
                    </div>
                    {analysis.model_evaluation.evaluation_ranges.map((range, index) => (
                      <div key={index} className="p4tc-decision-model-table-row">
                        <div className="p4tc-decision-model-table-cell">{range.range}</div>
                        <div className="p4tc-decision-model-table-cell">{range.historical_accuracy_rate.toFixed(2)}%</div>
                        <div className="p4tc-decision-model-table-cell">{range.historical_actual_value.toLocaleString()}</div>
                        <div className="p4tc-decision-model-table-cell">{range.historical_fit_value.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p4tc-decision-error">
              <p>暂无数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default P4TCDecisionPage

