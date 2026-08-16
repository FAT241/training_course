import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, User, Lock, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!email.includes('@')) {
            toast.error('Vui lòng nhập email hợp lệ');
            return;
        }
        if (password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
            
            toast.success('Đăng nhập thành công!');
            
            if (res.data.user.role === 'ADMIN') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container-premium">
            <div className="login-left-panel">
                <div className="login-branding">
                    <div className="login-logo-glass">
                        <BookOpen size={48} color="#ffffff" />
                    </div>
                    <h1 className="login-hero-title">FPT Complex Training</h1>
                    <p className="login-hero-subtitle">Nền tảng đào tạo nội bộ hiện đại, linh hoạt và bảo mật. Nâng tầm kỹ năng của bạn mỗi ngày.</p>
                </div>
                <div className="login-decorative-circle"></div>
                <div className="login-decorative-circle-2"></div>
            </div>

            <div className="login-right-panel">
                {/* Decorative background elements for right panel */}
                <div className="right-panel-decoration shape-1"></div>
                <div className="right-panel-decoration shape-2"></div>
                
                <div className="login-card-premium">
                    <div className="login-header-text">
                        <h2>Xin chào! 👋</h2>
                        <p>Đăng nhập để tiếp tục lộ trình học tập của bạn</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="login-form-premium">
                        <div className="form-group-premium">
                            <label className="form-label-premium">Email FPT</label>
                            <div className="input-wrapper-premium">
                                <div className="input-icon-premium">
                                    <User size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input-premium"
                                    placeholder="email@fpt.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-premium">
                            <label className="form-label-premium">Mật khẩu</label>
                            <div className="input-wrapper-premium">
                                <div className="input-icon-premium">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input-premium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-login-premium"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="spinner-icon" />
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
