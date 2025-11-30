import React from 'react'
import './LoginModal.css'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <div className="login-modal-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                </div>
                <h3 className="login-modal-title">需要登录</h3>
                <p className="login-modal-message">请先登录账户以访问该功能</p>
                <div className="login-modal-actions">
                    <button className="login-modal-btn cancel" onClick={onClose}>
                        取消
                    </button>
                    <button className="login-modal-btn confirm" onClick={onConfirm}>
                        立即登录
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
