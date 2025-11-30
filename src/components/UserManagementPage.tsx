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

            if (data.code === 200 && data.data && data.data.users) {
                setUsers(data.data.users)
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

    const handleDeleteClick = async (userId: string) => {
        if (!window.confirm('确定要删除该用户吗？此操作无法撤销。')) {
            return
        }

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://aqua.navgreen.cn/api/user/delete', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ user_id: userId })
            })

            const data = await response.json()

            if (response.ok && data.code === 200) {
                alert('删除成功')
                fetchUsers()
            } else {
                alert(data.msg || '删除失败')
            }
        } catch (error) {
            console.error('Delete operation failed:', error)
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

    return (
        <div className="user-management-page">
            <DigitalOceanBackground />
            <div className="page-overlay" />

            <div className="content-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">用户管理</h1>
                        <p className="page-subtitle">管理系统用户及其权限</p>
                    </div>
                    <button className="action-btn create-btn" onClick={handleCreateClick}>
                        新增用户
                    </button>
                </div>

                <div className="users-table-container">
                    {loading ? (
                        <div className="loading-state">加载中...</div>
                    ) : (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>用户名</th>
                                    <th>邮箱</th>
                                    <th>权限等级</th>
                                    <th>注册时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`permission-badge permission-${user.permission}`}>
                                                {user.permission === 99 ? '管理员' : '普通用户'} ({user.permission})
                                            </span>
                                        </td>
                                        <td>{user.created_at}</td>
                                        <td>
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                编辑
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteClick(user.user_id)}
                                            >
                                                删除
                                            </button>
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
                                <label>信号权限</label>
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
                                <label>策略权限</label>
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
