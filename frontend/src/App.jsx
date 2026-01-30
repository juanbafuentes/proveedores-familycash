import React, { useState, useEffect } from 'react'
import {
    LayoutDashboard,
    Package,
    FileText,
    Settings,
    LogOut,
    Plus,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    Lock
} from 'lucide-react'
import { useApi } from './hooks/useApi'

function App() {
    const { token, login, logout, fetchWithAuth } = useApi();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, new: 0 });
    const [loading, setLoading] = useState(false);

    // Login State
    const [loginData, setLoginData] = useState({ nif: '', proveedorId: '', password: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            loadData();
        }
    }, [token]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Cargar productos vinculados a este proveedor
            const prodResponse = await fetchWithAuth('/producto/pagebyproveedor?size=10');
            const prodData = await prodResponse.json();
            setProducts(prodData.content || []);

            // 2. Cargar contador total
            const countResponse = await fetchWithAuth('/producto/count');
            const count = await countResponse.json();
            setStats(prev => ({ ...prev, total: count }));

            // Mocks para el resto (mientras el backend no tenga esas funciones específicas)
            setStats(prev => ({ ...prev, pending: (prodData.content || []).filter(p => p.estado === 'PENDIENTE').length }));
        } catch (err) {
            console.error("Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(loginData.nif, loginData.proveedorId, loginData.password);
        if (!success) setError('Credenciales incorrectas');
    };

    if (!token) {
        return (
            <div className="login-screen" style={{
                height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(circle at center, #1a1d23 0%, #0f1115 100%)'
            }}>
                <form onSubmit={handleLogin} style={{
                    background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '1.5rem',
                    border: '1px solid var(--glass-border)', width: '100%', maxWidth: '400px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ background: 'var(--primary)', display: 'inline-block', padding: '12px', borderRadius: '12px', marginBottom: '1rem' }}>
                            <Lock size={24} color="white" />
                        </div>
                        <h2 className="logo-text">Family<span className="logo-accent">Cash</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Portal de Proveedores</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>NIF</label>
                            <input type="text" value={loginData.nif} onChange={e => setLoginData({ ...loginData, nif: e.target.value })} style={inputStyle} placeholder="B12345678" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ID Proveedor</label>
                            <input type="number" value={loginData.proveedorId} onChange={e => setLoginData({ ...loginData, proveedorId: e.target.value })} style={inputStyle} placeholder="12345" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contraseña</label>
                            <input type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} style={inputStyle} placeholder="••••••••" required />
                        </div>
                        {error && <p style={{ color: 'var(--primary)', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
                        <button type="submit" className="add-btn" style={{ width: '100%', padding: '1rem' }}>Entrar al Portal</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo-container">
                    <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
                        <Package size={24} color="white" />
                    </div>
                    <h1 className="logo-text">Family<span className="logo-accent">Cash</span></h1>
                </div>

                <nav>
                    <ul className="nav-list">
                        <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <LayoutDashboard size={20} /> Dashboard
                        </li>
                        <li className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                            <Package size={20} /> Mis Productos
                        </li>
                        <li className={`nav-item ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>
                            <FileText size={20} /> Documentación
                        </li>
                        <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            <Settings size={20} /> Configuración
                        </li>
                    </ul>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div className="nav-item" onClick={logout}>
                        <LogOut size={20} /> Cerrar Sesión
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Panel de Control</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Datos en tiempo real desde la Base de Datos.</p>
                    </div>

                    <button className="add-btn">
                        <Plus size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                        Añadir Producto
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Productos (Histórico)</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pendientes de Aprobación</div>
                        <div className="stat-value">{stats.pending}</div>
                    </div>
                    <div className="stat-card" style={{ opacity: 0.5 }}>
                        <div className="stat-label">Servidor Backend</div>
                        <div className="stat-value" style={{ fontSize: '1rem', color: 'var(--accent-green)' }}>Conectado 🟢</div>
                    </div>
                </div>

                {/* Product List */}
                <section className="data-table-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Listado de Productos ({products.length})</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Filtrar por nombre..."
                                style={{
                                    background: 'var(--bg-dark)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    padding: '8px 12px 8px 36px',
                                    borderRadius: '8px',
                                    width: '250px'
                                }}
                            />
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre del Producto</th>
                                <th>Marca</th>
                                <th>EAN</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando datos desde el servidor...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No se han encontrado productos para este proveedor.</td></tr>
                            ) : products.map((p, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 500 }}>{p.id}</td>
                                    <td>{p.descripcion}</td>
                                    <td>{p.marca || '-'}</td>
                                    <td>{p.ean || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge status-${(p.estado || 'pending').toLowerCase()}`}>
                                            {p.estado === 'ACTIVO' && <CheckCircle2 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                                            {p.estado === 'PENDIENTE' && <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                                            {p.estado === 'RECHAZADO' && <AlertCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                                            {p.estado || 'PENDIENTE'}
                                        </span>
                                    </td>
                                    <td>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Ver Detalle</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    background: 'var(--bg-dark)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    padding: '0.875rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    outline: 'none'
};

export default App
