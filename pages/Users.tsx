import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Button } from '../components/ui/Button';
import { Plus, Users as UsersIcon, Shield, Trash2, Mail, Lock } from 'lucide-react';

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
    { id: 'reports', label: 'Raporları Görüntüleme' },
    { id: 'settings', label: 'Ayarlara Erişim' },
    { id: 'users', label: 'Kullanıcı Yönetimi' },
];

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'User', permissions: '' });

    const loadUsers = async () => {
        const data = await DataService.getUsers();
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            if (editingUser) {
                await DataService.saveUser(editingUser);
            } else {
                await DataService.saveUser(newUser);
            }
            await loadUsers();
            setIsModalOpen(false);
            setEditingUser(null);
            setNewUser({ email: '', password: '', role: 'User', permissions: '' });
        } catch (error: any) {
            alert(error.message || 'Kullanıcı kaydedilirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
        await DataService.deleteUser(id);
        await loadUsers();
    };

    const togglePermission = (permId: string, currentPerms: string) => {
        const perms = currentPerms ? currentPerms.split(',') : [];
        const index = perms.indexOf(permId);
        if (index > -1) {
            perms.splice(index, 1);
        } else {
            perms.push(permId);
        }
        const newPermString = perms.join(',');

        if (editingUser) {
            setEditingUser({ ...editingUser, permissions: newPermString });
        } else {
            setNewUser({ ...newUser, permissions: newPermString });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
                    <p className="text-gray-500 text-sm">Alt kullanıcıları ve yetkilerini yönetin.</p>
                </div>
                <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="bg-slate-900 text-white">
                    <Plus size={18} className="mr-2" />
                    Yeni Kullanıcı
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                    <UsersIcon size={20} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.role === 'Admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{user.email}</h3>
                            <div className="flex flex-wrap gap-1 mt-3">
                                {user.permissions === '*' ? (
                                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 font-bold">TAM YETKİ (*)</span>
                                ) : (
                                    (user.permissions || '').split(',').filter(p => p).map(p => (
                                        <span key={p} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">
                                            {ALL_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                        </span>
                                    ))
                                )}
                                {!user.permissions && <span className="text-[10px] text-gray-400 italic">Yetki tanımlanmamış</span>}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2">
                            <button
                                onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                                className="flex-1 text-sm font-medium text-slate-600 hover:bg-slate-50 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                            >
                                Düzenle
                            </button>
                            {user.role !== 'Admin' && (
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-6 shadow-2xl">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-xl font-bold text-gray-900">{editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {!editingUser && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                                <Mail size={14} /> E-Posta
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-900"
                                                value={newUser.email}
                                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                                <Lock size={14} /> Şifre
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-900"
                                                value={newUser.password}
                                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {editingUser && (
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm font-bold text-slate-900">{editingUser.email}</p>
                                        <p className="text-xs text-slate-500 mt-1">Giriş bilgileri değiştirilemez.</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Shield size={14} /> Yetkiler
                                </label>
                                <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2">
                                    {ALL_PERMISSIONS.map(p => {
                                        const currentPerms = (editingUser ? editingUser.permissions : newUser.permissions) || '';
                                        const isChecked = currentPerms === '*' || currentPerms.split(',').includes(p.id);
                                        return (
                                            <label key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                                                    checked={isChecked}
                                                    disabled={currentPerms === '*'}
                                                    onChange={() => togglePermission(p.id, currentPerms)}
                                                />
                                                <span className="text-sm text-gray-700">{p.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>İptal</Button>
                            <Button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white">
                                {loading ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
