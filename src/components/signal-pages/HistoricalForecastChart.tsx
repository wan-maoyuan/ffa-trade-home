import React, { useEffect, useState } from 'react'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Line
} from 'recharts'
import './RealtimeSignalPage.css'

interface HistoricalData {
    date: string
    actual_price: number | null
    forecast_42d: number | null
    forecast_14d: number | null
}

interface HistoricalForecastChartProps {
    contractName: string
}

const HistoricalForecastChart: React.FC<HistoricalForecastChartProps> = ({ contractName }) => {
    const [data, setData] = useState<HistoricalData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getApiUrl = (name: string) => {
        if (name.includes('C5TC')) {
            return 'https://aqua.navgreen.cn/api/backtest/backtest_C5TC_historical_forecast_data'
        }
        if (name.includes('P5TC')) {
            return 'https://aqua.navgreen.cn/api/backtest/backtest_P5TC_historical_forecast_data'
        }
        return null
    }

    useEffect(() => {
        const fetchHistory = async () => {
            const url = getApiUrl(contractName)
            if (!url) {
                setData([])
                return
            }

            setLoading(true)
            setError(null)

            try {
                const response = await fetch(url, {
                    headers: { 'accept': 'application/json' }
                })

                const result = await response.json()

                if (result.code === 200 && Array.isArray(result.data?.records)) {
                    const rawItems = result.data.records
                    // Sort by date ascending
                    const sortedData = [...rawItems]
                        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((item: any) => ({
                            ...item,
                            // Calculate deviation if both exist
                            deviation: (item.actual_price && item.forecast_42d)
                                ? (item.actual_price - item.forecast_42d).toFixed(2)
                                : null
                        }))

                    setData(sortedData)
                } else {
                    console.warn('Unexpected data structure:', result)
                    setData([])
                }
            } catch (err) {
                console.error('Fetch error:', err)
                setError('加载历史数据失败')
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [contractName])

    // Date filtering state
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [filteredData, setFilteredData] = useState<HistoricalData[]>([])

    // Initialize dates when data loads
    useEffect(() => {
        if (data.length > 0) {
            // Default to All
            setFilteredData(data)
            // Set inputs to data range for display
            if (data.length > 0) {
                // data is sorted ascending
                setStartDate(data[0].date)
                setEndDate(data[data.length - 1].date)
            }
        }
    }, [data])

    // Filter data when dates change
    useEffect(() => {
        if (data.length === 0 || !startDate || !endDate) return

        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        const filtered = data.filter(item => {
            const itemDate = new Date(item.date).getTime()
            return itemDate >= start && itemDate <= end
        })
        setFilteredData(filtered)
    }, [startDate, endDate, data])

    const handleQuickSelect = (months: number | 'all') => {
        if (data.length === 0) return

        const lastDate = new Date(data[data.length - 1].date)
        const newEndDate = data[data.length - 1].date

        if (months === 'all') {
            setStartDate(data[0].date)
            setEndDate(newEndDate)
            return
        }

        const newStartDate = new Date(lastDate)
        newStartDate.setMonth(lastDate.getMonth() - months)

        setStartDate(newStartDate.toISOString().split('T')[0])
        setEndDate(newEndDate)
    }

    if (!getApiUrl(contractName)) return null

    if (loading) {
        return (
            <div className="historical-chart-container loading">
                <div className="realtime-signal-loading-spinner"></div>
            </div>
        )
    }

    // Hide component if no data or error
    if (error || data.length === 0) {
        return null
    }

    return (
        <div className="historical-chart-container">
            <div className="historical-chart-header">
                <div className="historical-chart-title-group">
                    <span className="historical-chart-title">历史预测数据对比 ({contractName})</span>
                </div>

                <div className="historical-chart-controls">
                    <div className="date-picker-group">
                        <input
                            type="date"
                            className="glass-date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate}
                        />
                        <span className="date-separator">-</span>
                        <input
                            type="date"
                            className="glass-date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                        />
                    </div>
                    <div className="quick-ranges">
                        <button onClick={() => handleQuickSelect(1)} className="range-btn">1M</button>
                        <button onClick={() => handleQuickSelect(3)} className="range-btn">3M</button>
                        <button onClick={() => handleQuickSelect(6)} className="range-btn">6M</button>
                        <button onClick={() => handleQuickSelect('all')} className="range-btn active">All</button>
                    </div>
                </div>

                <div className="historical-chart-legend">
                    <span className="legend-item"><span className="dot spot"></span>实际价格</span>
                    <span className="legend-item"><span className="dot forecast"></span>预测价格 (42d)</span>
                </div>
            </div>
            <div className="historical-chart-content">
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorDev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={11}
                            tickFormatter={(value) => {
                                try {
                                    const d = new Date(value)
                                    return `${d.getMonth() + 1} -${d.getDate()} `
                                } catch { return value }
                            }}
                            minTickGap={30}
                        />
                        <YAxis
                            yAxisId="price"
                            stroke="#94a3b8"
                            fontSize={11}
                            domain={['auto', 'auto']}
                            tickFormatter={(val) => val.toLocaleString()}
                            width={50}
                        />
                        {/* Secondary Axis for Deviation if we want to show it as bars? 
                        Or just keep simple line chart first. 
                        Let's stick to dual lines for now as it's cleaner for comparison, 
                        maybe add error bars later. For "Design", dual lines are standard.
                    */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#e2e8f0',
                                fontSize: '12px'
                            }}
                            itemStyle={{ padding: '2px 0' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                            formatter={(value: any, name: string) => {
                                if (name === 'deviation') return [value, '偏差 (Actual - Forecast)']
                                if (name === 'actual_price') return [Number(value).toLocaleString(), '实际价格']
                                if (name === 'forecast_42d') return [Number(value).toLocaleString(), '预测价格 (42d)']
                                return [value, name]
                            }}
                        />

                        <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="actual_price"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                        />
                        <Line
                            yAxisId="price"
                            type="monotone"
                            dataKey="forecast_42d"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            strokeDasharray="4 4"
                            dot={false}
                            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
export default HistoricalForecastChart
