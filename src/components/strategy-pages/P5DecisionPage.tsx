import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../SideMenu'
import './StrategyPageOptimization.css'
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
            // Row 28: ['P5盈亏比']
            // Row 29: ['2025-11-25', '18425', '16239', '-12%'] - 数据行
            // Row 30: ['日期', '当前价格/元每吨', '评估价格/元每吨', '价差比'] - 标题行
            // Row 32: ['76%', '19%', '24%', '9%'] - 数据行（42天后盈利比例、收益均值、42天后亏损比例、亏损均值）
            // Row 33: ['42天后盈利比例', '收益均值', '42天后亏损比例', '亏损均值/元每吨'] - 标题行
            // Row 36: ['49%', '24%', '27%'] - 最大收益时间数据
            // Row 37: ['-7%', '-23%'] - 最大风险均值、最大风险极值
            // Row 41: ['62%', '15%', '24%'] - 最大风险时间数据
            let p5ProfitLossData: P5ProfitLossRatio | null = null
            for (let i = 0; i < rawTableData.length; i++) {
              const row = rawTableData[i]
              if (Array.isArray(row) && row.length > 0 && row[0] === 'P5盈亏比') {
                // Row 29: 数据行（日期、当前价格、评估价格、价差比）
                if (i + 1 < rawTableData.length) {
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 4) {
                    const p5Date = String(dataRow[0] || '')
                    const p5CurrentPrice = parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0
                    const p5EvaluatedPrice = parseFloat(String(dataRow[2] || '0').replace(/,/g, '')) || 0
                    const p5PriceDiffRatio = String(dataRow[3] || '')

                    // 初始化变量
                    let profitabilityRatio = 0
                    let averageReturns = 0
                    let lossRatio = 0
                    let averageLoss = 0
                    let maxReturnsTiming = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }
                    let maxRiskAverage = 0
                    let maxRiskExtreme = 0
                    let maxRiskTiming = { '0-14_days': 0, '15-28_days': 0, '29-42_days': 0 }

                    // 查找后续数据（从i+2开始，跳过标题行）
                    // Row 30: 标题行（日期、当前价格/元每吨、评估价格/元每吨、价差比）
                    // Row 32: 数据行（42天后盈利比例、收益均值、42天后亏损比例、亏损均值）
                    // Row 33: 标题行（42天后盈利比例、收益均值、42天后亏损比例、亏损均值/元每吨）
                    for (let j = i + 2; j < rawTableData.length && j < i + 15; j++) {
                      const checkRow = rawTableData[j]
                      if (Array.isArray(checkRow) && checkRow.length > 0) {
                        // Row 32: 数据行（42天后盈利比例、收益均值、42天后亏损比例、亏损均值）
                        // 检查是否是数据行（4个百分比值），且下一行是标题行
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
                        // Row 6: ['最大收益时间在各时间段的出现概率'] - 标题
                        // Row 7: ['0～14天', '15天～28天', '29天～42天'] - 标题行
                        // Row 8: ['49%', '24%', '27%'] - 数据行
                        if (checkRow[0] === '最大收益时间在各时间段的出现概率' && j + 2 < rawTableData.length) {
                          const timingDataRow = rawTableData[j + 2]
                          if (Array.isArray(timingDataRow) && timingDataRow.length >= 3 &&
                            String(timingDataRow[0] || '').includes('%')) {
                            maxReturnsTiming['0-14_days'] = parseFloat(String(timingDataRow[0] || '0').replace('%', '')) || 0
                            maxReturnsTiming['15-28_days'] = parseFloat(String(timingDataRow[1] || '0').replace('%', '')) || 0
                            maxReturnsTiming['29-42_days'] = parseFloat(String(timingDataRow[2] || '0').replace('%', '')) || 0
                          }
                        }
                        // Row 37: ['-7%', '-23%'] - 数据行（最大风险均值、最大风险极值）
                        // Row 38: ['最大风险均值/元每吨', '最大风险极值/元每吨'] - 标题行
                        // 检查是否是数据行（2个百分比值），且下一行是标题行
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
                        // Row 11: ['最大风险时间在各时间段的出现概率'] - 标题
                        // Row 12: ['0～14天', '15天～28天', '29天～42天'] - 标题行
                        // Row 13: ['62%', '15%', '24%'] - 数据行
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
            // Row 42: ['P5TC六周后预测模型评价']
            // Row 43: ['2025-11-14', '16903', '2025-12-26', '1106', '18008', '7%'] - 数据行
            // Row 44: ['日期', '当前价格/元每吨', '预测42天后价差/元每吨', '预测42天后价格/元每吨', '价差比'] - 标题行
            // Row 45: ['区间', '历史判断正确率', '历史预测实际值/元每吨', '历史预测拟合值/元每吨'] - 表格标题
            // Row 46-51: 表格数据行
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
                  // Row 43: 数据行
                  const dataRow = rawTableData[i + 1]
                  if (Array.isArray(dataRow) && dataRow.length >= 6) {
                    modelEvalDate = String(dataRow[0] || '')
                    modelEvalCurrentPrice = parseFloat(String(dataRow[1] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastDiff = parseFloat(String(dataRow[3] || '0').replace(/,/g, '')) || 0
                    modelEvalForecastPrice = parseFloat(String(dataRow[4] || '0').replace(/,/g, '')) || 0
                    modelEvalPriceDiffRatio = String(dataRow[5] || '')
                  }
                  // 查找评价表格数据（从Row 46开始，跳过Row 44和Row 45标题行）
                  // Row 45: ['区间', '历史判断正确率', '历史预测实际值/元每吨', '历史预测拟合值/元每吨'] - 表格标题
                  // Row 46-51: 表格数据行
                  for (let j = i + 4; j < rawTableData.length; j++) {
                    const evalRow = rawTableData[j]
                    if (Array.isArray(evalRow) && evalRow.length >= 4) {
                      const firstCol = String(evalRow[0] || '')
                      const secondCol = String(evalRow[1] || '')

                      // 检查是否是表格数据行
                      // 格式1: ['<-5000', '100.00%', '-5304', '-6110'] - 4列，单列区间
                      // 格式2: ['-5000', '-2500', '95.65%', '-4006', '-3705'] - 5列，两列区间
                      // 格式3: ['>=5000', '100.00%', '8085', '6203'] - 4列，单列区间

                      // 判断是否是数据行：
                      // 1. 第一列包含区间符号（<, >, =）或纯数字
                      // 2. 第二列是百分比（单列区间）或第三列是百分比（两列区间）
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
    <div className="strategy-page">

      <div className="strategy-page-content-wrapper" style={{ width: '100%' }}>
        <p className="strategy-page-title">P5现货应用决策（42天后）</p>

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
          <div className="strategy-page-content">
            {/* 头部标签 */}
            <div className="strategy-tags">
              <div className="strategy-tag">
                <p>做空胜率统计</p>
              </div>
              <div className="strategy-tag">
                <p>盈亏比：{analysis.trading_recommendation.profit_loss_ratio.toFixed(2)}：1</p>
              </div>
            </div>

            {/* 主要内容区域 */}
            <div className="strategy-content-card">
              <div className="strategy-layout-grid">
                {/* 左侧策略卡片 */}
                <div className="strategy-direction-card">
                  <div className="strategy-direction-badge">空头策略</div>
                  <div className="strategy-direction-title">
                    {analysis.trading_recommendation.recommended_direction}
                  </div>
                  <div className="strategy-direction-subtitle">建议交易方向</div>
                </div>

                {/* 右侧指标网格 */}
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
                    <p className="strategy-metric-label">2026-01-06预测值</p>
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

            {/* P5盈亏比部分 */}
            {analysis.p5_profit_loss_ratio && (
              <div className="strategy-content-card" style={{ marginTop: '20px' }}>
                <p className="strategy-page-title" style={{ fontSize: '18px', textAlign: 'left', marginBottom: '16px' }}>P5盈亏比</p>

                {/* 基础指标网格 */}
                <div className="strategy-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '24px' }}>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">日期</p>
                    <p className="strategy-metric-value">{analysis.p5_profit_loss_ratio.date}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">当前价格/元每吨</p>
                    <p className="strategy-metric-value">{analysis.p5_profit_loss_ratio.current_price.toLocaleString()}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">评估价格/元每吨</p>
                    <p className="strategy-metric-value">{analysis.p5_profit_loss_ratio.evaluated_price.toLocaleString()}</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">价差比</p>
                    <p className="strategy-metric-value" style={{ color: parseFloat(analysis.p5_profit_loss_ratio.price_difference_ratio) >= 0 ? '#4ade80' : '#f87171' }}>
                      {analysis.p5_profit_loss_ratio.price_difference_ratio}
                    </p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">42天后盈利比例</p>
                    <p className="strategy-metric-value" style={{ color: '#4ade80' }}>{analysis.p5_profit_loss_ratio.profitability_ratio_after_42days}%</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">收益均值</p>
                    <p className="strategy-metric-value" style={{ color: '#4ade80' }}>{analysis.p5_profit_loss_ratio.average_returns}%</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">42天后亏损比例</p>
                    <p className="strategy-metric-value" style={{ color: '#f87171' }}>{analysis.p5_profit_loss_ratio.loss_ratio_after_42days}%</p>
                  </div>
                  <div className="strategy-metric-item">
                    <p className="strategy-metric-label">亏损均值/元每吨</p>
                    <p className="strategy-metric-value" style={{ color: '#f87171' }}>{analysis.p5_profit_loss_ratio.average_loss}</p>
                  </div>
                </div>

                {/* 最大收益时间分布表格 */}
                <div style={{ marginBottom: '24px', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '10px', textAlign: 'center', borderBottom: '1px solid rgba(74, 222, 128, 0.1)' }}>
                    <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: 'bold', fontFamily: 'DengXian' }}>最大收益时间在各时间段的出现概率</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: '12px', color: '#4ade80', marginBottom: '4px' }}>0~14天</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{analysis.p5_profit_loss_ratio.max_returns_timing_distribution['0-14_days']}%</p>
                    </div>
                    <div style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: '12px', color: '#4ade80', marginBottom: '4px' }}>15~28天</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{analysis.p5_profit_loss_ratio.max_returns_timing_distribution['15-28_days']}%</p>
                    </div>
                    <div style={{ padding: '12px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#4ade80', marginBottom: '4px' }}>29~42天</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{analysis.p5_profit_loss_ratio.max_returns_timing_distribution['29-42_days']}%</p>
                    </div>
                  </div>
                </div>

                {/* 风险统计 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f87171', margin: '0 0 8px 0', fontFamily: 'Roboto' }}>
                      {analysis.p5_profit_loss_ratio.max_risk_average}%
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>最大风险均值/元每吨</p>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f87171', margin: '0 0 8px 0', fontFamily: 'Roboto' }}>
                      {analysis.p5_profit_loss_ratio.max_risk_extreme}%
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>最大风险极值/元每吨</p>
                  </div>
                </div>

                {/* 最大风险时间分布表格 */}
                <div style={{ border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(248, 113, 113, 0.1)', padding: '10px', textAlign: 'center', borderBottom: '1px solid rgba(248, 113, 113, 0.1)' }}>
                    <span style={{ color: '#f87171', fontSize: '13px', fontWeight: 'bold', fontFamily: 'DengXian' }}>最大风险时间在各时间段的出现概率</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: '12px', color: '#f87171', marginBottom: '4px' }}>0~14天</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{analysis.p5_profit_loss_ratio.max_risk_timing_distribution['0-14_days']}%</p>
                    </div>
                    <div style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ fontSize: '12px', color: '#f87171', marginBottom: '4px' }}>15~28天</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{analysis.p5_profit_loss_ratio.max_risk_timing_distribution['15-28_days']}%</p>
                    </div>
                    <div style={{ padding: '12px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#f87171', marginBottom: '4px' }}>29~42天</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{analysis.p5_profit_loss_ratio.max_risk_timing_distribution['29-42_days']}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
          <div className="p5-decision-error">
            <p>暂无数据</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default P5DecisionPage

