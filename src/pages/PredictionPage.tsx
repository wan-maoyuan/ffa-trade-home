import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import '../styles/PredictionPage.css';

// Types
interface ChartData {
    index: number;
    individualGuess: number;
    marketPrice: number;
    prediction: number;
}

interface Participant {
    rank: number;
    id: string;
    guess: number;
    deviation: number;
    winRate: number;
}

const PredictionPage: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [finalPrice, setFinalPrice] = useState<number>(0);

    // Initialize data on mount
    useEffect(() => {
        const guessCount = 400;

        // 1. Generate Daily Settlement Prices (30 days)
        // Simulating the array from the reference HTML
        const dailySettlementPrices = [
            32000, 31500, 33000, 32500, 34000, 33500, 35000, 34500, 36000, 35500,
            37000, 36500, 38000, 37500, 37000, 36000, 35500, 34500, 33500, 32500,
            31500, 30500, 29500, 28500, 27500, 26500, 28000, 29000, 30000, 31000
        ];

        setFinalPrice(dailySettlementPrices[dailySettlementPrices.length - 1]);

        // 2. Generate Data Points
        const data: ChartData[] = [];
        const step = Math.ceil(guessCount / dailySettlementPrices.length);

        // Helper to generate individual guesses
        let currentGuess = 30000;
        const smoothness = 0.6;
        const maxJump = 7000;
        const targetMid = 30000;

        // Helper for prediction
        let currentPrediction = dailySettlementPrices[0] || 30000;
        const predSmoothness = 0.9;
        const followFactor = 0.5;

        for (let i = 0; i < guessCount; i++) {
            // Market Price (Step)
            const dailyIndex = Math.floor(i / step);
            const marketPrice = dailySettlementPrices[dailyIndex] || dailySettlementPrices[dailySettlementPrices.length - 1];

            // Individual Guess
            const randomChange = (Math.random() - 0.5) * maxJump * (1 - smoothness);
            const drift = (targetMid - currentGuess) * (1 - smoothness) * 0.05;
            currentGuess += randomChange + drift;
            currentGuess = Math.max(20000, Math.min(40000, currentGuess));

            // Aquabridge Prediction
            const changeTowardsMarket = (marketPrice - currentPrediction) * (1 - predSmoothness);
            const noise = (Math.random() - 0.5) * 500;
            currentPrediction += changeTowardsMarket * followFactor + noise;
            currentPrediction = Math.max(25000, Math.min(38000, currentPrediction));

            data.push({
                index: i + 1,
                individualGuess: Math.round(currentGuess),
                marketPrice: marketPrice,
                prediction: Math.round(currentPrediction)
            });
        }

        setChartData(data);
    }, []);

    // Mock Top 10 Data
    const topParticipants: Participant[] = [
        { rank: 1, id: 'Alpha_Seeker', guess: 41500, deviation: 0.5, winRate: 82.1 },
        { rank: 2, id: 'Cognito_A01', guess: 40250, deviation: 0.8, winRate: 79.5 },
        { rank: 3, id: 'TZ_System_B', guess: 39800, deviation: 1.1, winRate: 75.0 },
        { rank: 4, id: 'EV_Hunter', guess: 38900, deviation: 1.5, winRate: 70.8 },
        { rank: 5, id: 'Arbiter_X', guess: 42100, deviation: 2.0, winRate: 68.4 },
        { rank: 6, id: 'Profit_Maximizer', guess: 35500, deviation: 2.4, winRate: 63.0 },
        { rank: 7, id: 'Navy_Trader', guess: 43500, deviation: 3.0, winRate: 59.9 },
        { rank: 8, id: 'Future_Sailor', guess: 33000, deviation: 3.5, winRate: 55.2 },
        { rank: 9, id: 'Risk_Taker_99', guess: 45000, deviation: 4.1, winRate: 51.1 },
        { rank: 10, id: 'Value_Finder', guess: 30500, deviation: 4.6, winRate: 48.0 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">Submission Order: {label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="tooltip-item" style={{ color: entry.color }}>
                            {entry.name}: <strong>${entry.value.toLocaleString()}</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="prediction-page">
            <div className="prediction-header">
                <h1 className="prediction-title">Aquabridge*吾爱首届FFA竞猜</h1>
                <p className="prediction-subtitle">Data Analysis & Market Predictions</p>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <p className="kpi-label">Final C5TC Jan Settlement Price</p>
                    <p className="kpi-value">${finalPrice.toLocaleString()}</p>
                    <p className="kpi-subtext">Settlement Date: 2026-01-09</p>
                </div>
                <div className="kpi-card">
                    <p className="kpi-label">Total Participants</p>
                    <p className="kpi-value" style={{ color: 'var(--text-primary)' }}>400</p>
                    <p className="kpi-subtext">Based on submission order</p>
                </div>
            </div>

            <section className="chart-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>📈</span> Distribution vs. Market Reference
                    </h2>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="index"
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                label={{ value: 'Submission Order', position: 'insideBottom', offset: -5, fill: 'var(--text-tertiary)' }}
                            />
                            <YAxis
                                domain={[10000, 40000]}
                                stroke="var(--text-tertiary)"
                                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            <Line
                                type="monotone"
                                dataKey="individualGuess"
                                name="Individual Guess"
                                stroke="#e04f14"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="step"
                                dataKey="marketPrice"
                                name="Market Reference"
                                stroke="#4dabf7"
                                strokeWidth={3}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="prediction"
                                name="Aquabridge Prediction"
                                stroke="#10b981"
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="table-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span>🏆</span> Top 10 Participants
                    </h2>
                </div>
                <div className="prediction-table-container">
                    <table className="prediction-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Participant ID</th>
                                <th>Latest Guess</th>
                                <th>Avg. Deviation</th>
                                <th>Win Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topParticipants.map((p) => (
                                <tr key={p.rank}>
                                    <td className={`rank-cell rank-${p.rank}`}>
                                        {p.rank === 1 ? '🥇 ' : p.rank === 2 ? '🥈 ' : p.rank === 3 ? '🥉 ' : ''}
                                        {p.rank}
                                    </td>
                                    <td>{p.id}</td>
                                    <td>${p.guess.toLocaleString()}</td>
                                    <td className={p.deviation < 1 ? 'text-green' : p.deviation < 3 ? 'text-yellow' : 'text-red'}>
                                        {p.deviation}%
                                    </td>
                                    <td>{p.winRate}%</td>
                                </tr>
                            ))}
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
