import React, { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import './P5HistoricalForecastPage.css'

interface ForecastData {
    date: string
    actual_price: number | null
    forecast_42d: number | null
    forecast_14d: number | null
}

interface ApiResponse {
    code: number
    msg: string
    data: {
        date: string | null
        count: number
        records: ForecastData[]
    }
}

const P6HistoricalForecastPage: React.FC = () => {
    const { theme } = useTheme()
    const [data, setData] = useState<ForecastData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 主题颜色配置
    const chartColors = {
        dark: {
            grid: 'rgba(255, 255, 255, 0.1)',
            axisStroke: 'rgba(255, 255, 255, 0.5)',
            axisTick: 'rgba(255, 255, 255, 0.5)',
            axisLine: 'rgba(255, 255, 255, 0.1)',
            cursor: 'rgba(255, 255, 255, 0.2)',
            actualPrice: '#ffffff',
            forecast42d: '#3b82f6',
            forecast14d: '#10b981',
        },
        light: {
            grid: 'rgba(0, 0, 0, 0.08)',
            axisStroke: 'rgba(71, 85, 105, 0.8)',
            axisTick: 'rgba(71, 85, 105, 0.8)',
            axisLine: 'rgba(148, 163, 184, 0.3)',
            cursor: 'rgba(0, 0, 0, 0.1)',
            actualPrice: '#1e293b',
            forecast42d: '#2563eb',
            forecast14d: '#16a34a',
        }
    }

    const colors = chartColors[theme]

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://aqua.navgreen.cn/api/backtest/backtest_P6_historical_forecast_data')

                if (!response.ok) {
                    throw new Error('网络请求失败')
                }

                const result: ApiResponse = await response.json()

                if (result.code === 200 && result.data.records) {
                    // Sort data by date ascending for the chart
                    const sortedData = [...result.data.records].sort((a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    setData(sortedData)
                } else {
                    throw new Error('数据格式错误')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '加载数据失败')
                console.error('获取历史预测数据失败:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-date">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value?.toLocaleString()}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="strategy-page p5-historical-page">
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
                ) : (
                    <div className="strategy-content-card chart-container-card">
                        <div className="chart-header">
                            <h3>现货价格 vs 预测价格走势对比</h3>
                            <div className="chart-legend-custom">
                                <div className="legend-item">
                                    <span className="dot actual"></span>
                                    <span>现货价格</span>
                                </div>
                                <div className="legend-item">
                                    <span className="dot forecast-42"></span>
                                    <span>42天前预测价</span>
                                </div>
                                <div className="legend-item">
                                    <span className="dot forecast-14"></span>
                                    <span>14天前预测价</span>
                                </div>
                            </div>
                        </div>

                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={500}>
                                <LineChart
                                    data={data}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke={colors.axisStroke}
                                        tick={{ fill: colors.axisTick, fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={{ stroke: colors.axisLine }}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke={colors.axisStroke}
                                        tick={{ fill: colors.axisTick, fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: colors.cursor, strokeWidth: 1 }} />
                                    <Line
                                        type="monotone"
                                        dataKey="actual_price"
                                        name="现货价格"
                                        stroke={colors.actualPrice}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, fill: colors.actualPrice }}
                                        connectNulls
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="forecast_42d"
                                        name="42天前预测价"
                                        stroke={colors.forecast42d}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, fill: colors.forecast42d }}
                                        connectNulls
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="forecast_14d"
                                        name="14天前预测价"
                                        stroke={colors.forecast14d}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, fill: colors.forecast14d }}
                                        connectNulls
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default P6HistoricalForecastPage
