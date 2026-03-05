
import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { LogIn, UserPlus, Building2, Mail, Lock } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: () => void;
    onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [tenantName, setTenantName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(tenantName, email, password);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg transform rotate-3">
                        <LogIn className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bayi Sistemi</h1>
                    <p className="text-gray-500 mt-2 font-medium">Lütfen bilgilerinizi giriniz</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Bayi / Şirket Adı</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                placeholder="Örn: Özsu Dağıtım"
                                value={tenantName}
                                onChange={(e) => setTenantName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Kullanıcı Adı</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                placeholder="Kullanıcı adınızı yazın"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Parola</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-blue-200 transform transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-3 text-lg"
                    >
                        {loading ? 'Giriş Yapılıyor...' : (
                            <>
                                GİRİŞ YAP
                                <LogIn className="w-6 h-6" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-600 font-medium">
                        Henüz bir bayi hesabınız yok mu?
                        <button
                            onClick={onSwitchToRegister}
                            className="text-blue-600 font-bold ml-2 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                        >
                            Hemen Kaydolun
                            <UserPlus className="w-4 h-4" />
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
