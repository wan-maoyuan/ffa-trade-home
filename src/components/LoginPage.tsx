import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'
import logoImage from '../assets/images/logo-font.png'

import DigitalOceanBackground from './DigitalOceanBackground'

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock login logic
        console.log('Logging in with:', email, password)
        navigate('/')
    }

    return (
        <div className="login-page">
            <DigitalOceanBackground />
            <div className="login-overlay" />
            <div className="login-gradient" />

            <div className="login-container">
                <div className="login-header">
                    <img src={logoImage} alt="Logo" className="login-logo" />
                    <h2 className="login-title">欢迎回来</h2>
                    <p className="login-subtitle">请登录您的账户以继续</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">邮箱 / 手机号</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="请输入您的邮箱或手机号"
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

                    <div className="form-actions">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">记住我</label>
                        </div>
                        <a href="#" className="forgot-password">忘记密码？</a>
                    </div>

                    <button type="submit" className="login-button">
                        登录
                    </button>
                </form>

                <div className="login-footer">
                    <p>还没有账户？ <a href="#">立即注册</a></p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
