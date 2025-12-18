import { useState, useEffect } from 'react'
import './StrategyPageOptimization.css'

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
  high_expected_value?: number
  price_difference_ratio?: string
  price_difference_range?: string
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
          raw_table_data?: {
            data?: any[][]
          }
        }
      }
    }>
  }
}

const P6_14dDecisionPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<P6_14dAnalysis | null>(null)

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

          let parsedData: P6_14dAnalysis | null = null

          if (rawTableData && Array.isArray(rawTableData)) {
            let profitLossRatio = 4.47
            let recommendedDirection = '做多'
            let date = ''
            let currentValue = 0
            let overallPriceDiffRatio = ''
            let gearInterval = ''
            let forecastDate = ''
            let forecastValue = 0
            let probability = 0

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
                if (row[0] === '做多' && row.length >= 4) {
                  recommendedDirection = '做多'
                  date = String(row[1] || '')
                  currentValue = parseFloat(String(row[2] || '0').replace(/,/g, '')) || 0
                  overallPriceDiffRatio = String(row[3] || '')
                }
                if (row[0] === '建议交易方向' && row.length >= 4) {
                  gearInterval = String(row[1] || '')
                  forecastValue = parseFloat(String(row[2] || '0').replace(/,/g, '')) || 0
                  probability = parseFloat(String(row[3] || '0').replace('%', '')) || 0
                }
                if (row[0] === '档位区间' && row.length >= 2) {
                  const forecastDateMatch = String(row[1] || '').match(/(\d{4}-\d{2}-\d{2})/)
                  if (forecastDateMatch) {
                    forecastDate = forecastDateMatch[1]
                  }
                }
              }
            }

            let finalPositiveReturnsPercentage = 0
            let finalPositiveReturnsAverage = 0

            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                if (row[0] === '正收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalPositiveReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalPositiveReturnsAverage = parseFloat(String(nextRow[1] || '0').replace(/,/g, '')) || 0
                  }
                }
              }
            }

            let finalNegativeReturnsPercentage = 0
            let finalNegativeReturnsAverage = 0

            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                if (row[0] === '负收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalNegativeReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalNegativeReturnsAverage = parseFloat(String(nextRow[1] || '0').replace(/,/g, '')) || 0
                  }
                }
              }
            }

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

            let modelEvalDate = date || result.data.date
            let modelEvalCurrentPrice = currentValue
            let modelEvalForecastDiff = 0
            let modelEvalForecastPrice = forecastValue
            let modelEvalPriceDiffRatio = overallPriceDiffRatio
            let evaluationRanges: EvaluationRange[] = []

            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                if (row[0] === 'P5TC二周后预测模型评价' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 6) {
                    modelEvalDate = String(dataRow[0] || '')
                    modelEvalCurrentPrice = parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastDiff = parseFloat(String(dataRow[3] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastPrice = parseFloat(String(dataRow[4] || '0').replace(/,/g, '')) || 0
                    modelEvalPriceDiffRatio = String(dataRow[5] || '')
                  }
                  for (let j = i + 4; j < rawTableData.length; j++) {
                    const evalRow = rawTableData[j]
                    if (Array.isArray(evalRow) && evalRow.length >= 4) {
                      const firstCol = String(evalRow[0] || '')
                      const secondCol = String(evalRow[1] || '')

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

                        if (evalRow.length >= 5 && !secondIsPercent && thirdIsPercent &&
                          (secondCol.match(/^-?\d+$/) || secondCol.match(/^-?\d+\.\d+$/))) {
                          rangeStr = `${firstCol} ~ ${secondCol}`
                          accuracyRate = parseFloat(String(evalRow[2] || '0').replace('%', '')) || 0
                          actualValue = parseFloat(String(evalRow[3] || '0').replace(/,/g, '')) || 0
                          fitValue = parseFloat(String(evalRow[4] || '0').replace(/,/g, '')) || 0
                        } else if (secondIsPercent) {
                          accuracyRate = parseFloat(secondCol.replace('%', '')) || 0
                          actualValue = parseFloat(String(evalRow[2] || '0').replace(/,/g, '')) || 0
                          fitValue = parseFloat(String(evalRow[3] || '0').replace(/,/g, '')) || 0
                        }

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
                  <div className={`strategy-direction-title ${analysis.trading_recommendation.recommended_direction === '做多' ? 'text-long' : 'text-short'}`}>
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
                    <p className="strategy-metric-label">当期值</p>
                    <p className="strategy-metric-value">
                      {analysis.current_forecast.current_value.toLocaleString()}
                    </p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">综合价差比</p>
                    <p className="strategy-metric-value">{analysis.current_forecast.overall_price_difference_ratio}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">档位区间</p>
                    <p className="strategy-metric-value">{analysis.current_forecast.gear_interval}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">
                      {analysis.current_forecast.forecast_date ? `${analysis.current_forecast.forecast_date}预测值` : '预测值'}
                    </p>
                    <p className="strategy-metric-value">
                      {analysis.current_forecast.forecast_value.toLocaleString()}
                    </p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">在全部交易日期中出现概率</p>
                    <p className="strategy-metric-value">{analysis.current_forecast.probability}%</p>
                  </div>
                </div>
              </div>


              {/* 正收益和负收益部分 */}
              {/* 正收益和负收益部分 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                {/* 正收益 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    color: 'var(--strategy-long-color)',
                    fontSize: '16px',
                    marginBottom: '16px',
                    fontFamily: 'DengXian',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--strategy-long-color)' }}></span>
                    正收益
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-long-bg)' }}>
                      <p className="strategy-metric-label">最终正收益占比</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-long-color)' }}>{analysis.positive_returns.final_positive_returns_percentage}%</p>
                    </div>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-long-bg)' }}>
                      <p className="strategy-metric-label">最终正收益平均值</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-long-color)' }}>{analysis.positive_returns.final_positive_returns_average.toLocaleString()}</p>
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
                    color: 'var(--strategy-short-color)',
                    fontSize: '16px',
                    marginBottom: '16px',
                    fontFamily: 'DengXian',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--strategy-short-color)' }}></span>
                    负收益
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-short-bg)' }}>
                      <p className="strategy-metric-label">最终负收益比例</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-short-color)' }}>{analysis.negative_returns.final_negative_returns_percentage}%</p>
                    </div>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-short-bg)' }}>
                      <p className="strategy-metric-label">最终负收益平均值</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-short-color)' }}>{analysis.negative_returns.final_negative_returns_average.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* P6当前评估价格 */}
            {analysis.p6_current_evaluation && (
              <div className="strategy-content-card" style={{ marginTop: '20px' }}>
                <p className="strategy-page-title" style={{ fontSize: '18px', textAlign: 'left', marginBottom: '16px' }}>P6当前评估价格</p>
                <div className="strategy-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">日期</p>
                    <p className="strategy-metric-value">{analysis.p6_current_evaluation.date}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">当前价格/元每吨</p>
                    <p className="strategy-metric-value">{analysis.p6_current_evaluation.current_price.toLocaleString()}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">评估价格/元每吨</p>
                    <p className="strategy-metric-value">{analysis.p6_current_evaluation.evaluated_price.toLocaleString()}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">价差比</p>
                    <p className="strategy-metric-value">{analysis.p6_current_evaluation.price_difference_ratio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* P5TC二周后预测模型评价 */}
            <div className="strategy-content-card" style={{ marginTop: '20px' }}>
              <p className="strategy-page-title" style={{ fontSize: '18px', textAlign: 'left', marginBottom: '16px' }}>P5TC二周后预测模型评价</p>
              <div className="strategy-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '20px' }}>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">日期</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.date}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">当前价格/元每吨</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.current_price.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">预测14天后价差/元每吨</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.forecast_14day_price_difference.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">预测14天后价格/元每吨</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.forecast_14day_price.toLocaleString()}</p>
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
                  <div className="strategy-text-label">区间</div>
                  <div className="strategy-text-label">历史判断正确率</div>
                  <div className="strategy-text-label">历史预测实际值/元每吨</div>
                  <div className="strategy-text-label">历史预测拟合值/元每吨</div>
                </div>
                {analysis.model_evaluation.evaluation_ranges.map((range, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    padding: '12px 16px',
                    borderBottom: index < analysis.model_evaluation.evaluation_ranges.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}>
                    <div className="strategy-text-value">{range.range}</div>
                    <div className="strategy-text-value">{range.historical_accuracy_rate.toFixed(2)}%</div>
                    <div className="strategy-text-value">{range.historical_actual_value.toLocaleString()}</div>
                    <div className="strategy-text-value">{range.historical_fit_value.toLocaleString()}</div>
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

export default P6_14dDecisionPage
