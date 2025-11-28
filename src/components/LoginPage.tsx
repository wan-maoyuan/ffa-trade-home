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
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入您的密码"
                            required
                        />
                    </div>

                    {!isRegistering && (
                        <div className="form-actions">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">记住我</label>
                            </div>
                            <a href="#" className="forgot-password">忘记密码？</a>
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
        </div>
    )
}

export default LoginPage
