import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, User, Lock, LogIn } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            if (res.data.user.role === 'ADMIN') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon-wrapper">
                        <BookOpen size={32} />
                    </div>
                    <h2 className="login-title">FPT Complex</h2>
                    <p className="login-subtitle">Internal Training System (DACS3)</p>
                </div>
                
                <div className="login-body">
                    <form onSubmit={handleLogin}>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label className="form-label">Email FPT</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <User size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="email@fpt.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">
                            <LogIn size={18} />
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
