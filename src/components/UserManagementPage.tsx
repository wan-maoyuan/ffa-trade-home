import React, { useState, useEffect } from 'react'
import './UserManagementPage.css'
import DigitalOceanBackground from './DigitalOceanBackground'

interface User {
    user_id: string
    email: string
    username: string
    permission: number
    company_name?: string
    remarks?: string
    signal?: string[]
    strategy?: string[]
    created_at: string
    updated_at: string
}

const AVAILABLE_SIGNALS = ['ffa', '欧线', '单边价格-14天后交易机会', '单边价格-42天后交易机会', '双边价格-基差交易机会']
const AVAILABLE_STRATEGIES = ['P5', 'P3A', 'P6', 'C3', 'C5']

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        company_name: '',
        remarks: '',
        permission: 1,
        signal: [] as string[],
        strategy: [] as string[]
    })

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://aqua.navgreen.cn/api/user/list', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            // 处理 token 过期的情况
            if (data.code === 4002) {
                // 清除本地存储的认证信息
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                // 显示提示信息
                alert(data.msg || '登录已过期，请重新登录')
                // 跳转到登录页面
                window.location.href = '/login'
                return
            }

            if (data.code === 200 && data.data && data.data.users) {
                const sortedUsers = data.data.users.sort((a: User, b: User) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
                setUsers(sortedUsers)
            } else {
                console.error('Failed to fetch users:', data.msg)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleCreateClick = () => {
        setIsCreating(true)
        setEditingUser(null)
        setFormData({
            username: '',
            email: '',
            company_name: '',
            remarks: '',
            permission: 1,
            signal: [],
            strategy: []
        })
    }

    const handleEditClick = (user: User) => {
        setIsCreating(false)
        setEditingUser(user)
        setFormData({
            username: user.username,
            email: user.email,
            company_name: user.company_name || '',
            remarks: user.remarks || '',
            permission: user.permission,
            signal: user.signal || [],
            strategy: user.strategy || []
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')
            let url = ''
            let method = ''
            let payload: any = {}

            if (isCreating) {
                url = 'https://aqua.navgreen.cn/api/user/create'
                method = 'POST'
                payload = {
                    email: formData.email,
                    password: '123456', // Default password for new users
                    username: formData.username,
                    company_name: formData.company_name,
                    remarks: formData.remarks,
                    permission: formData.permission,
                    signal: formData.signal,
                    strategy: formData.strategy
                }
            } else if (editingUser) {
                url = 'https://aqua.navgreen.cn/api/user/update'
                method = 'PUT'
                payload = {
                    user_id: editingUser.user_id,
                    username: formData.username,
                    email: formData.email,
                    password: '123456', // Include password as per user request example, though usually not needed for update unless changing
                    company_name: formData.company_name,
                    remarks: formData.remarks,
                    permission: formData.permission,
                    signal: formData.signal,
                    strategy: formData.strategy
                }
            } else {
                return
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            // 处理 token 过期的情况
            if (data.code === 4002) {
                // 清除本地存储的认证信息
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                // 显示提示信息
                alert(data.msg || '登录已过期，请重新登录')
                // 跳转到登录页面
                window.location.href = '/login'
                return
            }

            if (response.ok && data.code === 200) {
                // Success
                setEditingUser(null)
                setIsCreating(false)
                fetchUsers() // Refresh list
                alert(isCreating ? '创建成功' : '更新成功')
            } else {
                // Handle specific validation errors
                if (response.status === 422 && Array.isArray(data.detail)) {
                    const errorMsg = data.detail.map((err: any) => {
                        if (err.loc.includes('password') && err.type.includes('min_length')) {
                            return '密码长度不能少于6位'
                        }
                        return err.msg
                    }).join('\n')
                    alert(errorMsg || '参数验证失败')
                } else {
                    alert(data.msg || (isCreating ? '创建失败' : '更新失败'))
                }
            }
        } catch (error) {
            console.error('Operation failed:', error)
            alert('操作失败，请重试')
        }
    }



    const closeModal = () => {
        setEditingUser(null)
        setIsCreating(false)
    }

    const handleCheckboxChange = (type: 'signal' | 'strategy', value: string, checked: boolean) => {
        setFormData(prev => {
            const list = prev[type]
            if (checked) {
                return { ...prev, [type]: [...list, value] }
            } else {
                return { ...prev, [type]: list.filter(item => item !== value) }
            }
        })
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        try {
            const date = new Date(dateString)
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(/\//g, '-')
        } catch (e) {
            return dateString
        }
    }

    return (
        <div className="user-management-page">
            <DigitalOceanBackground />
            <div className="page-overlay" />

            <div className="content-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">用户管理</h1>
                        <p className="page-subtitle">管理系统用户及其权限 <span style={{ marginLeft: '10px', fontSize: '0.9em', opacity: 0.8 }}>(共 {users.length} 人)</span></p>
                    </div>
                    <div className="header-actions">
                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="搜索用户名 / 邮箱 / 公司..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <button className="action-btn create-btn" onClick={handleCreateClick}>
                            新增用户
                        </button>
                    </div>
                </div>

                <div className="users-table-container">
                    {loading ? (
                        <div className="loading-state">加载中...</div>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '100px' }}>用户名</th>
                                    <th style={{ width: '180px' }}>邮箱</th>
                                    <th style={{ width: '120px' }}>公司</th>
                                    <th>信号权限</th>
                                    <th>策略权限</th>
                                    <th style={{ width: '160px' }}>最后更新时间</th>
                                    <th style={{ width: '140px' }}>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(user =>
                                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (user.company_name && user.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
                                ).map(user => (
                                    <tr key={user.user_id}>
                                        <td className="font-medium">{user.username}</td>
                                        <td className="text-gray">{user.email}</td>
                                        <td>{user.company_name || '-'}</td>
                                        <td>
                                            <div className="tags-container">
                                                {user.signal && user.signal.length > 0 ? (
                                                    user.signal.map((sig, index) => (
                                                        <span key={index} className="tag-badge tag-signal">{sig}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tags-container">
                                                {user.strategy && user.strategy.length > 0 ? (
                                                    user.strategy.map((strat, index) => (
                                                        <span key={index} className="tag-badge tag-strategy">{strat}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="date-cell">{formatDate(user.updated_at)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn edit-btn"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    编辑
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {(editingUser || isCreating) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{isCreating ? '新增用户' : '编辑用户'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>用户名</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>邮箱</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={!isCreating}
                                />
                            </div>
                            <div className="form-group">
                                <label>公司名</label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                    placeholder="请输入公司名称"
                                />
                            </div>
                            <div className="form-group">
                                <label>备注</label>
                                <input
                                    type="text"
                                    value={formData.remarks}
                                    onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                    placeholder="请输入备注信息"
                                />
                            </div>
                            {/* Password and Permission fields removed as per request */}
                            <div className="form-group">
                                <div className="label-row">
                                    <label>信号权限</label>
                                    <div className="selection-controls">
                                        <button type="button" className="text-btn" onClick={() => setFormData(prev => ({ ...prev, signal: [...AVAILABLE_SIGNALS] }))}>全选</button>
                                        <span className="divider">|</span>
                                        <button type="button" className="text-btn" onClick={() => setFormData(prev => ({ ...prev, signal: [] }))}>取消全选</button>
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    {AVAILABLE_SIGNALS.map(sig => (
                                        <label key={sig} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.signal.includes(sig)}
                                                onChange={e => handleCheckboxChange('signal', sig, e.target.checked)}
                                            />
                                            {sig}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="label-row">
                                    <label>策略权限</label>
                                    <div className="selection-controls">
                                        <button type="button" className="text-btn" onClick={() => setFormData(prev => ({ ...prev, strategy: [...AVAILABLE_STRATEGIES] }))}>全选</button>
                                        <span className="divider">|</span>
                                        <button type="button" className="text-btn" onClick={() => setFormData(prev => ({ ...prev, strategy: [] }))}>取消全选</button>
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    {AVAILABLE_STRATEGIES.map(strat => (
                                        <label key={strat} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.strategy.includes(strat)}
                                                onChange={e => handleCheckboxChange('strategy', strat, e.target.checked)}
                                            />
                                            {strat}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeModal}>取消</button>
                                <button type="submit" className="save-btn">保存</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagementPage
