import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { LogIn, UserPlus, Hash, Mail, Lock, ArrowLeft, SendHorizonal } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: () => void;
    onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [tenantRef, setTenantRef] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotDone, setForgotDone] = useState(false);
    const [forgotError, setForgotError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.login(tenantRef, email, password);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError('');
        setForgotLoading(true);
        try {
            await authService.forgotPassword(forgotEmail);
            setForgotDone(true);
        } catch (err: any) {
            setForgotError(err.message || 'Bir hata oluştu, lütfen tekrar deneyin.');
        } finally {
            setForgotLoading(false);
        }
    };

    if (view === 'forgot') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-4 shadow-lg">
                            <Mail className="text-orange-500 w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Şifremi Unuttum</h1>
                        <p className="text-gray-500 mt-2 font-medium">Kayıtlı e-posta adresinizi girin</p>
                    </div>

                    {forgotDone ? (
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 mb-6 text-center">
                            <p className="text-emerald-700 font-bold text-[15px]">✅ Şifre sıfırlama bağlantısı gönderildi!</p>
                            <p className="text-gray-600 text-sm mt-2">Lütfen e-posta kutunuzu kontrol edin. Bağlantı 24 saat geçerlidir.</p>
                        </div>
                    ) : (
                        <>
                            {forgotError && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                                    {forgotError}
                                </div>
                            )}
                            <form onSubmit={handleForgot} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">E-Posta Adresi</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="forgot-email"
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                                            placeholder="ornek@firma.com"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-orange-100 transform transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                                >
                                    {forgotLoading ? 'Gönderiliyor...' : (<><SendHorizonal className="w-5 h-5" /> Sıfırlama Linki Gönder</>)}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <button onClick={() => setView('login')} className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline inline-flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Giriş sayfasına dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Firma ID (Referans Kodu)</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="tenantRef"
                                type="text"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                placeholder="Örn: 100000"
                                value={tenantRef}
                                onChange={(e) => setTenantRef(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">E-Posta</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                placeholder="ornek@firma.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Parola</label>
                            <button
                                type="button"
                                onClick={() => setView('forgot')}
                                className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline"
                            >
                                Şifremi Unuttum
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="password"
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
                        {loading ? 'Giriş Yapılıyor...' : (<>GİRİŞ YAP<LogIn className="w-6 h-6" /></>)}
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
