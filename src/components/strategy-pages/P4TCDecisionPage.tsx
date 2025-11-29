import { useState, useEffect } from 'react'
import './StrategyPageOptimization.css'

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
          raw_table_data?: {
            data?: any[][]
          }
        }
      }
    }>
  }
}

const P4TCDecisionPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<P4TCAnalysis | null>(null)
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
          if (rawTableData && Array.isArray(rawTableData)) {
            let dateRowIndex = -1
            let valueRowIndex = -1

            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length >= 5) {
                const dateCount = row.filter((item: any) =>
                  typeof item === 'string' && item.match(/^\d{4}-\d{2}-\d{2}$/)
                ).length

                if (dateCount === 5) {
                  dateRowIndex = i
                  if (i + 1 < rawTableData.length) {
                    const nextRow = rawTableData[i + 1]
                    if (Array.isArray(nextRow) && nextRow.length >= 5) {
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

            let statsRowIndex = -1
            let timingRowIndex = -1
            let negativeStatsRowIndex = -1

            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                const firstItem = String(row[0] || '')

                if (firstItem.includes('收益统计') && statsRowIndex === -1 && i < 20) {
                  if (i + 2 < rawTableData.length) {
                    const dataRow = rawTableData[i + 2]
                    if (Array.isArray(dataRow) && dataRow.length >= 3) {
                      statsRowIndex = i + 2
                    }
                  }
                }

                if (firstItem.includes('最大正收益平均出现天数')) {
                  if (i + 2 < rawTableData.length) {
                    const dataRow = rawTableData[i + 2]
                    if (Array.isArray(dataRow) && dataRow.length >= 3) {
                      timingRowIndex = i + 2
                    }
                  }
                }
              }
            }

            if (statsRowIndex >= 0) {
              const statsRow = rawTableData[statsRowIndex] as any[]
              if (statsRow && statsRow.length >= 3) {
                const avg = parseFloat(String(statsRow[0] || '0').replace('%', ''))
                const max = parseFloat(String(statsRow[1] || '0').replace('%', ''))
                const time = parseFloat(String(statsRow[2] || '0').replace('天', ''))

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

                let negativeAvg = 0
                let negativeMin = 0

                for (let i = Math.max(15, statsRowIndex + 5); i < rawTableData.length; i++) {
                  const row = rawTableData[i]
                  if (Array.isArray(row) && row.length > 0) {
                    const firstItem = String(row[0] || '')

                    if (firstItem.includes('收益统计') && negativeStatsRowIndex === -1) {
                      if (i + 1 < rawTableData.length) {
                        const titleRow = rawTableData[i + 1]
                        if (Array.isArray(titleRow) && titleRow.length > 0) {
                          const titleFirst = String(titleRow[0] || '')
                          if (titleFirst.includes('最小负收益')) {
                            if (i + 2 < rawTableData.length) {
                              const dataRow = rawTableData[i + 2]
                              if (Array.isArray(dataRow) && dataRow.length >= 2) {
                                negativeStatsRowIndex = i + 2
                                const negRow = dataRow
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
            const adjustedAnalysis = {
              ...p4tcAnalysis,
              current_forecast: {
                ...p4tcAnalysis.current_forecast,
                price_difference_ratio: p4tcAnalysis.model_evaluation?.price_difference_ratio || p4tcAnalysis.current_forecast.price_difference_ratio
              }
            }
            setAnalysis(adjustedAnalysis)
          } else if (record.core_data) {
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
    const interval = setInterval(fetchDecisionData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="strategy-page">
      <div className="strategy-page-content-wrapper" style={{ width: '100%' }}>
        <p className="strategy-page-title">P4TC现货应用决策</p>

        {loading ? (
          <div className="strategy-loading">
            <div className="strategy-loading-spinner"></div>
            <p>加载中...</p>
          </div>
        ) : error ? (
          <div className="strategy-error">
            <p>{error}</p>
          </div>
        ) : analysis ? (
          <div className="strategy-page-content">
            {/* 头部统计 */}
            <div className="strategy-tags">
              <div className="strategy-tag">
                <p>做多胜率统计</p>
              </div>
              <div className="strategy-tag">
                <p>盈亏比：{analysis.trading_recommendation.profit_loss_ratio.toFixed(2)}：1</p>
              </div>
            </div>

            {/* 策略分析卡片 */}
            <div className="strategy-content-card">
              <div className="strategy-layout-grid">
                {/* 左侧：方向卡片 */}
                <div className="strategy-direction-card">
                  <div className="strategy-direction-badge">多头策略</div>
                  <div className="strategy-direction-title">
                    {analysis.trading_recommendation.recommended_direction}
                  </div>
                  <div className="strategy-direction-subtitle">建议交易方向</div>
                </div>

                {/* 右侧：关键指标 */}
                <div className="strategy-metrics-grid">
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">日期</p>
                    <p className="strategy-metric-value">{analysis.current_forecast.date}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">当前值</p>
                    <p className="strategy-metric-value">
                      {analysis.model_evaluation.current_price.toLocaleString()}
                    </p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">价差比</p>
                    <p className="strategy-metric-value">{analysis.model_evaluation.price_difference_ratio}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">价差比区间</p>
                    <p className="strategy-metric-value">{analysis.current_forecast.price_difference_range}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">2026-01-06预测值</p>
                    <p className="strategy-metric-value">
                      {analysis.model_evaluation.forecast_42day_price.toLocaleString()}
                    </p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">在全部交易日期中出现概率</p>
                    <p className="strategy-metric-value">{analysis.current_forecast.probability}%</p>
                  </div>
                </div>
              </div>


              {/* 历史预测表格 */}
              {forecastDates.length > 0 && (
                <div className="strategy-content-card" style={{ marginTop: '20px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead>
                      <tr>
                        {forecastDates.map((item, index) => (
                          <th key={index} style={{
                            padding: '12px',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '12px'
                          }}>
                            {item.date}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {forecastDates.map((item, index) => (
                          <td key={index} style={{
                            padding: '12px',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {item.value.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* 正收益和负收益部分 - 使用新的网格布局 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                {/* 正收益 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    color: '#4ade80',
                    fontSize: '16px',
                    marginBottom: '16px',
                    fontFamily: 'DengXian',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></span>
                    正收益
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div className="strategy-metric-item" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
                      <p className="strategy-metric-label">最终正收益占比</p>
                      <p className="strategy-metric-value" style={{ color: '#4ade80' }}>{analysis.positive_returns.final_positive_returns_percentage}%</p>
                    </div>
                    <div className="strategy-metric-item" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
                      <p className="strategy-metric-label">最终正收益平均值</p>
                      <p className="strategy-metric-value" style={{ color: '#4ade80' }}>{analysis.positive_returns.final_positive_returns_average}%</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 分布情况 */}
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>分布情况</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(analysis.positive_returns.distribution).map(([range, value]) => (
                          <div key={range} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{range}</span>
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 收益统计 */}
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>收益统计</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>最大正收益平均值</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.max_positive_returns_average || analysis.positive_returns.statistics.max_positive_returns_average}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>最大正收益最大值</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.max_positive_returns_maximum || analysis.positive_returns.statistics.max_positive_returns_maximum}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>最大正收益出现时间平均值</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.max_positive_returns_avg_time || analysis.positive_returns.statistics.max_positive_returns_avg_time}天
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 时间分布 */}
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>最大正收益平均出现天数</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>0~14天内</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.timing_distribution['0-14_days'] || analysis.positive_returns.timing_distribution['0-14_days']}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>15~28天内</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.timing_distribution['15-28_days'] || analysis.positive_returns.timing_distribution['15-28_days']}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>29~42天内</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.timing_distribution['29-42_days'] || analysis.positive_returns.timing_distribution['29-42_days']}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 负收益 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    color: '#f87171',
                    fontSize: '16px',
                    marginBottom: '16px',
                    fontFamily: 'DengXian',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171' }}></span>
                    负收益
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div className="strategy-metric-item" style={{ background: 'rgba(248, 113, 113, 0.1)' }}>
                      <p className="strategy-metric-label">最终负收益占比</p>
                      <p className="strategy-metric-value" style={{ color: '#f87171' }}>{analysis.negative_returns.final_negative_returns_percentage}%</p>
                    </div>
                    <div className="strategy-metric-item" style={{ background: 'rgba(248, 113, 113, 0.1)' }}>
                      <p className="strategy-metric-label">最终负收益平均值</p>
                      <p className="strategy-metric-value" style={{ color: '#f87171' }}>{analysis.negative_returns.final_negative_returns_average}%</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 分布情况 */}
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>分布情况</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(analysis.negative_returns.distribution).map(([range, value]) => (
                          <div key={range} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{range}</span>
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 收益统计 */}
                    <div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>收益统计</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>最小负收益平均值</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.min_negative_returns_average || analysis.negative_returns.statistics.min_negative_returns_average}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>最小负收益最小值</span>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {correctedStats?.min_negative_returns_minimum || analysis.negative_returns.statistics.min_negative_returns_minimum}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* P4TC六周后预测模型评价 */}
            <div className="strategy-content-card" style={{ marginTop: '20px' }}>
              <p className="strategy-page-title" style={{ fontSize: '18px', textAlign: 'left', marginBottom: '16px' }}>P4TC六周后预测模型评价</p>
              <div className="strategy-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '20px' }}>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">日期</p>
                  <p className="strategy-metric-value">{analysis.current_forecast.date}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">当前价格/元每吨</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.current_price.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">预测42天价差/元每吨</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.forecast_42day_price_difference.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">预测42天价格/元每吨</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.forecast_42day_price.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">价差比</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.price_difference_ratio}</p>
                </div>
              </div>

              {/* 评价表格 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>区间</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>历史判断正确率</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>历史预测实际值/元每吨</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>历史预测拟合值/元每吨</div>
                </div>
                {analysis.model_evaluation.evaluation_ranges.map((range, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    padding: '12px 16px',
                    borderBottom: index < analysis.model_evaluation.evaluation_ranges.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{range.range}</div>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{range.historical_accuracy_rate.toFixed(2)}%</div>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{range.historical_actual_value.toLocaleString()}</div>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{range.historical_fit_value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="strategy-error">
            <p>暂无数据</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default P4TCDecisionPage
