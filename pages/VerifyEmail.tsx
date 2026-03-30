import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { CheckCircle, XCircle, Loader2, LogIn } from 'lucide-react';

interface VerifyEmailProps {
    token: string;
    onGoToLogin: () => void;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ token, onGoToLogin }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await authService.verifyEmail(token);
                setMessage(res.message || 'E-posta adresiniz başarıyla doğrulandı.');
                setStatus('success');
            } catch (err: any) {
                setMessage(err.message || 'Doğrulama bağlantısı geçersiz veya süresi dolmuş.');
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                            <Loader2 className="text-blue-600 w-12 h-12 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">E-Posta Doğrulanıyor...</h2>
                        <p className="text-gray-500">Lütfen bekleyin.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                            <CheckCircle className="text-emerald-600 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Doğrulama Başarılı!</h2>
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 mb-6 text-left">
                            <p className="text-gray-800 font-medium text-[15px] leading-relaxed">
                                {message}
                            </p>
                            <p className="text-emerald-700 font-bold text-sm mt-3">
                                Başvurunuz sistem yöneticisine iletildi. Onaylandığında Firma ID'niz e-posta adresinize gönderilecektir.
                            </p>
                        </div>
                        <button
                            onClick={onGoToLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            Giriş Sayfasına Dön
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                            <XCircle className="text-red-500 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Doğrulama Başarısız</h2>
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
                            <p className="text-red-700 font-medium text-[15px] leading-relaxed">{message}</p>
                        </div>
                        <button
                            onClick={onGoToLogin}
                            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            Giriş Sayfasına Dön
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
