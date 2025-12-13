import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceDot
} from 'recharts';
import '../styles/PredictionPage.css';

// Types
interface UserPrediction {
    user: string;
    price: number;
    original: string;
    line_num: number;
}

interface MarketReference {
    date: string;
    price: number;
}

interface ApiResponse {
    code: number;
    msg: string;
    data: {
        user_predictions: {
            count: number;
            data: UserPrediction[];
        };
        market_references: {
            count: number;
            data: MarketReference[];
        };
    };
}

const PredictionPage: React.FC = () => {
    const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
    const [marketReferences, setMarketReferences] = useState<MarketReference[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://aqua.navgreen.cn/api/data/predict/data');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result: ApiResponse = await response.json();

                if (result.code === 200) {
                    setUserPredictions(result.data.user_predictions.data);
                    setMarketReferences(result.data.market_references.data);
                } else {
                    setError(result.msg || 'Unknown error occurred');
                }
            } catch (err) {
                console.error('Error fetching prediction data:', err);
                setError('Failed to load prediction data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate some stats
    const averagePrediction = userPredictions.length > 0
        ? userPredictions.reduce((acc, curr) => acc + curr.price, 0) / userPredictions.length
        : 0;

    const latestMarketPrice = marketReferences.length > 0
        ? marketReferences[marketReferences.length - 1].price
        : 0;

    // Sort predictions by proximity to latest market price
    const sortedPredictions = [...userPredictions].sort((a, b) => {
        const diffA = Math.abs(a.price - latestMarketPrice);
        const diffB = Math.abs(b.price - latestMarketPrice);
        return diffA - diffB;
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index}>
                            <p className="tooltip-item" style={{ color: entry.color }}>
                                {entry.name}: <strong>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</strong>
                            </p>
                            {/* Show extra info if available in payload */}
                            {entry.payload.user && (
                                <p className="tooltip-subitem" style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                    User: {entry.payload.user}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const UserTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">Order #{data.line_num}</p>
                    <p className="tooltip-item" style={{ color: '#e04f14' }}>
                        Prediction: <strong>${data.price.toLocaleString()}</strong>
                    </p>
                    <p className="tooltip-subitem" style={{ color: 'var(--text-secondary)' }}>
                        {data.user}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return <div className="prediction-page loading">Loading data...</div>;
    }

    if (error) {
        return <div className="prediction-page error">{error}</div>;
    }

    return (
        <div className="prediction-page">
            <div className="prediction-header">
                <h1 className="prediction-title">Aquabridge*吾爱首届FFA竞猜</h1>
                <p className="prediction-subtitle">Data Analysis & Market Predictions</p>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <p className="kpi-label">Latest Market Reference</p>
                    <p className="kpi-value">${latestMarketPrice.toLocaleString()}</p>
                    <p className="kpi-subtext">Date: {marketReferences[marketReferences.length - 1]?.date}</p>
                </div>
                <div className="kpi-card">
                    <p className="kpi-label">Average User Prediction</p>
                    <p className="kpi-value" style={{ color: '#e04f14' }}>${Math.round(averagePrediction).toLocaleString()}</p>
                    <p className="kpi-subtext">Across {userPredictions.length} participants</p>
                </div>
                <div className="kpi-card">
                    <p className="kpi-label">Total Participants</p>
                    <p className="kpi-value" style={{ color: 'var(--text-primary)' }}>{userPredictions.length}</p>
                    <p className="kpi-subtext">Verified Submissions</p>
                </div>
            </div>

            <section className="chart-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>📊</span> Market Reference Trend
                    </h2>
                </div>
                <div className="chart-container" style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={marketReferences}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4dabf7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4dabf7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                tickFormatter={(str) => str.slice(5)} // Show MM-DD
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#4dabf7"
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                name="Market Price"
                            />
                            {/* Highlight the last data point */}
                            {marketReferences.length > 0 && (
                                <ReferenceDot
                                    x={marketReferences[marketReferences.length - 1].date}
                                    y={marketReferences[marketReferences.length - 1].price}
                                    r={6}
                                    fill="#4dabf7"
                                    stroke="white"
                                />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="chart-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>📈</span> User Predictions Distribution
                    </h2>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={userPredictions}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="line_num"
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                label={{ value: 'Submission Order', position: 'insideBottom', offset: -5, fill: 'var(--text-tertiary)' }}
                            />
                            <YAxis
                                domain={[0, 40000]}
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip content={<UserTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            <Line
                                type="monotone"
                                dataKey="price"
                                name="User Predicted Price"
                                stroke="#e04f14"
                                strokeWidth={2}
                                dot={{ r: 2, fill: '#e04f14' }}
                                activeDot={{ r: 6 }}
                            />
                            {/* Reference Line for Average could be added here if needed */}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="table-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>🏆</span> Participants Ranking
                    </h2>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                        Sorted by proximity to Latest Market Price (${latestMarketPrice.toLocaleString()})
                    </p>
                </div>
                <div className="prediction-table-container">
                    <table className="prediction-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Participant</th>
                                <th>Prediction</th>
                                <th>Diff from Market</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPredictions.map((p, index) => {
                                const rank = index + 1;
                                const diff = p.price - latestMarketPrice;
                                const diffPercent = (diff / latestMarketPrice) * 100;

                                let rankClass = '';
                                let rankIcon = '';

                                if (rank === 1) {
                                    rankClass = 'rank-champion';
                                    rankIcon = '🥇 冠军';
                                } else if (rank >= 2 && rank <= 3) {
                                    rankClass = 'rank-runner-up';
                                    rankIcon = '🥈 亚军';
                                } else if (rank >= 4 && rank <= 6) {
                                    rankClass = 'rank-third';
                                    rankIcon = '🥉 季军';
                                } else {
                                    rankIcon = `#${rank}`;
                                }

                                return (
                                    <tr key={p.line_num}>
                                        <td className={`rank-cell ${rankClass}`}>
                                            {rankIcon}
                                        </td>
                                        <td>{p.user}</td>
                                        <td>${p.price.toLocaleString()}</td>
                                        <td className={Math.abs(diffPercent) < 5 ? 'text-green' : 'text-yellow'}>
                                            {diff > 0 ? '+' : ''}{Math.round(diff).toLocaleString()}
                                            <span style={{ fontSize: '0.8em', marginLeft: '4px', opacity: 0.8 }}>
                                                ({diffPercent.toFixed(1)}%)
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="footer-info">
                <p>Powered by Aquabridge & TZ Analysis System | © 2025 All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default PredictionPage;
