import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
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
    ReferenceDot,
    ReferenceLine
} from 'recharts';
import '../styles/PredictionPage.css';
import { fetchWithRetry } from '../utils/api';

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
                const response = await fetchWithRetry('https://aqua.navgreen.cn/api/data/predict/data', {
                    timeout: 8000, // 8s timeout
                    retries: 3
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
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

    // Language State
    const [lang, setLang] = useState<'zh' | 'en'>('zh');
    // Global Theme
    const { theme } = useTheme();

    // Theme Colors
    const themeColors = {
        dark: {
            textSecondary: 'var(--text-secondary)',
            textTertiary: 'var(--text-tertiary)',
            grid: 'rgba(255,255,255,0.1)',
            marketLine: '#4dabf7',
            marketFill: '#4dabf7',
            userLine: '#e04f14',
            tooltipBg: 'var(--bg-card)',
            referenceLine: '#4ADE80'
        },
        light: {
            textSecondary: 'var(--text-secondary)',
            textTertiary: 'var(--text-tertiary)',
            grid: 'rgba(0,0,0,0.08)',
            marketLine: '#2563EB', // Blue-600
            marketFill: '#3B82F6', // Blue-500
            userLine: '#EA580C', // Orange-600
            tooltipBg: 'var(--bg-card)',
            referenceLine: '#16A34A' // Green-600
        }
    };
    const colors = themeColors[theme];

    // Translations
    const t = {
        zh: {
            title: 'Aquabridge*吾爱首届FFA竞猜',
            subtitle: '数据分析 & 市场预测(from AquaBridge.ai)',
            latestRef: '最新市场 5TC_C+1MON JAN 26 参考价',
            date: '日期',
            avgPred: '用户平均预测',
            participants: '参与人数',
            across: '共计',
            verified: '有效提交',
            marketTrend: '市场参考价趋势',
            dist: '用户预测分布',
            ranking: '参与者排名',
            sortedBy: '按与最新市场价 ($PRICE) 的接近程度排序',
            rank: '排名',
            user: '参与者',
            pred: '预测价格',
            diff: '偏差',
            order: '提交顺序',
            loading: '正在加载数据...',
            error: '加载失败，请稍后重试。'
        },
        en: {
            title: 'Aquabridge * WuAi 1st FFA Prediction',
            subtitle: 'Data Analysis & Market Predictions',
            latestRef: 'Latest Market Reference',
            date: 'Date',
            avgPred: 'Average User Prediction',
            participants: 'Total Participants',
            across: 'Across',
            verified: 'Verified Submissions',
            marketTrend: 'Market Reference Trend',
            dist: 'User Predictions Distribution',
            ranking: 'Participants Ranking',
            sortedBy: 'Sorted by proximity to Latest Market Price ($PRICE)',
            rank: 'Rank',
            user: 'Participant',
            pred: 'Prediction',
            diff: 'Diff from Market',
            order: 'Submission Order',
            loading: 'Loading data...',
            error: 'Failed to load data. Please try again later.'
        }
    };

    // Icons
    const MedalIcon = ({ rank }: { rank: number }) => {

        const stops = rank === 1
            ? <><stop offset="5%" stopColor="#FFD700" /><stop offset="95%" stopColor="#FDB931" /></>
            : rank <= 3
                ? <><stop offset="5%" stopColor="#E0E0E0" /><stop offset="95%" stopColor="#A0A0A0" /></>
                : <><stop offset="5%" stopColor="#CD7F32" /><stop offset="95%" stopColor="#8B4513" /></>;

        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="medal-icon">
                <defs>
                    <linearGradient id={`medal-grad-${rank}`} x1="0" y1="0" x2="1" y2="1">
                        {stops}
                    </linearGradient>
                </defs>
                <path d="M12 15C15.866 15 19 11.866 19 8V2H5V8C5 11.866 8.13401 15 12 15Z" fill={`url(#medal-grad-${rank})`} stroke="none" />
                <path d="M5 2L12 15L19 2" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <circle cx="12" cy="8" r="3" fill="rgba(255,255,255,0.2)" />
                <path d="M12 15V22" stroke={`url(#medal-grad-${rank})`} strokeWidth="2" />
                <circle cx="12" cy="22" r="2" fill={`url(#medal-grad-${rank})`} />
            </svg>
        );
    };

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
        if (diffA === diffB) {
            // If diff is same, sort by line_num (earlier submission first)
            return a.line_num - b.line_num;
        }
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
                                <p className="tooltip-subitem" style={{ color: colors.textTertiary, fontSize: '0.8rem' }}>
                                    {t[lang].user}: {entry.payload.user}
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
                    <p className="tooltip-label">{t[lang].order} #{data.line_num}</p>
                    <p className="tooltip-item" style={{ color: '#e04f14' }}>
                        {t[lang].pred}: <strong>${data.price.toLocaleString()}</strong>
                    </p>
                    <p className="tooltip-subitem" style={{ color: colors.textSecondary }}>
                        {data.user}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return <div className="prediction-page loading">{t[lang].loading}</div>;
    }

    if (error) {
        return <div className="prediction-page error">{t[lang].error}</div>;
    }

    // Get top 6 winners
    const topWinners = sortedPredictions.slice(0, 6);

    return (
        <div className="prediction-page">
            <div className="prediction-header-content">
                <div>
                    <h1 className="prediction-title">{t[lang].title}</h1>
                    <p className="prediction-subtitle">{t[lang].subtitle}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="lang-toggle"
                        onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
                    >
                        {lang === 'zh' ? 'EN' : ' 中'}
                    </button>
                </div>
            </div>

            {/* Winners Hierarchical Section */}
            {topWinners.length > 0 && (
                <div className="winners-section">
                    {/* Date Condition Label */}
                    <div className="winners-date-label">
                        <span style={{ marginRight: '6px', opacity: 0.8 }}>📅</span>
                        {lang === 'zh' ? '截止日期' : 'As of'}: {marketReferences.length > 0 ? marketReferences[marketReferences.length - 1].date : '-'}
                    </div>

                    {/* 1. Champion Row */}
                    {topWinners[0] && (
                        <div className="champion-row">
                            <div className="winner-card rank-1">
                                <div className="winner-medal">
                                    <MedalIcon rank={1} />
                                </div>
                                <div className="winner-content">
                                    <div className="winner-rank">{lang === 'zh' ? '冠军' : 'Champion'}</div>
                                    <div className="winner-name">{topWinners[0].user}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Runners-up Row (2 people) */}
                    <div className="runners-up-row">
                        {topWinners.slice(1, 3).map((winner) => (
                            <div key={winner.line_num} className="winner-card rank-2">
                                <div className="winner-medal">
                                    <MedalIcon rank={2} />
                                </div>
                                <div className="winner-content">
                                    <div className="winner-rank">{lang === 'zh' ? '亚军' : 'Runner-up'}</div>
                                    <div className="winner-name">{winner.user}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 3. Third Place Row (3 people) */}
                    <div className="third-place-row">
                        {topWinners.slice(3, 6).map((winner) => (
                            <div key={winner.line_num} className="winner-card rank-3">
                                <div className="winner-medal">
                                    <MedalIcon rank={3} />
                                </div>
                                <div className="winner-content">
                                    <div className="winner-rank">{lang === 'zh' ? '季军' : 'Third Place'}</div>
                                    <div className="winner-name">{winner.user}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="kpi-grid">
                <div className="kpi-card">
                    <p className="kpi-label">{t[lang].latestRef}</p>
                    <p className="kpi-value">${latestMarketPrice.toLocaleString()}</p>
                    <p className="kpi-subtext">{t[lang].date}: {marketReferences[marketReferences.length - 1]?.date}</p>
                </div>
                <div className="kpi-card">
                    <p className="kpi-label">{t[lang].avgPred}</p>
                    <p className="kpi-value" style={{ color: '#e04f14' }}>${Math.round(averagePrediction).toLocaleString()}</p>
                    <p className="kpi-subtext">{t[lang].across} {userPredictions.length} {lang === 'zh' ? '位参与者' : 'participants'}</p>
                </div>
                <div className="kpi-card">
                    <p className="kpi-label">{t[lang].participants}</p>
                    <p className="kpi-value" style={{ color: 'var(--pp-text-primary)' }}>{userPredictions.length}</p>
                    <p className="kpi-subtext">{t[lang].verified}</p>
                </div>
            </div>

            <section className="chart-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#4dabf7' }}>
                            <path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                        </svg>
                        {t[lang].marketTrend}
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
                                    <stop offset="5%" stopColor={colors.marketFill} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={colors.marketFill} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke={colors.textTertiary}
                                tick={{ fill: colors.textTertiary, fontSize: 12 }}
                                tickFormatter={(str) => str.slice(5)} // Show MM-DD
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                stroke={colors.textTertiary}
                                tick={{ fill: colors.textTertiary, fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={colors.marketLine}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                name={lang === 'zh' ? '市场价格' : 'Market Price'}
                            />
                            {/* Highlight the last data point */}
                            {marketReferences.length > 0 && (
                                <ReferenceDot
                                    x={marketReferences[marketReferences.length - 1].date}
                                    y={marketReferences[marketReferences.length - 1].price}
                                    r={6}
                                    fill={colors.marketLine}
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#e04f14' }}>
                            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        {t[lang].dist}
                    </h2>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={userPredictions}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                            <XAxis
                                dataKey="line_num"
                                stroke={colors.textTertiary}
                                tick={{ fill: colors.textTertiary, fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: colors.grid }}
                                label={{ value: t[lang].order, position: 'insideBottom', offset: -5, fill: colors.textTertiary }}
                            />
                            <YAxis
                                domain={[0, 40000]}
                                stroke={colors.textTertiary}
                                tick={{ fill: colors.textTertiary, fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip content={<UserTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            <Line
                                type="monotone"
                                dataKey="price"
                                name={lang === 'zh' ? '用户预测价格' : 'User Predicted Price'}
                                stroke={colors.userLine}
                                strokeWidth={2}
                                dot={{ r: 2, fill: colors.userLine }}
                                activeDot={{ r: 6 }}
                            />
                            <ReferenceLine
                                y={latestMarketPrice}
                                stroke={colors.referenceLine}
                                strokeDasharray="3 3"
                                label={{
                                    value: `${t[lang].latestRef}: $${latestMarketPrice.toLocaleString()}`,
                                    position: 'insideTopRight',
                                    fill: colors.referenceLine,
                                    fontSize: 12
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="table-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#FFD700' }}>
                            <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                        {t[lang].ranking}
                    </h2>
                    <p style={{ color: 'var(--pp-text-tertiary)', fontSize: '0.9rem' }}>
                        {t[lang].sortedBy.replace('$PRICE', `$${latestMarketPrice.toLocaleString()}`)}
                    </p>
                </div>
                <div className="prediction-table-container">
                    <table className="prediction-table">
                        <thead>
                            <tr>
                                <th>{t[lang].rank}</th>
                                <th>{t[lang].user}</th>
                                <th>{t[lang].pred}</th>
                                <th>{t[lang].diff}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPredictions.map((p, index) => {
                                const rank = index + 1;
                                const diff = p.price - latestMarketPrice;
                                const diffPercent = (diff / latestMarketPrice) * 100;

                                let rankClass = '';
                                let rankContent: React.ReactNode = `#${rank}`;

                                if (rank === 1) {
                                    rankClass = 'rank-champion';
                                    rankContent = <><MedalIcon rank={1} /> {lang === 'zh' ? '冠军' : '1st'}</>;
                                } else if (rank >= 2 && rank <= 3) {
                                    rankClass = 'rank-runner-up';
                                    rankContent = <><MedalIcon rank={2} /> {lang === 'zh' ? '亚军' : '2nd'}</>;
                                } else if (rank >= 4 && rank <= 6) {
                                    rankClass = 'rank-third';
                                    rankContent = <><MedalIcon rank={4} /> {lang === 'zh' ? '季军' : '3rd'}</>;
                                }

                                return (
                                    <tr key={p.line_num}>
                                        <td className={`rank-cell ${rankClass}`}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {rankContent}
                                            </div>
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
