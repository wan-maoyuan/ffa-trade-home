import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'
import logoImage from '../assets/images/logo-font.png'

import DigitalOceanBackground from './DigitalOceanBackground'

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const url = isRegistering
                ? 'https://aqua.navgreen.cn/api/user/register'
                : 'https://aqua.navgreen.cn/api/user/login'

            const payload = isRegistering
                ? { email, password, username }
                : { email, password }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (data.code === 200) {
                if (isRegistering) {
                    // Registration successful, switch to login
                    setIsRegistering(false)
                    setError('')
                    alert('注册成功，请登录')
                } else {
                    // Login successful
                    localStorage.setItem('token', data.data.token)
                    localStorage.setItem('user', JSON.stringify(data.data))

                    // Dispatch custom event to notify Navbar
                    window.dispatchEvent(new Event('loginStateChange'))

                    navigate('/')
                }
            } else {
                // Handle errors
                if (response.status === 422 && Array.isArray(data.detail)) {
                    const errorMsg = data.detail.map((err: any) => {
                        if (err.loc.includes('password') && err.type.includes('min_length')) {
                            return '密码长度不能少于6位'
                        }
                        return err.msg
                    }).join('\n')
                    setError(errorMsg || '参数验证失败')
                } else {
                    setError(data.msg || (isRegistering ? '注册失败' : '登录失败，请检查邮箱和密码'))
                }
            }
        } catch (err) {
            setError('网络错误，请稍后重试')
            console.error('Auth error:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsRegistering(!isRegistering)
        setError('')
        // Clear inputs when switching modes
        setEmail('')
        setPassword('')
        setUsername('')
    }

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowForgotPasswordModal(true)
    }

    const closeForgotPasswordModal = () => {
        setShowForgotPasswordModal(false)
    }

    return (
        <div className="login-page">
            <DigitalOceanBackground />
            <div className="login-overlay" />
            <div className="login-gradient" />

            <div className="login-container">
                <div className="login-header">
                    <img src={logoImage} alt="Logo" className="login-logo" />
                    <h2 className="login-title">{isRegistering ? '创建账户' : '欢迎回来'}</h2>
                    <p className="login-subtitle">
                        {isRegistering ? '填写以下信息完成注册' : '请登录您的账户以继续'}
                    </p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {isRegistering && (
                        <div className="form-group">
                            <label htmlFor="username">用户名</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="请输入您的用户名"
                                required={isRegistering}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">邮箱</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="请输入您的邮箱"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">密码</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="请输入您的密码"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {!isRegistering && (
                            <div className="password-hint">
                                <span className="hint-icon">💡</span>
                                <span className="hint-text">提示：您可以尝试使用默认密码 <strong>123456</strong></span>
                            </div>
                        )}
                    </div>

                    {!isRegistering && (
                        <div className="form-actions">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">记住我</label>
                            </div>
                            <a href="#" className="forgot-password" onClick={handleForgotPassword}>忘记密码？</a>
                        </div>
                    )}

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? '处理中...' : (isRegistering ? '注册' : '登录')}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isRegistering ? '已有账户？' : '还没有账户？'}
                        <a href="#" onClick={toggleMode}>
                            {isRegistering ? '立即登录' : '立即注册'}
                        </a>
                    </p>
                </div>
            </div>

            {/* 忘记密码模态框 */}
            {showForgotPasswordModal && (
                <div className="forgot-password-modal-overlay" onClick={closeForgotPasswordModal}>
                    <div className="forgot-password-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="forgot-password-modal-header">
                            <h3 className="forgot-password-modal-title">重置密码</h3>
                            <button className="forgot-password-modal-close" onClick={closeForgotPasswordModal}>×</button>
                        </div>
                        <div className="forgot-password-modal-body">
                            <p className="forgot-password-modal-text">如需重置密码，请联系以下方式：</p>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="contact-label">邮箱：</span>
                                    <a href="mailto:service@aquabridge.ai" className="contact-value">service@aquabridge.ai</a>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Shane Lee：</span>
                                    <a href="tel:+8615152627161" className="contact-value">+86 15152627161</a>
                                </div>
                                <div className="contact-item">
                                    <span className="contact-label">Terry Zhao：</span>
                                    <div className="contact-value-group">
                                        <a href="tel:+8613601055560" className="contact-value">+86 1360105560</a>
                                        <span className="contact-separator">/</span>
                                        <a href="tel:+6587312888" className="contact-value">+65 87312888</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="forgot-password-modal-footer">
                            <button className="forgot-password-modal-button" onClick={closeForgotPasswordModal}>关闭</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoginPage
