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

const P3AHistoricalForecastPage: React.FC = () => {
    const [data, setData] = useState<ForecastData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://aqua.navgreen.cn/api/backtest/backtest_P3A_historical_forecast_data')

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
                <p className="strategy-page-title">P3A历史预测回测分析</p>

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
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255, 255, 255, 0.5)"
                                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="rgba(255, 255, 255, 0.5)"
                                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1 }} />
                                    <Line
                                        type="monotone"
                                        dataKey="actual_price"
                                        name="现货价格"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#ffffff' }}
                                        connectNulls
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="forecast_42d"
                                        name="42天前预测价"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#3b82f6' }}
                                        connectNulls
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="forecast_14d"
                                        name="14天前预测价"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#10b981' }}
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

export default P3AHistoricalForecastPage
