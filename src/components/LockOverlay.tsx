import React, { useState } from 'react'
import logoFont from '../assets/images/logo-font.png'
import './LockOverlay.css'

interface LockOverlayProps {
    message?: string
    buttonText?: string
    onButtonClick?: () => void
}

const LockOverlay: React.FC<LockOverlayProps> = ({
    message = '您暂无该板块权限',
    buttonText = '联系我们开通',
    onButtonClick
}) => {
    const [showContact, setShowContact] = useState(false)

    const handleContactClick = () => {
        if (onButtonClick) {
            onButtonClick()
        } else {
            setShowContact(true)
        }
    }

    const handleBackClick = () => {
        setShowContact(false)
    }

    return (
        <div className="lock-overlay">
            {!showContact ? (
                <div className="lock-content">
                    <div className="lock-icon-wrapper">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lock-icon"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h3 className="lock-title">{message}</h3>
                    <p className="lock-subtitle">升级您的账户以解锁更多高级功能与数据洞察</p>
                    <button className="lock-button" onClick={handleContactClick}>
                        {buttonText}
                    </button>
                </div>
            ) : (
                <div className="lock-contact-card">
                    <button className="lock-back-button" onClick={handleBackClick}>
                        ← 返回
                    </button>
                    <div className="lock-contact-logo-wrapper">
                        <img src={logoFont} alt="AquaBridge" className="lock-contact-logo" />
                    </div>
                    <h3 className="lock-contact-title">联系我们，开启您的衍生品+战略</h3>
                    <div className="lock-contact-info">
                        <p className="lock-contact-label">我们的联系方式：</p>
                        <p className="lock-contact-item">service@aquabridge.ai</p>
                        <p className="lock-contact-item">Shane Lee +86 15152627161</p>
                        <p className="lock-contact-item">Terry Zhao +86 1360105560/+65 87312888</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LockOverlay
