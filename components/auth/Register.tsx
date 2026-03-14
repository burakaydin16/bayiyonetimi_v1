
import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { UserPlus, LogIn, Building2, Mail, Lock, User, CheckCircle } from 'lucide-react';

interface RegisterProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState<{ referenceCode: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authService.registerTenant(name, username, email, password);
            setSuccessData({ referenceCode: result.referenceCode });
        } catch (err: any) {
            setError(err.message || 'Kayıt oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                        <CheckCircle className="text-emerald-600 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Başvurunuz Alındı!</h2>
                    <p className="text-gray-600 mb-6">
                        Sistem yöneticisi hesabınızı onayladıktan sonra aşağıdaki <strong>Firma ID</strong> ve e-posta adresiniz ile giriş yapabilirsiniz.
                    </p>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                        <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-2">Firma ID (Referans Kodu)</p>
                        <p className="text-3xl font-black text-blue-900 tracking-wider">{successData.referenceCode}</p>
                        <p className="text-xs text-blue-500 mt-2">Bu kodu kaybedetmeyin, giriş için gerekli!</p>
                    </div>
                    <button
                        onClick={onSwitchToLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        Giriş Sayfasına Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-2xl mb-4 shadow-lg transform -rotate-3">
                        <UserPlus className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bayi Kaydı</h1>
                    <p className="text-gray-500 mt-2 font-medium">Sisteme yeni firma kaydı oluşturun</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Firma Adı</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="reg-name"
                                type="text"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                placeholder="Firmanızın adını girin"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Kullanıcı Adı</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="reg-username"
                                type="text"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                placeholder="Admin kullanıcı adı"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">E-Posta</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="reg-email"
                                type="email"
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                placeholder="ornek@firma.com"
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
                                id="reg-password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                placeholder="En az 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-emerald-200 transform transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-3 text-lg"
                    >
                        {loading ? 'Kaydediliyor...' : (
                            <>
                                BAŞVUR
                                <UserPlus className="w-6 h-6" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600 font-medium">
                        Zaten bir hesabınız var mı?
                        <button
                            onClick={onSwitchToLogin}
                            className="text-emerald-600 font-bold ml-2 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                        >
                            Giriş Yap
                            <LogIn className="w-4 h-4" />
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
