import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import './P5DecisionPage.css'

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

interface P5ProfitLossRatio {
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

interface P5Analysis {
  trading_recommendation: TradingRecommendation
  current_forecast: CurrentForecast
  positive_returns: PositiveReturns
  negative_returns: NegativeReturns
  p5_profit_loss_ratio: P5ProfitLossRatio
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
          p5_analysis?: P5Analysis
          raw_table_data?: {
            data?: any[][]
          }
        }
      }
    }>
  }
}

const P5DecisionPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<P5Analysis | null>(null)
  const [swapDate, setSwapDate] = useState<string>('')
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
        const response = await fetch('https://aqua.navgreen.cn/api/strategy/p5_42d/decision')
        
        if (!response.ok) {
          throw new Error('网络请求失败')
        }

        const result: ApiResponse = await response.json()
        
        if (result.code === 200 && result.data.records && result.data.records.length > 0) {
          const record = result.data.records[0]
          // P5的数据结构：数据在contracts.raw_table_data.data中
          const rawTableData = record.contracts?.raw_table_data?.data || record.raw_data?.contracts?.raw_table_data?.data
          const p5Analysis = record.raw_data?.contracts?.p5_analysis
          
          // 根据P5的实际数据结构解析数据
          let parsedData: P5Analysis | null = null
          
          if (rawTableData && Array.isArray(rawTableData)) {
            // 解析基础信息
            // Row 2: ["做空胜率统计","盈亏比：","2.39：1"]
            // Row 3: ["做空","2025-11-25","18425","-5%"]
            // Row 4: ["日期","当期值","综合价差比"]
            // Row 5: ["建议交易方向","-15% - 0%","17444","27%"]
            // Row 6: ["综合价差比区间","2026-01-06预测值","在全部交易日期中出现概率"]
            
            let profitLossRatio = 2.39
            let recommendedDirection = '做空'
            let date = ''
            let currentValue = 0
            let overallPriceDiffRatio = ''
            let overallPriceDiffRange = ''
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
                // 解析做空和日期、当期值、价差比
                if (row[0] === '做空' && row.length >= 4) {
                  recommendedDirection = '做空'
                  date = String(row[1] || '')
                  currentValue = parseFloat(String(row[2] || '0').replace(/,/g, '')) || 0
                  overallPriceDiffRatio = String(row[3] || '')
                }
                // 解析建议交易方向行（Row 5）
                if (row[0] === '建议交易方向' && row.length >= 4) {
                  overallPriceDiffRange = String(row[1] || '')
                  forecastValue = parseFloat(String(row[2] || '0').replace(/,/g, '')) || 0
                  probability = parseFloat(String(row[3] || '0').replace('%', '')) || 0
                }
              }
            }
            
            // 解析正收益数据
            // Row 7: ["正收益"]
            // Row 8: ["66%","22%"]
            // Row 9: ["最终正收益占比","最终正收益平均值"]
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
                // 查找"正收益"行
                if (row[0] === '正收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalPositiveReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalPositiveReturnsAverage = parseFloat(String(nextRow[1] || '0').replace('%', '')) || 0
                  }
                }
                // 查找分布情况 - 查找包含"正收益比例"的标题行
                if (row[0] === '正收益比例0～15%' || (row[0] && String(row[0]).includes('正收益比例') && row.length >= 4)) {
                  // 下一行应该是数据行
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
                // 查找收益统计
                if (row[0] === '最大正收益平均值' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 3) {
                    maxPositiveReturnsAverage = parseFloat(String(dataRow[0] || '0').replace('%', '')) || 0
                    maxPositiveReturnsMaximum = parseFloat(String(dataRow[1] || '0').replace('%', '')) || 0
                    maxPositiveReturnsAvgTime = parseFloat(String(dataRow[2] || '0').replace(/天/g, '')) || 0
                  }
                }
                // 查找最大正收益平均出现天数
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
            
            // 解析负收益数据
            let finalNegativeReturnsPercentage = 0
            let finalNegativeReturnsAverage = 0
            let negativeDistribution = { '0-15%': 0, '15.01-30%': 0, '30-60%': 0, '<60%': 0 }
            let minNegativeReturnsAverage = 0
            let minNegativeReturnsMinimum = 0
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                // 查找"负收益"行
                if (row[0] === '负收益' && i + 1 < rawTableData.length) {
                  const nextRow = rawTableData[i + 1]
                  if (Array.isArray(nextRow) && nextRow.length >= 2) {
                    finalNegativeReturnsPercentage = parseFloat(String(nextRow[0] || '0').replace('%', '')) || 0
                    finalNegativeReturnsAverage = parseFloat(String(nextRow[1] || '0').replace('%', '')) || 0
                  }
                }
                // 查找负收益分布情况
                if (row[0] === '负收益比例0～15%' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 4) {
                    negativeDistribution['0-15%'] = parseFloat(String(dataRow[0] || '0').replace('%', '')) || 0
                    negativeDistribution['15.01-30%'] = parseFloat(String(dataRow[1] || '0').replace('%', '')) || 0
                    negativeDistribution['30-60%'] = parseFloat(String(dataRow[2] || '0').replace('%', '')) || 0
                    negativeDistribution['<60%'] = parseFloat(String(dataRow[3] || '0').replace('%', '')) || 0
                  }
                }
                // 查找最小负收益
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
            
            // 解析P5盈亏比数据
            // 查找"P5盈亏比"行
            let p5ProfitLossData: P5ProfitLossRatio | null = null
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0 && row[0] === 'P5盈亏比') {
                // 下一行应该是数据行：["2025-11-25","18425","16239","-12%"]
                if (i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 4) {
                    const p5Date = String(dataRow[0] || '')
                    const p5CurrentPrice = parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0
                    const p5EvaluatedPrice = parseFloat(String(dataRow[2] || '0').replace(/,/g, '')) || 0
                    const p5PriceDiffRatio = String(dataRow[3] || '')
                    
                    // 继续查找后续数据
                    let profitabilityRatio = 0
                    let averageReturns = 0
                    let lossRatio = 0
                    let averageLoss = 0
                    let maxReturnsTiming = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
                    let maxRiskAverage = 0
                    let maxRiskExtreme = 0
                    let maxRiskTiming = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
                    
                    // 查找"42天后盈利比例"等数据
                    for (let j = i + 2; j < rawTableData.length && j < i + 20; j++) {
                      const checkRow = rawTableData[j]
                      if (Array.isArray(checkRow) && checkRow.length > 0) {
                        if (checkRow[0] === '42天后盈利比例' && j + 1 < rawTableData.length) {
                          const profitRow = rawTableData[j + 1]
                          if (Array.isArray(profitRow) && profitRow.length >= 4) {
                            profitabilityRatio = parseFloat(String(profitRow[0] || '0').replace('%', '')) || 0
                            averageReturns = parseFloat(String(profitRow[1] || '0').replace('%', '')) || 0
                            lossRatio = parseFloat(String(profitRow[2] || '0').replace('%', '')) || 0
                            averageLoss = parseFloat(String(profitRow[3] || '0').replace('%', '')) || 0
                          }
                        }
                        if ((checkRow[0] === '0～14天' || String(checkRow[0] || '').includes('0～14天')) && j + 1 < rawTableData.length) {
                          const timingRow = rawTableData[j + 1]
                          if (Array.isArray(timingRow) && timingRow.length >= 3) {
                            maxReturnsTiming['0-14_days'] = parseFloat(String(timingRow[0] || '0').replace('%', '')) || 0
                            maxReturnsTiming['15-28_days'] = parseFloat(String(timingRow[1] || '0').replace('%', '')) || 0
                            maxReturnsTiming['29-42_days'] = parseFloat(String(timingRow[2] || '0').replace('%', '')) || 0
                          }
                        }
                        if (checkRow[0] === '最大风险均值/元每吨' && j + 1 < rawTableData.length) {
                          const riskRow = rawTableData[j + 1]
                          if (Array.isArray(riskRow) && riskRow.length >= 2) {
                            maxRiskAverage = parseFloat(String(riskRow[0] || '0').replace('%', '')) || 0
                            maxRiskExtreme = parseFloat(String(riskRow[1] || '0').replace('%', '')) || 0
                          }
                        }
                        if (checkRow[0] === '最大风险时间在各时间段的出现概率' && j + 2 < rawTableData.length) {
                          const riskTimingRow = rawTableData[j + 2]
                          if (Array.isArray(riskTimingRow) && riskTimingRow.length >= 3) {
                            maxRiskTiming['0-14_days'] = parseFloat(String(riskTimingRow[0] || '0').replace('%', '')) || 0
                            maxRiskTiming['15-28_days'] = parseFloat(String(riskTimingRow[1] || '0').replace('%', '')) || 0
                            maxRiskTiming['29-42_days'] = parseFloat(String(riskTimingRow[2] || '0').replace('%', '')) || 0
                          }
                        }
                      }
                    }
                    
                    p5ProfitLossData = {
                      date: p5Date,
                      current_price: p5CurrentPrice,
                      evaluated_price: p5EvaluatedPrice,
                      price_difference_ratio: p5PriceDiffRatio,
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
            
            // 解析P5TC六周后预测模型评价数据
            let modelEvalDate = date || result.data.date
            let modelEvalCurrentPrice = currentValue
            let modelEvalForecastDiff = 0
            let modelEvalForecastPrice = forecastValue
            let modelEvalPriceDiffRatio = overallPriceDiffRatio
            let evaluationRanges: EvaluationRange[] = []
            
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0) {
                // 查找"P5TC六周后预测模型评价"
                if (row[0] === 'P5TC六周后预测模型评价' && i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 6) {
                    modelEvalDate = String(dataRow[0] || '')
                    modelEvalCurrentPrice = parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastDiff = parseFloat(String(dataRow[3] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastPrice = parseFloat(String(dataRow[4] || '0').replace(/,/g, '')) || 0
                    modelEvalPriceDiffRatio = String(dataRow[5] || '')
                  }
                  // 查找评价表格数据（从"区间"行开始）
                  for (let j = i + 3; j < rawTableData.length; j++) {
                    const evalRow = rawTableData[j]
                    if (Array.isArray(evalRow) && evalRow.length >= 4) {
                      // 检查是否是区间数据行（第一列是区间，第二列是百分比）
                      const firstCol = String(evalRow[0] || '')
                      const secondCol = String(evalRow[1] || '')
                      // 如果第一列包含数字或区间符号，第二列是百分比，则认为是数据行
                      if ((firstCol.includes('<') || firstCol.includes('-') || firstCol.match(/^\d+$/)) && secondCol.includes('%')) {
                        let rangeStr = firstCol
                        // 如果是两列区间（如"-5000"和"-2500"），需要合并
                        if (evalRow.length >= 5 && !secondCol.includes('%')) {
                          rangeStr = `${firstCol} ~ ${secondCol}`
                          // 重新解析
                          const accuracyRate = parseFloat(String(evalRow[2] || '0').replace('%', '')) || 0
                          const actualValue = parseFloat(String(evalRow[3] || '0').replace(/,/g, '')) || 0
                          const fitValue = parseFloat(String(evalRow[4] || '0').replace(/,/g, '')) || 0
                          evaluationRanges.push({
                            range: rangeStr,
                            historical_accuracy_rate: accuracyRate,
                            historical_actual_value: actualValue,
                            historical_fit_value: fitValue
                          })
                        } else {
                          const accuracyRate = parseFloat(secondCol.replace('%', '')) || 0
                          const actualValue = parseFloat(String(evalRow[2] || '0').replace(/,/g, '')) || 0
                          const fitValue = parseFloat(String(evalRow[3] || '0').replace(/,/g, '')) || 0
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
                overall_price_difference_range: overallPriceDiffRange,
                forecast_value: forecastValue,
                probability: probability
              },
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
              p5_profit_loss_ratio: p5ProfitLossData || {
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
          
          if (p5Analysis) {
            setAnalysis(p5Analysis)
          } else if (parsedData) {
            setAnalysis(parsedData)
          } else if (record.core_data) {
            // 如果p5_analysis不存在，使用core_data构造基本数据
            const constructed: P5Analysis = {
              trading_recommendation: record.core_data.trading_recommendation,
              current_forecast: {
                date: record.core_data.current_forecast.date,
                current_value: record.core_data.current_forecast.high_expected_value,
                overall_price_difference_ratio: record.core_data.current_forecast.price_difference_ratio,
                overall_price_difference_range: record.core_data.current_forecast.price_difference_range,
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
              p5_profit_loss_ratio: {
                date: record.core_data.current_forecast.date,
                current_price: record.core_data.current_forecast.high_expected_value,
                evaluated_price: 0,
                price_difference_ratio: record.core_data.current_forecast.price_difference_ratio,
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
    <div className="p5-decision-panel">
      <SideMenu currentPage="strategy" />
      
      <div className="p5-decision-container">
        {/* 返回按钮 */}
        <button 
          className="p5-decision-back-button"
          onClick={handleBackClick}
          type="button"
          aria-label="返回上一级"
        >
          <span className="p5-decision-back-icon">←</span>
          <span className="p5-decision-back-text">返回</span>
        </button>

        <div className="p5-decision-page">
          {/* 页面标题 */}
          <p className="p5-decision-page-title">P5现货应用决策（42天后）</p>

          {loading ? (
            <div className="p5-decision-loading">
              <div className="p5-decision-loading-spinner"></div>
              <p>加载中...</p>
            </div>
          ) : error ? (
            <div className="p5-decision-error">
              <p>{error}</p>
            </div>
          ) : analysis ? (
            <>
              {/* 做空胜率统计 */}
              <div className="p5-decision-header">
                <div className="p5-decision-chips">
                  <button type="button" className="p5-decision-chip">做空胜率统计</button>
                  <button type="button" className="p5-decision-chip">
                    盈亏比：{analysis.trading_recommendation.profit_loss_ratio.toFixed(2)}：1
                  </button>
                </div>
              </div>

              {/* 主要内容区域 */}
              <div className="p5-decision-content">
                {/* 左侧策略卡片和右侧指标网格 */}
                <div className="p5-decision-cards-container">
                  {/* 左侧策略卡片 */}
                  <div className="p5-decision-card-left">
                    <span className="p5-decision-card-badge">空头策略</span>
                    <div className="p5-decision-card-glow" />
                    <div className="p5-decision-card-overlay">
                      <div className="p5-decision-card-title">
                        {analysis.trading_recommendation.recommended_direction}
                      </div>
                      <div className="p5-decision-card-desc">建议交易方向</div>
                    </div>
                  </div>

                  {/* 右侧指标网格 */}
                  <div className="p5-decision-metrics-grid">
                    <div className="p5-decision-metric-card">
                      <p className="p5-decision-metric-label">日期</p>
                      <p className="p5-decision-metric-value">{analysis.current_forecast.date}</p>
                    </div>
                    <div className="p5-decision-metric-card">
                      <p className="p5-decision-metric-label">当期值</p>
                      <p className="p5-decision-metric-value">
                        {analysis.current_forecast.current_value.toLocaleString()}
                      </p>
                    </div>
                    <div className="p5-decision-metric-card">
                      <p className="p5-decision-metric-label">综合价差比</p>
                      <p className="p5-decision-metric-value">{analysis.current_forecast.overall_price_difference_ratio}</p>
                    </div>
                    <div className="p5-decision-metric-card">
                      <p className="p5-decision-metric-label">综合价差比区间</p>
                      <p className="p5-decision-metric-value">{analysis.current_forecast.overall_price_difference_range}</p>
                    </div>
                    <div className="p5-decision-metric-card">
                      <p className="p5-decision-metric-label">2026-01-06预测值</p>
                      <p className="p5-decision-metric-value">
                        {analysis.current_forecast.forecast_value.toLocaleString()}
                      </p>
                    </div>
                    <div className="p5-decision-metric-card">
                      <p className="p5-decision-metric-label">在全部交易日期中出现概率</p>
                      <p className="p5-decision-metric-value">{analysis.current_forecast.probability}%</p>
                    </div>
                  </div>
                </div>

                {/* 正收益和负收益部分 */}
                <div className="p5-decision-returns-section">
                  <div className="p5-decision-returns-column positive">
                    <h3 className="p5-decision-returns-column-title">正收益</h3>
                    <div className="p5-decision-returns-header">
                      <div className="p5-decision-returns-bar positive-bar">
                        <span className="p5-decision-returns-value">{analysis.positive_returns.final_positive_returns_percentage}%</span>
                        <span className="p5-decision-returns-label">最终正收益占比</span>
                      </div>
                      <div className="p5-decision-returns-bar average-bar">
                        <span className="p5-decision-returns-value">{analysis.positive_returns.final_positive_returns_average}%</span>
                        <span className="p5-decision-returns-label">最终正收益平均值</span>
                      </div>
                    </div>

                    <div className="p5-decision-returns-card">
                      <p className="p5-decision-returns-card-title">分布情况</p>
                      <div className="p5-decision-returns-table">
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">正收益比例0~15%</span>
                          <span className="p5-decision-returns-table-value">{analysis.positive_returns.distribution['0-15%']}%</span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">正收益比例15.01~30%</span>
                          <span className="p5-decision-returns-table-value">{analysis.positive_returns.distribution['15.01-30%']}%</span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">正收益比例30~60%</span>
                          <span className="p5-decision-returns-table-value">{analysis.positive_returns.distribution['30-60%']}%</span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">正收益比例大于60%</span>
                          <span className="p5-decision-returns-table-value">{analysis.positive_returns.distribution['>60%']}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p5-decision-returns-card">
                      <p className="p5-decision-returns-card-title">收益统计</p>
                      <div className="p5-decision-returns-table">
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">最大正收益平均值</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.max_positive_returns_average || analysis.positive_returns.statistics.max_positive_returns_average}%
                          </span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">最大正收益最大值</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.max_positive_returns_maximum || analysis.positive_returns.statistics.max_positive_returns_maximum}%
                          </span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">最大正收益出现时间平均值</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.max_positive_returns_avg_time || analysis.positive_returns.statistics.max_positive_returns_avg_time}天
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p5-decision-returns-card">
                      <p className="p5-decision-returns-card-title">最大正收益平均出现天数</p>
                      <div className="p5-decision-returns-table">
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">0~14天内</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.timing_distribution['0-14_days'] || analysis.positive_returns.timing_distribution['0-14_days']}%
                          </span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">15~28天内</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.timing_distribution['15-28_days'] || analysis.positive_returns.timing_distribution['15-28_days']}%
                          </span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">29~42天内</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.timing_distribution['29-42_days'] || analysis.positive_returns.timing_distribution['29-42_days']}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 负收益部分 */}
                  <div className="p5-decision-returns-column negative">
                    <h3 className="p5-decision-returns-column-title">负收益</h3>
                    <div className="p5-decision-returns-header">
                      <div className="p5-decision-returns-bar negative-bar">
                        <span className="p5-decision-returns-value">{analysis.negative_returns.final_negative_returns_percentage}%</span>
                        <span className="p5-decision-returns-label">最终负收益比例</span>
                      </div>
                      <div className="p5-decision-returns-bar average-bar">
                        <span className="p5-decision-returns-value">{analysis.negative_returns.final_negative_returns_average}%</span>
                        <span className="p5-decision-returns-label">最终负收益平均值</span>
                      </div>
                    </div>

                    <div className="p5-decision-returns-card">
                      <p className="p5-decision-returns-card-title">分布情况</p>
                      <div className="p5-decision-returns-table">
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">负收益比例0~15%</span>
                          <span className="p5-decision-returns-table-value">{analysis.negative_returns.distribution['0-15%']}%</span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">负收益比例15.01~30%</span>
                          <span className="p5-decision-returns-table-value">{analysis.negative_returns.distribution['15.01-30%']}%</span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">负收益比例30~60%</span>
                          <span className="p5-decision-returns-table-value">{analysis.negative_returns.distribution['30-60%']}%</span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">负收益比例小于60%</span>
                          <span className="p5-decision-returns-table-value">{analysis.negative_returns.distribution['<60%']}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p5-decision-returns-card">
                      <p className="p5-decision-returns-card-title">收益统计</p>
                      <div className="p5-decision-returns-table">
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">最小负收益平均值</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.min_negative_returns_average || analysis.negative_returns.statistics.min_negative_returns_average}%
                          </span>
                        </div>
                        <div className="p5-decision-returns-table-row">
                          <span className="p5-decision-returns-table-label">最小负收益最小值</span>
                          <span className="p5-decision-returns-table-value">
                            {correctedStats?.min_negative_returns_minimum || analysis.negative_returns.statistics.min_negative_returns_minimum}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* P5盈亏比部分 */}
                {analysis.p5_profit_loss_ratio && (
                  <div className="p5-decision-profit-loss-section">
                    <p className="p5-decision-profit-loss-title">P5盈亏比</p>
                    <div className="p5-decision-profit-loss-summary">
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">日期</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.date}</p>
                      </div>
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">当前价格/元每吨</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.current_price.toLocaleString()}</p>
                      </div>
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">评估价格/元每吨</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.evaluated_price.toLocaleString()}</p>
                      </div>
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">价差比</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.price_difference_ratio}</p>
                      </div>
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">42天后盈利比例</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.profitability_ratio_after_42days}%</p>
                      </div>
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">收益均值</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.average_returns}%</p>
                      </div>
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">42天后亏损比例</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.loss_ratio_after_42days}%</p>
                      </div>
                      <div className="p5-decision-profit-loss-card">
                        <p className="p5-decision-profit-loss-label">亏损均值/元每吨</p>
                        <p className="p5-decision-profit-loss-value">{analysis.p5_profit_loss_ratio.average_loss}%</p>
                      </div>
                    </div>

                    <div className="p5-decision-profit-loss-timing">
                      <div className="p5-decision-profit-loss-timing-card">
                        <p className="p5-decision-profit-loss-timing-title">最大收益时间在各时间段的出现概率</p>
                        <div className="p5-decision-profit-loss-timing-grid">
                          <div className="p5-decision-profit-loss-timing-item">
                            <span className="p5-decision-profit-loss-timing-label">0~14天</span>
                            <span className="p5-decision-profit-loss-timing-value">{analysis.p5_profit_loss_ratio.max_returns_timing_distribution['0-14_days']}%</span>
                          </div>
                          <div className="p5-decision-profit-loss-timing-item">
                            <span className="p5-decision-profit-loss-timing-label">15天~28天</span>
                            <span className="p5-decision-profit-loss-timing-value">{analysis.p5_profit_loss_ratio.max_returns_timing_distribution['15-28_days']}%</span>
                          </div>
                          <div className="p5-decision-profit-loss-timing-item">
                            <span className="p5-decision-profit-loss-timing-label">29天~42天</span>
                            <span className="p5-decision-profit-loss-timing-value">{analysis.p5_profit_loss_ratio.max_returns_timing_distribution['29-42_days']}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="p5-decision-profit-loss-timing-card">
                        <p className="p5-decision-profit-loss-timing-title">最大风险时间在各时间段的出现概率</p>
                        <div className="p5-decision-profit-loss-timing-grid">
                          <div className="p5-decision-profit-loss-timing-item">
                            <span className="p5-decision-profit-loss-timing-label">0~14天</span>
                            <span className="p5-decision-profit-loss-timing-value">{analysis.p5_profit_loss_ratio.max_risk_timing_distribution['0-14_days']}%</span>
                          </div>
                          <div className="p5-decision-profit-loss-timing-item">
                            <span className="p5-decision-profit-loss-timing-label">15天~28天</span>
                            <span className="p5-decision-profit-loss-timing-value">{analysis.p5_profit_loss_ratio.max_risk_timing_distribution['15-28_days']}%</span>
                          </div>
                          <div className="p5-decision-profit-loss-timing-item">
                            <span className="p5-decision-profit-loss-timing-label">29天~42天</span>
                            <span className="p5-decision-profit-loss-timing-value">{analysis.p5_profit_loss_ratio.max_risk_timing_distribution['29-42_days']}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p5-decision-profit-loss-risk">
                      <div className="p5-decision-profit-loss-risk-card">
                        <p className="p5-decision-profit-loss-risk-label">最大风险均值/元每吨</p>
                        <p className="p5-decision-profit-loss-risk-value">{analysis.p5_profit_loss_ratio.max_risk_average}%</p>
                      </div>
                      <div className="p5-decision-profit-loss-risk-card">
                        <p className="p5-decision-profit-loss-risk-label">最大风险极值/元每吨</p>
                        <p className="p5-decision-profit-loss-risk-value">{analysis.p5_profit_loss_ratio.max_risk_extreme}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* P5TC六周后预测模型评价 */}
                <div className="p5-decision-model-section">
                  <p className="p5-decision-model-title">P5TC六周后预测模型评价</p>
                  <div className="p5-decision-model-summary">
                    <div className="p5-decision-model-summary-card">
                      <p className="p5-decision-model-summary-label">日期</p>
                      <p className="p5-decision-model-summary-value">{analysis.model_evaluation.date}</p>
                    </div>
                    <div className="p5-decision-model-summary-card">
                      <p className="p5-decision-model-summary-label">当前价格/元每吨</p>
                      <p className="p5-decision-model-summary-value">{analysis.model_evaluation.current_price.toLocaleString()}</p>
                    </div>
                    <div className="p5-decision-model-summary-card">
                      <p className="p5-decision-model-summary-label">预测42天后价差/元每吨</p>
                      <p className="p5-decision-model-summary-value">{analysis.model_evaluation.forecast_42day_price_difference.toLocaleString()}</p>
                    </div>
                    <div className="p5-decision-model-summary-card">
                      <p className="p5-decision-model-summary-label">预测42天后价格/元每吨</p>
                      <p className="p5-decision-model-summary-value">{analysis.model_evaluation.forecast_42day_price.toLocaleString()}</p>
                    </div>
                    <div className="p5-decision-model-summary-card">
                      <p className="p5-decision-model-summary-label">价差比</p>
                      <p className="p5-decision-model-summary-value">{analysis.model_evaluation.price_difference_ratio}</p>
                    </div>
                  </div>

                  {/* 评价表格 */}
                  <div className="p5-decision-model-table">
                    <div className="p5-decision-model-table-header">
                      <div className="p5-decision-model-table-header-cell">区间</div>
                      <div className="p5-decision-model-table-header-cell">历史判断正确率</div>
                      <div className="p5-decision-model-table-header-cell">历史预测实际值/元每吨</div>
                      <div className="p5-decision-model-table-header-cell">历史预测拟合值/元每吨</div>
                    </div>
                    {analysis.model_evaluation.evaluation_ranges.map((range, index) => (
                      <div key={index} className="p5-decision-model-table-row">
                        <div className="p5-decision-model-table-cell">{range.range}</div>
                        <div className="p5-decision-model-table-cell">{range.historical_accuracy_rate.toFixed(2)}%</div>
                        <div className="p5-decision-model-table-cell">{range.historical_actual_value.toLocaleString()}</div>
                        <div className="p5-decision-model-table-cell">{range.historical_fit_value.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p5-decision-error">
              <p>暂无数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default P5DecisionPage

