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
  overall_price_difference_range: string
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

interface P3AProfitLossRatio {
  date: string
  current_price: number
  evaluated_price: number
  price_difference_ratio: string
  profitability_ratio_after_42days: number
  average_returns: number
  loss_ratio_after_42days: number
  average_loss: number
  max_returns_timing_distribution: {
    '0-14_days': number
    '15-28_days': number
    '29-42_days': number
  }
  max_risk_average: number
  max_risk_extreme: number
  max_risk_timing_distribution: {
    '0-14_days': number
    '15-28_days': number
    '29-42_days': number
  }
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
  forecast_42day_price_difference: number
  forecast_42day_price: number
  price_difference_ratio: string
  evaluation_ranges: EvaluationRange[]
}

interface P3AAnalysis {
  trading_recommendation: TradingRecommendation
  current_forecast: CurrentForecast
  positive_returns: PositiveReturns
  negative_returns: NegativeReturns
  p3a_profit_loss_ratio: P3AProfitLossRatio
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
          p3a_analysis?: P3AAnalysis
          raw_table_data?: {
            data?: any[][]
          }
        }
        raw_table_data?: {
          data?: any[][]
        }
      }
    }>
  }
}

const P3A_42dDecisionPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<P3AAnalysis | null>(null)
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
        const response = await fetch('https://aqua.navgreen.cn/api/strategy/p3a_42d/decision')

        if (!response.ok) {
          throw new Error('网络请求失败')
        }

        const result: ApiResponse = await response.json()

        if (result.code === 200 && result.data.records && result.data.records.length > 0) {
          const record = result.data.records[0]
          const rawTableData = record.contracts?.raw_table_data?.data || record.raw_data?.contracts?.raw_table_data?.data
          const p3aAnalysis = record.raw_data?.contracts?.p3a_analysis

          let parsedData: P3AAnalysis | null = null

          if (rawTableData && Array.isArray(rawTableData)) {
            let profitLossRatio = 2.56
            let recommendedDirection = '做空'
            let date = ''
            let currentValue = 0
            let overallPriceDiffRatio = ''
            let overallPriceDiffRange = ''
            let forecastValue = 0
            let forecastDate = ''
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
                // 支持解析"做多"和"做空"两种方向
                if ((row[0] === '做多' || row[0] === '做空') && row.length >= 4) {
                  recommendedDirection = String(row[0] || '做空')
                  date = String(row[1] || '').trim()
                  const currentValueStr = String(row[2] || '0').replace(/,/g, '').trim()
                  // 只有当值有效时才赋值，避免0覆盖有效值
                  if (currentValueStr && !isNaN(parseFloat(currentValueStr)) && parseFloat(currentValueStr) > 0) {
                    currentValue = parseFloat(currentValueStr)
                  }
                  // 综合价差比可能在row[3]，需要检查是否有效
                  const priceDiffRatioStr = String(row[3] || '').trim()
                  if (priceDiffRatioStr && priceDiffRatioStr !== '0' && priceDiffRatioStr !== '' && priceDiffRatioStr !== 'null' && priceDiffRatioStr !== 'undefined') {
                    overallPriceDiffRatio = priceDiffRatioStr
                  }
                }
                if (row[0] === '建议交易方向' && row.length >= 4) {
                  overallPriceDiffRange = String(row[1] || '').trim()
                  const forecastValueStr = String(row[2] || '0').replace(/,/g, '').trim()
                  if (forecastValueStr && !isNaN(parseFloat(forecastValueStr)) && parseFloat(forecastValueStr) > 0) {
                    forecastValue = parseFloat(forecastValueStr)
                  }
                  const probabilityStr = String(row[3] || '0').replace('%', '').trim()
                  if (probabilityStr && !isNaN(parseFloat(probabilityStr))) {
                    probability = parseFloat(probabilityStr)
                  }
                }
                // 解析预测日期（从Row 6中查找包含"预测值"的列）
                if (Array.isArray(row) && row.length > 0) {
                  for (let j = 0; j < row.length; j++) {
                    const cell = String(row[j] || '')
                    // 查找格式如"2026-01-06预测值"的单元格
                    const dateMatch = cell.match(/(\d{4}-\d{2}-\d{2})预测值/)
                    if (dateMatch) {
                      forecastDate = dateMatch[1]
                      break
                    }
                  }
                }
              }
            }

            // 如果预测日期还没有找到，尝试从其他行查找
            if (!forecastDate || forecastDate === '') {
              for (let i = 0; i < rawTableData.length; i++) {
                const row = rawTableData[i]
                if (Array.isArray(row) && row.length > 0) {
                  for (let j = 0; j < row.length; j++) {
                    const cell = String(row[j] || '')
                    const dateMatch = cell.match(/(\d{4}-\d{2}-\d{2})预测值/)
                    if (dateMatch) {
                      forecastDate = dateMatch[1]
                      break
                    }
                  }
                  if (forecastDate) break
                }
              }
            }

            // 如果综合价差比还没有找到，尝试从其他行查找
            if (!overallPriceDiffRatio || overallPriceDiffRatio === '') {
              for (let i = 0; i < rawTableData.length; i++) {
                const row = rawTableData[i]
                if (Array.isArray(row) && row.length > 0) {
                  // 查找包含"综合价差比"的标题行，下一行可能是数据
                  if (row[0] === '综合价差比' && i + 1 < rawTableData.length) {
                    const nextRow = rawTableData[i + 1]
                    if (Array.isArray(nextRow) && nextRow.length > 0) {
                      const ratioStr = String(nextRow[0] || '').trim()
                      if (ratioStr && ratioStr !== '0' && ratioStr !== '' && !ratioStr.includes('日期')) {
                        overallPriceDiffRatio = ratioStr
                        break
                      }
                    }
                  }
                }
              }
            }

            let finalPositiveReturnsPercentage = 0
            let finalPositiveReturnsAverage = 0
            let positiveDistribution = { '0-15%': 0, '15.01-30%': 0, '30-60%': 0, '>60%': 0 }
            let maxPositiveReturnsAverage = 0
            let maxPositiveReturnsMaximum = 0
            let maxPositiveReturnsAvgTime = 0
            let positiveTimingDistribution = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }

            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                if (row[0] === '正收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalPositiveReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalPositiveReturnsAverage = parseFloat(String(nextRow[1] || '0').replace('%', '')) || 0
                  }
                }
                if (row[0] === '正收益比例0～15%' || (row[0] && String(row[0]).includes('正收益比例') && row.length >= 4)) {
                  if (i + 1 < rawTableData.length) {
                    const dataRow = rawTableData[i + 1]
                    if (Array.isArray(dataRow) && dataRow.length >= 4) {
                      positiveDistribution['0-15%'] = parseFloat(String(dataRow[0] || '0').replace('%', '')) || 0
                      positiveDistribution['15.01-30%'] = parseFloat(String(dataRow[1] || '0').replace('%', '')) || 0
                      positiveDistribution['30-60%'] = parseFloat(String(dataRow[2] || '0').replace('%', '')) || 0
                      positiveDistribution['>60%'] = parseFloat(String(dataRow[3] || '0').replace('%', '')) || 0
                    }
                  }
                }
                if (row[0] === '最大正收益平均值' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 3) {
                    maxPositiveReturnsAverage = parseFloat(String(dataRow[0] || '0').replace('%', '')) || 0
                    maxPositiveReturnsMaximum = parseFloat(String(dataRow[1] || '0').replace('%', '')) || 0
                    maxPositiveReturnsAvgTime = parseFloat(String(dataRow[2] || '0').replace(/天/g, '')) || 0
                  }
                }
                if (row[0] === '0～14天内' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 3) {
                    positiveTimingDistribution['0-14_days'] = parseFloat(String(dataRow[0] || '0').replace('%', '')) || 0
                    positiveTimingDistribution['15-28_days'] = parseFloat(String(dataRow[1] || '0').replace('%', '')) || 0
                    positiveTimingDistribution['29-42_days'] = parseFloat(String(dataRow[2] || '0').replace('%', '')) || 0
                  }
                }
              }
            }

            let finalNegativeReturnsPercentage = 0
            let finalNegativeReturnsAverage = 0
            let negativeDistribution = { '0-15%': 0, '15.01-30%': 0, '30-60%': 0, '<60%': 0 }
            let minNegativeReturnsAverage = 0
            let minNegativeReturnsMinimum = 0

            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                if (row[0] === '负收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalNegativeReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalNegativeReturnsAverage = parseFloat(String(nextRow[1] || '0').replace('%', '')) || 0
                  }
                }
                if (row[0] === '负收益比例0～15%' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 4) {
                    negativeDistribution['0-15%'] = parseFloat(String(dataRow[0] || '0').replace('%', '')) || 0
                    negativeDistribution['15.01-30%'] = parseFloat(String(dataRow[1] || '0').replace('%', '')) || 0
                    negativeDistribution['30-60%'] = parseFloat(String(dataRow[2] || '0').replace('%', '')) || 0
                    negativeDistribution['<60%'] = parseFloat(String(dataRow[3] || '0').replace('%', '')) || 0
                  }
                }
                if (row[0] === '最小负收益平均值' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 2) {
                    const avgStr = String(dataRow[0] || '0').replace('%', '').trim()
                    const minStr = String(dataRow[1] || '0').replace('%', '').trim()
                    minNegativeReturnsAverage = parseFloat(avgStr) || 0
                    minNegativeReturnsMinimum = parseFloat(minStr) || 0
                  }
                }
              }
            }

            let p3aProfitLossData: P3AProfitLossRatio | null = null
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0 && row[0] === 'P3A盈亏比') {
                if (i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 4) {
                    const p3aDate = String(dataRow[0] || '')
                    const p3aCurrentPrice = parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0
                    const p3aEvaluatedPrice = parseFloat(String(dataRow[2] || '0').replace(/,/g, '')) || 0
                    const p3aPriceDiffRatio = String(dataRow[3] || '')

                    let profitabilityRatio = 0
                    let averageReturns = 0
                    let lossRatio = 0
                    let averageLoss = 0
                    let maxReturnsTiming = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
                    let maxRiskAverage = 0
                    let maxRiskExtreme = 0
                    let maxRiskTiming = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }

                    for (let j = i + 2; j < rawTableData.length && j < i + 20; j++) {
                      const checkRow = rawTableData[j]
                      if (Array.isArray(checkRow) && checkRow.length > 0) {
                        if (checkRow.length === 4 &&
                          String(checkRow[0] || '').includes('%') &&
                          String(checkRow[1] || '').includes('%') &&
                          String(checkRow[2] || '').includes('%') &&
                          String(checkRow[3] || '').includes('%') &&
                          j + 1 < rawTableData.length) {
                          const nextRow = rawTableData[j + 1]
                          if (Array.isArray(nextRow) && nextRow.length > 0 &&
                            String(nextRow[0] || '').includes('42天后盈利比例')) {
                            profitabilityRatio = parseFloat(String(checkRow[0] || '0').replace('%', '')) || 0
                            averageReturns = parseFloat(String(checkRow[1] || '0').replace('%', '')) || 0
                            lossRatio = parseFloat(String(checkRow[2] || '0').replace('%', '')) || 0
                            averageLoss = parseFloat(String(checkRow[3] || '0').replace('%', '')) || 0
                          }
                        }
                        if (checkRow[0] === '最大收益时间在各时间段的出现概率' && j + 2 < rawTableData.length) {
                          const timingDataRow = rawTableData[j + 2]
                          if (Array.isArray(timingDataRow) && timingDataRow.length >= 3 &&
                            String(timingDataRow[0] || '').includes('%')) {
                            maxReturnsTiming['0-14_days'] = parseFloat(String(timingDataRow[0] || '0').replace('%', '')) || 0
                            maxReturnsTiming['15-28_days'] = parseFloat(String(timingDataRow[1] || '0').replace('%', '')) || 0
                            maxReturnsTiming['29-42_days'] = parseFloat(String(timingDataRow[2] || '0').replace('%', '')) || 0
                          }
                        }
                        if (checkRow.length === 2 &&
                          String(checkRow[0] || '').includes('%') &&
                          String(checkRow[1] || '').includes('%') &&
                          j + 1 < rawTableData.length) {
                          const nextRow = rawTableData[j + 1]
                          if (Array.isArray(nextRow) && nextRow.length > 0 &&
                            String(nextRow[0] || '').includes('最大风险均值')) {
                            maxRiskAverage = parseFloat(String(checkRow[0] || '0').replace('%', '')) || 0
                            maxRiskExtreme = parseFloat(String(checkRow[1] || '0').replace('%', '')) || 0
                          }
                        }
                        if (checkRow[0] === '最大风险时间在各时间段的出现概率' && j + 2 < rawTableData.length) {
                          const riskTimingDataRow = rawTableData[j + 2]
                          if (Array.isArray(riskTimingDataRow) && riskTimingDataRow.length >= 3 &&
                            String(riskTimingDataRow[0] || '').includes('%')) {
                            maxRiskTiming['0-14_days'] = parseFloat(String(riskTimingDataRow[0] || '0').replace('%', '')) || 0
                            maxRiskTiming['15-28_days'] = parseFloat(String(riskTimingDataRow[1] || '0').replace('%', '')) || 0
                            maxRiskTiming['29-42_days'] = parseFloat(String(riskTimingDataRow[2] || '0').replace('%', '')) || 0
                          }
                        }
                      }
                    }

                    p3aProfitLossData = {
                      date: p3aDate,
                      current_price: p3aCurrentPrice,
                      evaluated_price: p3aEvaluatedPrice,
                      price_difference_ratio: p3aPriceDiffRatio,
                      profitability_ratio_after_42days: profitabilityRatio,
                      average_returns: averageReturns,
                      loss_ratio_after_42days: lossRatio,
                      average_loss: averageLoss,
                      max_returns_timing_distribution: maxReturnsTiming,
                      max_risk_average: maxRiskAverage,
                      max_risk_extreme: maxRiskExtreme,
                      max_risk_timing_distribution: maxRiskTiming
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
                if (row[0] === 'P5TC六周后预测模型评价' && i + 1 < rawTableData.length) {
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
                overall_price_difference_range: overallPriceDiffRange,
                forecast_value: forecastValue,
                probability: probability,
                forecast_date: forecastDate
              } as CurrentForecast & { forecast_date?: string },
              positive_returns: {
                final_positive_returns_percentage: finalPositiveReturnsPercentage,
                final_positive_returns_average: finalPositiveReturnsAverage,
                distribution: positiveDistribution,
                statistics: {
                  max_positive_returns_average: maxPositiveReturnsAverage,
                  max_positive_returns_maximum: maxPositiveReturnsMaximum,
                  max_positive_returns_avg_time: maxPositiveReturnsAvgTime
                },
                timing_distribution: positiveTimingDistribution
              },
              negative_returns: {
                final_negative_returns_percentage: finalNegativeReturnsPercentage,
                final_negative_returns_average: finalNegativeReturnsAverage,
                distribution: negativeDistribution,
                statistics: {
                  min_negative_returns_average: minNegativeReturnsAverage,
                  min_negative_returns_minimum: minNegativeReturnsMinimum
                }
              },
              p3a_profit_loss_ratio: p3aProfitLossData || {
                date: date || result.data.date,
                current_price: currentValue,
                evaluated_price: 0,
                price_difference_ratio: overallPriceDiffRatio,
                profitability_ratio_after_42days: 0,
                average_returns: 0,
                loss_ratio_after_42days: 0,
                average_loss: 0,
                max_returns_timing_distribution: { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 },
                max_risk_average: 0,
                max_risk_extreme: 0,
                max_risk_timing_distribution: { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
              },
              model_evaluation: {
                date: modelEvalDate,
                current_price: modelEvalCurrentPrice,
                forecast_42day_price_difference: modelEvalForecastDiff,
                forecast_42day_price: modelEvalForecastPrice,
                price_difference_ratio: modelEvalPriceDiffRatio,
                evaluation_ranges: evaluationRanges
              }
            }

            setCorrectedStats({
              max_positive_returns_average: maxPositiveReturnsAverage,
              max_positive_returns_maximum: maxPositiveReturnsMaximum,
              max_positive_returns_avg_time: maxPositiveReturnsAvgTime,
              timing_distribution: positiveTimingDistribution,
              min_negative_returns_average: minNegativeReturnsAverage,
              min_negative_returns_minimum: minNegativeReturnsMinimum
            })
          }

          // 优先使用p3aAnalysis，但合并parsedData中的关键字段以确保数据完整
          if (p3aAnalysis) {
            // 合并parsedData中的关键字段（如果p3aAnalysis中缺失）
            const mergedAnalysis: P3AAnalysis = {
              ...p3aAnalysis,
              trading_recommendation: {
                ...p3aAnalysis.trading_recommendation,
                profit_loss_ratio: p3aAnalysis.trading_recommendation.profit_loss_ratio || parsedData?.trading_recommendation.profit_loss_ratio || 0,
                recommended_direction: p3aAnalysis.trading_recommendation.recommended_direction || parsedData?.trading_recommendation.recommended_direction || '做空'
              },
              current_forecast: {
                ...p3aAnalysis.current_forecast,
                date: p3aAnalysis.current_forecast.date || parsedData?.current_forecast.date || result.data.date || '',
                current_value: p3aAnalysis.current_forecast.current_value || parsedData?.current_forecast.current_value || 0,
                overall_price_difference_ratio: p3aAnalysis.current_forecast.overall_price_difference_ratio || parsedData?.current_forecast.overall_price_difference_ratio || '',
                overall_price_difference_range: p3aAnalysis.current_forecast.overall_price_difference_range || parsedData?.current_forecast.overall_price_difference_range || '',
                forecast_value: p3aAnalysis.current_forecast.forecast_value || parsedData?.current_forecast.forecast_value || 0,
                probability: p3aAnalysis.current_forecast.probability || parsedData?.current_forecast.probability || 0,
                forecast_date: (p3aAnalysis.current_forecast as any).forecast_date || (parsedData?.current_forecast as any)?.forecast_date || ''
              } as CurrentForecast & { forecast_date?: string }
            }
            setAnalysis(mergedAnalysis)
          } else if (parsedData) {
            setAnalysis(parsedData)
          } else if (record.core_data) {
            const constructed: P3AAnalysis = {
              trading_recommendation: record.core_data.trading_recommendation,
              current_forecast: {
                date: record.core_data.current_forecast.date,
                current_value: record.core_data.current_forecast.high_expected_value || 0,
                overall_price_difference_ratio: record.core_data.current_forecast.price_difference_ratio || '',
                overall_price_difference_range: record.core_data.current_forecast.price_difference_range || '',
                forecast_value: record.core_data.current_forecast.forecast_value,
                probability: record.core_data.current_forecast.probability
              },
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
              p3a_profit_loss_ratio: {
                date: record.core_data.current_forecast.date,
                current_price: record.core_data.current_forecast.high_expected_value || 0,
                evaluated_price: 0,
                price_difference_ratio: record.core_data.current_forecast.price_difference_ratio || '',
                profitability_ratio_after_42days: 0,
                average_returns: 0,
                loss_ratio_after_42days: 0,
                average_loss: 0,
                max_returns_timing_distribution: { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 },
                max_risk_average: 0,
                max_risk_extreme: 0,
                max_risk_timing_distribution: { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
              },
              model_evaluation: {
                date: record.core_data.current_forecast.date,
                current_price: record.core_data.current_forecast.high_expected_value || 0,
                forecast_42day_price_difference: 0,
                forecast_42day_price: record.core_data.current_forecast.forecast_value,
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
                <p>{analysis.trading_recommendation.recommended_direction === '做多' ? '做多胜率统计' : '做空胜率统计'}</p>
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
                    <p className="strategy-metric-label">综合价差比区间</p>
                    <p className="strategy-metric-value">{analysis.current_forecast.overall_price_difference_range}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">
                      {(analysis.current_forecast as any).forecast_date || '预测值'}
                      {(analysis.current_forecast as any).forecast_date ? '预测值' : ''}
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-long-bg)' }}>
                      <p className="strategy-metric-label">最终正收益占比</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-long-color)' }}>{analysis.positive_returns.final_positive_returns_percentage}%</p>
                    </div>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-long-bg)' }}>
                      <p className="strategy-metric-label">最终正收益平均值</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-long-color)' }}>{analysis.positive_returns.final_positive_returns_average}%</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 分布情况 */}
                    <div>
                      <p className="strategy-section-title">分布情况</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(analysis.positive_returns.distribution).map(([range, value]) => (
                          <div key={range} className="strategy-text-row">
                            <span className="strategy-text-label">{range}</span>
                            <span className="strategy-text-value">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 收益统计 */}
                    <div>
                      <p className="strategy-section-title">收益统计</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">最大正收益平均值</span>
                          <span className="strategy-text-value">
                            {correctedStats?.max_positive_returns_average || analysis.positive_returns.statistics.max_positive_returns_average}%
                          </span>
                        </div>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">最大正收益最大值</span>
                          <span className="strategy-text-value">
                            {correctedStats?.max_positive_returns_maximum || analysis.positive_returns.statistics.max_positive_returns_maximum}%
                          </span>
                        </div>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">最大正收益出现时间平均值</span>
                          <span className="strategy-text-value">
                            {correctedStats?.max_positive_returns_avg_time || analysis.positive_returns.statistics.max_positive_returns_avg_time}天
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 时间分布 */}
                    <div>
                      <p className="strategy-section-title">最大正收益平均出现天数</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">0~14天内</span>
                          <span className="strategy-text-value">
                            {correctedStats?.timing_distribution['0-14_days'] || analysis.positive_returns.timing_distribution['0-14_days']}%
                          </span>
                        </div>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">15~28天内</span>
                          <span className="strategy-text-value">
                            {correctedStats?.timing_distribution['15-28_days'] || analysis.positive_returns.timing_distribution['15-28_days']}%
                          </span>
                        </div>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">29~42天内</span>
                          <span className="strategy-text-value">
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-short-bg)' }}>
                      <p className="strategy-metric-label">最终负收益占比</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-short-color)' }}>{analysis.negative_returns.final_negative_returns_percentage}%</p>
                    </div>
                    <div className="strategy-metric-item" style={{ background: 'var(--strategy-short-bg)' }}>
                      <p className="strategy-metric-label">最终负收益平均值</p>
                      <p className="strategy-metric-value" style={{ color: 'var(--strategy-short-color)' }}>{analysis.negative_returns.final_negative_returns_average}%</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 分布情况 */}
                    <div>
                      <p className="strategy-section-title">分布情况</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {Object.entries(analysis.negative_returns.distribution).map(([range, value]) => (
                          <div key={range} className="strategy-text-row">
                            <span className="strategy-text-label">{range}</span>
                            <span className="strategy-text-value">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 收益统计 */}
                    <div>
                      <p className="strategy-section-title">收益统计</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">最小负收益平均值</span>
                          <span className="strategy-text-value">
                            {correctedStats?.min_negative_returns_average || analysis.negative_returns.statistics.min_negative_returns_average}%
                          </span>
                        </div>
                        <div className="strategy-text-row">
                          <span className="strategy-text-label">最小负收益最小值</span>
                          <span className="strategy-text-value">
                            {correctedStats?.min_negative_returns_minimum || analysis.negative_returns.statistics.min_negative_returns_minimum}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* P3A盈亏比 */}
            <div className="strategy-content-card" style={{ marginTop: '20px' }}>
              <p className="strategy-page-title" style={{ fontSize: '18px', textAlign: 'left', marginBottom: '16px' }}>P3A盈亏比</p>
              <div className="strategy-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '20px' }}>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">日期</p>
                  <p className="strategy-metric-value">{analysis.p3a_profit_loss_ratio.date}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">当前价格/元每吨</p>
                  <p className="strategy-metric-value">{analysis.p3a_profit_loss_ratio.current_price.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">评估价格/元每吨</p>
                  <p className="strategy-metric-value">{analysis.p3a_profit_loss_ratio.evaluated_price.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">价差比</p>
                  <p className="strategy-metric-value">{analysis.p3a_profit_loss_ratio.price_difference_ratio}</p>
                </div>
              </div>

              {/* 盈亏比例统计 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(74, 222, 128, 0.05)', borderRadius: '12px', padding: '16px' }}>
                  <div className="strategy-text-row" style={{ marginBottom: '8px' }}>
                    <span className="strategy-text-label">42天后盈利比例</span>
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{analysis.p3a_profit_loss_ratio.profitability_ratio_after_42days}%</span>
                  </div>
                  <div className="strategy-text-row">
                    <span className="strategy-text-label">收益均值</span>
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{analysis.p3a_profit_loss_ratio.average_returns}%</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(248, 113, 113, 0.05)', borderRadius: '12px', padding: '16px' }}>
                  <div className="strategy-text-row" style={{ marginBottom: '8px' }}>
                    <span className="strategy-text-label">42天后亏损比例</span>
                    <span style={{ color: '#f87171', fontWeight: 'bold' }}>{analysis.p3a_profit_loss_ratio.loss_ratio_after_42days}%</span>
                  </div>
                  <div className="strategy-text-row">
                    <span className="strategy-text-label">亏损均值</span>
                    <span style={{ color: '#f87171', fontWeight: 'bold' }}>{analysis.p3a_profit_loss_ratio.average_loss}%</span>
                  </div>
                </div>
              </div>

              {/* 详细分布统计 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* 最大收益时间分布 */}
                <div>
                  <p className="strategy-section-title">最大收益时间在各时间段的出现概率</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="strategy-text-row">
                      <span className="strategy-text-label">0~14天</span>
                      <span className="strategy-text-value">{analysis.p3a_profit_loss_ratio.max_returns_timing_distribution['0-14_days']}%</span>
                    </div>
                    <div className="strategy-text-row">
                      <span className="strategy-text-label">15~28天</span>
                      <span className="strategy-text-value">{analysis.p3a_profit_loss_ratio.max_returns_timing_distribution['15-28_days']}%</span>
                    </div>
                    <div className="strategy-text-row">
                      <span className="strategy-text-label">29~42天</span>
                      <span className="strategy-text-value">{analysis.p3a_profit_loss_ratio.max_returns_timing_distribution['29-42_days']}%</span>
                    </div>
                  </div>
                </div>

                {/* 风险统计 */}
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <p className="strategy-section-title">风险统计</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="strategy-text-row">
                        <span className="strategy-text-label">最大风险均值</span>
                        <span style={{ color: '#f87171', fontWeight: 'bold' }}>{analysis.p3a_profit_loss_ratio.max_risk_average}%</span>
                      </div>
                      <div className="strategy-text-row">
                        <span className="strategy-text-label">最大风险极值</span>
                        <span style={{ color: '#f87171', fontWeight: 'bold' }}>{analysis.p3a_profit_loss_ratio.max_risk_extreme}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="strategy-section-title">最大风险时间在各时间段的出现概率</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="strategy-text-row">
                        <span className="strategy-text-label">0~14天</span>
                        <span className="strategy-text-value">{analysis.p3a_profit_loss_ratio.max_risk_timing_distribution['0-14_days']}%</span>
                      </div>
                      <div className="strategy-text-row">
                        <span className="strategy-text-label">15~28天</span>
                        <span className="strategy-text-value">{analysis.p3a_profit_loss_ratio.max_risk_timing_distribution['15-28_days']}%</span>
                      </div>
                      <div className="strategy-text-row">
                        <span className="strategy-text-label">29~42天</span>
                        <span className="strategy-text-value">{analysis.p3a_profit_loss_ratio.max_risk_timing_distribution['29-42_days']}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* P5TC六周后预测模型评价 */}
            <div className="strategy-content-card" style={{ marginTop: '20px' }}>
              <p className="strategy-page-title" style={{ fontSize: '18px', textAlign: 'left', marginBottom: '16px' }}>P5TC六周后预测模型评价</p>
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
                  <p className="strategy-metric-label">预测42天后价差/元每吨</p>
                  <p className="strategy-metric-value">{analysis.model_evaluation.forecast_42day_price_difference.toLocaleString()}</p>
                </div>
                <div className="strategy-metric-item">
                  <p className="strategy-metric-label">预测42天后价格/元每吨</p>
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

export default P3A_42dDecisionPage
