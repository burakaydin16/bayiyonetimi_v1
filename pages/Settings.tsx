import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { DataService } from '../services/dataService';
import { Button } from '../components/ui/Button';
import { Shield, KeyRound, CheckCircle, Users as UsersIcon, Plus, Trash2, Mail, Lock, Settings as SettingsIcon, Image as ImageIcon, Upload } from 'lucide-react';

interface User {
    id: string;
    email: string;
    role: string;
    permissions: string;
}

const ALL_PERMISSIONS = [
    { id: 'dashboard', label: 'Dashboard Görüntüleme' },
    { id: 'inventory', label: 'Envanter/Stok Yönetimi' },
    { id: 'customers', label: 'Müşteri/Bayi Yönetimi' },
    { id: 'transactions', label: 'Satış/Tahsilat İşlemleri' },
    { id: 'reports', label: 'Raporlar' },
    { id: 'settings', label: 'Ayarlar' },
];

export const Settings: React.FC = () => {
    const user = authService.getUser();
    const isAdmin = user?.role === 'Admin' || user?.permissions === '*';
    const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'branding'>(isAdmin ? 'users' : 'profile');

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Users State
    const [users, setUsers] = useState<User[]>([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userActionLoading, setUserActionLoading] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'User', permissions: '' });

    // Logo State
    const [logoLoading, setLogoLoading] = useState(false);
    const [currentLogo, setCurrentLogo] = useState(localStorage.getItem('logoUrl') || '');

    useEffect(() => {
        if (isAdmin && activeTab === 'users') {
            loadUsers();
        }
    }, [activeTab]);

    const loadUsers = async () => {
        try {
            const data = await DataService.getUsers();
            setUsers(data);
        } catch (e) {
            console.error("Failed to load users", e);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
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
            setError(err?.response?.data?.message || err?.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUser = async () => {
        try {
            setUserActionLoading(true);
            if (editingUser) {
                await DataService.saveUser(editingUser);
            } else {
                await DataService.saveUser(newUser);
            }
            await loadUsers();
            setIsUserModalOpen(false);
            setEditingUser(null);
            setNewUser({ email: '', password: '', role: 'User', permissions: '' });
        } catch (error: any) {
            alert(error.message || 'Kullanıcı kaydedilirken hata oluştu.');
        } finally {
            setUserActionLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
        await DataService.deleteUser(id);
        await loadUsers();
    };

    const togglePermission = (permId: string, currentPerms: string) => {
        const perms = currentPerms ? currentPerms.split(',') : [];
        const index = perms.indexOf(permId);
        if (index > -1) perms.splice(index, 1);
        else perms.push(permId);
        const newPermString = perms.join(',');

        if (editingUser) setEditingUser({ ...editingUser, permissions: newPermString });
        else setNewUser({ ...newUser, permissions: newPermString });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 500 * 1024) { // 500KB limit
            alert("Logo dosyası 500KB'dan büyük olamaz.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            try {
                setLogoLoading(true);
                await authService.updateLogo(base64String);
                setCurrentLogo(base64String);
                // Trigger a re-render or notification if needed
                window.location.reload(); // Simple way to refresh logo in layout
            } catch (err: any) {
                alert("Logo yüklenirken hata oluştu.");
            } finally {
                setLogoLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
                        <SettingsIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
                        <p className="text-gray-500 text-sm">Hesabınızı ve ekibinizi yönetin</p>
                    </div>
                </div>

                {isAdmin && (
                    <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Kullanıcı Yönetimi
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Hesap Güvenliği
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setActiveTab('branding')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'branding' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Firma Logosu
                            </button>
                        )}
                    </div>
                )}
            </div>

            {activeTab === 'profile' ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                        <KeyRound className="w-5 h-5 text-water-600" />
                        <h2 className="text-lg font-bold text-gray-800">Şifre Değiştirme</h2>
                    </div>

                    <div className="p-6">
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-center gap-3 text-green-700 border border-green-100">
                                <CheckCircle className="w-5 h-5" />
                                <p className="font-bold">Şifreniz başarıyla güncellendi!</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mevcut Şifreniz</label>
                                <input
                                    type="password"
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-water-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Yeni Şifre</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-water-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-water-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200"
                                >
                                    {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : activeTab === 'branding' ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                        <ImageIcon className="w-5 h-5 text-water-600" />
                        <h2 className="text-lg font-bold text-gray-800">Firma Logosu</h2>
                    </div>

                    <div className="p-8 space-y-8 text-center">
                        <div className="mx-auto w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center overflow-hidden group relative">
                            {currentLogo ? (
                                <img src={currentLogo} alt="Mevcut Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-300" />
                            )}

                            {logoLoading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-water-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <div className="max-w-xs mx-auto space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Logo Yükleyin</h3>
                                <p className="text-xs text-gray-500 mt-1">Önerilen boyut: 512x512px. Maksimum 500KB.</p>
                            </div>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={logoLoading}
                                />
                                <Button className="w-full bg-slate-900 text-white flex items-center justify-center gap-2">
                                    <Upload size={18} />
                                    {logoLoading ? 'Yükleniyor...' : (currentLogo ? 'Logoyu Değiştir' : 'Dosya Seç')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Ekip Üyeleri ({users.length})</h2>
                        <Button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-water-600 text-white hover:bg-water-700 shadow-lg shadow-water-200">
                            <Plus size={18} className="mr-2" />
                            Yeni Kullanıcı
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map(u => (
                            <div key={u.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <UsersIcon size={20} />
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${u.role === 'Admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-water-50 text-water-600 border border-water-100'}`}>
                                        {u.role}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{u.email}</h3>
                                <div className="flex flex-wrap gap-1 mt-3 h-10 overflow-hidden">
                                    {u.permissions === '*' ? (
                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">TAM YETKİ</span>
                                    ) : (
                                        u.permissions.split(',').filter(x => x).map(p => (
                                            <span key={p} className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                {ALL_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                            </span>
                                        ))
                                    )}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2">
                                    <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="flex-1 text-xs font-bold text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl transition-colors">Düzenle</button>
                                    {u.role !== 'Admin' && (
                                        <button onClick={() => handleDeleteUser(u.id)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isUserModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        {/* Fixed Header */}
                        <div className="flex justify-between items-center p-8 border-b shrink-0">
                            <h3 className="text-xl font-bold text-gray-900">{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</h3>
                            <button onClick={() => setIsUserModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
                            <div className="space-y-4">
                                {!editingUser ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><Mail size={14} className="text-gray-400" /> E-Posta</label>
                                            <input type="email" placeholder="ornek@firma.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-water-500" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><Lock size={14} className="text-gray-400" /> Şifre Belirleyin</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-water-500" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-sm font-bold text-gray-900">{editingUser.email}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Giriş bilgileri değiştirilemez</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><Shield size={14} className="text-gray-400" /> Yetki Tanımları</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {ALL_PERMISSIONS.map(p => {
                                            const currentPerms = (editingUser ? editingUser.permissions : newUser.permissions) || '';
                                            const isChecked = currentPerms === '*' || currentPerms.split(',').includes(p.id);
                                            return (
                                                <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-water-50 border-water-200 text-water-700' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-water-600 focus:ring-water-500" checked={isChecked} disabled={currentPerms === '*' || (editingUser?.role === 'Admin' && p.id === 'settings')} onChange={() => togglePermission(p.id, currentPerms)} />
                                                    <span className="text-xs font-bold">{p.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="flex gap-3 p-8 border-t shrink-0 bg-gray-50/50">
                            <Button variant="ghost" onClick={() => setIsUserModalOpen(false)} className="flex-1">Vazgeç</Button>
                            <Button onClick={handleSaveUser} disabled={userActionLoading} className="flex-1 bg-slate-900 text-white shadow-lg shadow-slate-200">
                                {userActionLoading ? 'İşleniyor...' : 'Kaydet'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
