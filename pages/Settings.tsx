import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Shield, KeyRound, CheckCircle } from 'lucide-react';

export const Settings: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Yeni şifreler birbiriyle uyuşmuyor.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Yeni şifre en az 6 karakter olmalıdır.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await authService.changePassword(oldPassword, newPassword);

            setSuccess(true);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            // the error might come from axios interceptor or similar
            setError(err?.response?.data?.message || err?.message || 'Bir hata oluştu, eski şifrenizi kontrol edip tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 rounded-lg text-white">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ayarlar ve Güvenlik</h1>
                    <p className="text-gray-500">Hesap güvenliğinizi sağlayın ve profilinizi yönetin</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-800">Şifre Değiştirme</h2>
                </div>

                <div className="p-6">
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center gap-3 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <p className="font-medium">Şifreniz başarıyla güncellendi!</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifreniz</label>
                            <input
                                type="password"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500 transition-colors"
                                placeholder="Şu anki şifrenizi girin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifreniz</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500 transition-colors"
                                placeholder="Yeni bir güvenli şifre belirleyin"
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifreniz (Tekrar)</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-water-500 transition-colors"
                                placeholder="Yeni şifrenizi tekrar girin"
                                minLength={6}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
