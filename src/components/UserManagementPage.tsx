import React, { useState, useEffect } from 'react'
import './UserManagementPage.css'
import DigitalOceanBackground from './DigitalOceanBackground'

interface User {
    user_id: string
    email: string
    username: string
    permission: number
    created_at: string
    updated_at: string
}

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        permission: 1
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
            password: '',
            permission: 1
        })
    }

    const handleEditClick = (user: User) => {
        setIsCreating(false)
        setEditingUser(user)
        setFormData({
            username: user.username,
            email: user.email,
            password: '', // Password is optional/blank by default
            permission: user.permission
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
                    password: formData.password,
                    username: formData.username,
                    permission: formData.permission
                }
            } else if (editingUser) {
                url = 'https://aqua.navgreen.cn/api/user/update'
                method = 'PUT'
                payload = {
                    user_id: editingUser.user_id,
                    username: formData.username,
                    email: formData.email,
                    permission: formData.permission
                }
                if (formData.password) {
                    payload.password = formData.password
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

    const closeModal = () => {
        setEditingUser(null)
        setIsCreating(false)
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
                                            <button className="action-btn delete-btn">删除</button>
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
                                />
                            </div>
                            <div className="form-group">
                                <label>密码 {isCreating ? '(必填)' : '(留空则不修改)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="********"
                                    required={isCreating}
                                />
                            </div>
                            <div className="form-group">
                                <label>权限等级</label>
                                <select
                                    value={formData.permission}
                                    onChange={e => setFormData({ ...formData, permission: Number(e.target.value) })}
                                >
                                    <option value={1}>普通用户 (1)</option>
                                    <option value={99}>管理员 (99)</option>
                                </select>
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
