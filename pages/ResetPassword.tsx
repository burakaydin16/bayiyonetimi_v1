import React, { useState } from 'react';
import { authService } from '../services/authService';
import { KeyRound, Lock, CheckCircle, LogIn, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordProps {
    token: string;
    onGoToLogin: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ token, onGoToLogin }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Şifre sıfırlama başarısız. Bağlantının süresi dolmuş olabilir.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                        <CheckCircle className="text-emerald-600 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Şifre Değiştirildi!</h2>
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 mb-6">
                        <p className="text-gray-800 font-medium text-[15px] leading-relaxed">
                            Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
                        </p>
                    </div>
                    <button
                        onClick={onGoToLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        Giriş Sayfasına Git
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl mb-4 shadow-lg">
                        <KeyRound className="text-red-500 w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Yeni Şifre Belirle</h1>
                    <p className="text-gray-500 mt-2 font-medium">Hesabınız için yeni bir şifre oluşturun</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Yeni Şifre</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="new-password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                                placeholder="En az 6 karakter"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Şifre Tekrar</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="confirm-password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                                placeholder="Şifreyi tekrar girin"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-red-100 transform transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-3 text-lg"
                    >
                        {loading ? 'Kaydediliyor...' : (
                            <>
                                <KeyRound className="w-6 h-6" />
                                Şifremi Güncelle
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={onGoToLogin} className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline">
                        Giriş sayfasına dön
                    </button>
                </div>
            </div>
        </div>
    );
};
