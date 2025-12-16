import { useState } from "react";
import Activos from "./Activos";
import Reportes from "./Reportes";
import Usuarios from "./Usuarios";
import Ordenes from "./Ordenes";
import "./Dashboard.css";

export default function Dashboard({ user, onLogout }) {
    const [seccion, setSeccion] = useState("panel"); // panel | activos | reportes | ordenes | usuarios

    // --- Componente: Overview (Widgets) ---
    const PanelOverview = () => {
        return (
            <div>
                {/* Fila 1: Stats Principales */}
                <div className="dashboard-grid">
                    {/* Widget 1: Estado Activos */}
                    <div className="widget-card">
                        <div className="card-title">Estado General de Activos</div>
                        <div className="big-number">1.245</div>

                        <div className="progress-item">
                            <div className="progress-label"><span>Operativos</span> <span>980 (80%)</span></div>
                            <div className="progress-bar-bg"><div className="progress-fill" style={{ width: '80%', backgroundColor: '#28a745' }}></div></div>
                        </div>
                        <div className="progress-item">
                            <div className="progress-label"><span>En Mantenimiento</span> <span>150 (12%)</span></div>
                            <div className="progress-bar-bg"><div className="progress-fill" style={{ width: '12%', backgroundColor: '#6c757d' }}></div></div>
                        </div>
                        <div className="progress-item">
                            <div className="progress-label"><span>Fuera de Servicio</span> <span>60 (5%)</span></div>
                            <div className="progress-bar-bg"><div className="progress-fill" style={{ width: '5%', backgroundColor: '#dc3545' }}></div></div>
                        </div>
                        <button className="card-btn" onClick={() => setSeccion("activos")}>Ver Todos los Activos</button>
                    </div>

                    {/* Widget 2: Órdenes */}
                    <div className="widget-card">
                        <div className="card-title">Órdenes de Trabajo</div>
                        <div className="big-number">85</div>
                        <div className="list-item">
                            <span className="tag-urgent">⚠ Urgentes:</span> <span style={{ float: 'right', fontWeight: 'bold' }}>0</span>
                        </div>
                        <div className="list-item">
                            <span>📅 Programadas:</span> <span style={{ float: 'right', fontWeight: 'bold' }}>0</span>
                        </div>
                        <div className="list-item">
                            <span>🕒 Retrasadas:</span> <span style={{ float: 'right', fontWeight: 'bold' }}>0</span>
                        </div>
                        <button className="card-btn" onClick={() => setSeccion("ordenes")}>Gestionar Órdenes</button>
                    </div>

                    {/* Widget 3: Próximos Mantenimientos */}
                    <div className="widget-card">
                        <div className="card-title">Próximos Mantenimientos</div>
                        <div className="list-item">
                            <div className="item-main">Compresor A-3</div>
                            <div className="item-sub">Tipo: Preventivo - 24/07/2024 <span className="tag-pending">Pendiente</span></div>
                        </div>
                        <div className="list-item">
                            <div className="item-main">Aire Acondicionado</div>
                            <div className="item-sub">Tipo: Correctivo - 25/07/2024 <span className="tag-pending">Pendiente</span></div>
                        </div>
                        <div className="list-item">
                            <div className="item-main">Bomba de agua</div>
                            <div className="item-sub">Tipo: Predictivo - 28/07/2024 <span className="tag-pending">Pendiente</span></div>
                        </div>
                        <button className="card-btn">Ver Calendario</button>
                    </div>

                    {/* Widget 4: Gráfico Costos */}
                    <div className="widget-card">
                        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Costos Mensuales
                            <select style={{ fontSize: '0.8rem', padding: '2px' }}>
                                <option>Mes</option>
                            </select>
                        </div>
                        <div className="bar-chart">
                            <div className="bar-group">
                                <div className="bar" style={{ height: '35%' }}>
                                    <span className="bar-value">35%</span>
                                </div>
                                <span className="bar-label">Ene</span>
                            </div>
                            <div className="bar-group">
                                <div className="bar" style={{ height: '45%' }}>
                                    <span className="bar-value">45%</span>
                                </div>
                                <span className="bar-label">Feb</span>
                            </div>
                            <div className="bar-group">
                                <div className="bar" style={{ height: '55%' }}>
                                    <span className="bar-value">55%</span>
                                </div>
                                <span className="bar-label">Mar</span>
                            </div>
                            <div className="bar-group">
                                <div className="bar" style={{ height: '75%' }}>
                                    <span className="bar-value">75%</span>
                                </div>
                                <span className="bar-label">Abr</span>
                            </div>
                            <div className="bar-group">
                                <div className="bar" style={{ height: '85%' }}>
                                    <span className="bar-value">85%</span>
                                </div>
                                <span className="bar-label">May</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fila 2: Listas Secundarias */}
                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>

                    {/* Categorías */}
                    <div className="widget-card">
                        <div className="card-title">Activos por categoría</div>
                        <div className="list-item">🚜 Maquinaria pesada: <b>400 (32%)</b></div>
                        <div className="list-item">🚗 Vehículos: <b>300 (24%)</b></div>
                        <div className="list-item">💻 Equipos de oficina: <b>200 (16%)</b></div>
                        <div className="list-item">🏗 Infraestructura: <b>150 (12%)</b></div>
                        <button className="card-btn">Gestionar Categorías</button>
                    </div>

                    {/* Actividad Reciente */}
                    <div className="widget-card">
                        <div className="card-title">Actividad Reciente</div>
                        <div className="list-item">
                            <div className="item-main">⚙ Orden #OT-2024-005 completada</div>
                            <div className="item-sub">Hace 10 min por Juan Pérez</div>
                        </div>
                        <div className="list-item">
                            <div className="item-main">🆕 Nuevo activo 'Motor V-12' añadido</div>
                            <div className="item-sub">Ayer 14:30 por María López</div>
                        </div>
                        <div className="list-item">
                            <div className="item-main">⚠ Alerta crítica: 'Compresor B-2' aceite bajo</div>
                            <div className="item-sub">Hace 3 horas por Sistema</div>
                        </div>
                        <button className="card-btn">Ver Historial Completo</button>
                    </div>

                    {/* Alertas */}
                    <div className="widget-card">
                        <div className="card-title" style={{ color: '#dc3545' }}>Alertas Críticas</div>
                        <div className="alert-row">
                            <span className="alert-icon">!</span> Nivel de aceite bajo en 'Compresor B-2'
                        </div>
                        <div className="alert-row">
                            <span className="alert-icon">!</span> Fallo de sensor en 'Línea de producción 3'
                        </div>
                        <div className="alert-row">
                            <span className="alert-icon">!</span> Activo 'Vehículo V-5' con ITV caducada
                        </div>
                        <button className="card-btn" style={{ backgroundColor: '#333' }}>Alertas de resolución</button>
                    </div>

                </div>
            </div>
        );
    };

    // --- Render Principal ---
    return (
        <div className="dashboard-container">
            {/* Sidebar Lateral */}
            <div className="sidebar">
                <div className="sidebar-logo">
                    <span className="logo-icon">☀</span> MAFIS
                </div>



                <div className="sidebar-menu">
                    <button className={`menu-item ${seccion === 'panel' ? 'active' : ''}`} onClick={() => setSeccion("panel")}>
                        <span className="menu-item-icon">📊</span> Panel
                    </button>
                    <button className={`menu-item ${seccion === 'reportes' ? 'active' : ''}`} onClick={() => setSeccion("reportes")}>
                        <span className="menu-item-icon">📋</span> Reportes de falla
                    </button>
                    {["administrador", "tecnico"].includes(user.rol) && (
                        <button className={`menu-item ${seccion === 'ordenes' ? 'active' : ''}`} onClick={() => setSeccion("ordenes")}>
                            <span className="menu-item-icon">📁</span> Órdenes de trabajo
                        </button>
                    )}
                    <button className={`menu-item ${seccion === 'activos' ? 'active' : ''}`} onClick={() => setSeccion("activos")}>
                        <span className="menu-item-icon">🏢</span> Gestión de activos
                    </button>


                </div>

                <div style={{ marginTop: 'auto', padding: '0 10px' }}>
                    <h6 style={{ paddingLeft: '15px', color: '#999', fontSize: '0.8rem', textTransform: 'uppercase' }}>Contactos</h6>
                    {user.rol === "administrador" && (
                        <button className={`menu-item ${seccion === 'usuarios' ? 'active' : ''}`} onClick={() => setSeccion("usuarios")}>
                            <span className="menu-item-icon">👥</span> Administración
                        </button>
                    )}
                    <button className="menu-item" onClick={onLogout}>
                        <span className="menu-item-icon">⚙</span> Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="main-content">
                {/* Topbar Superior */}
                <div className="topbar">
                    <div className="topbar-title">
                        {seccion === 'panel' && "Gestión de mantenimientos de Activos"}
                        {seccion === 'activos' && "Inventario de Activos"}
                        {seccion === 'reportes' && "Reportes de Falla"}
                        {seccion === 'ordenes' && "Órdenes de Trabajo"}
                        {seccion === 'usuarios' && "Gestión de Usuarios"}
                    </div>

                    <div className="search-bar">
                        <span>🔍</span>
                        <input type="text" className="search-input" placeholder="Buscar activos, tareas, ubicaciones..." />
                    </div>

                    <div className="user-profile">
                        <span>🔔</span>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.nombre}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>{user.rol}</div>
                        </div>
                        {/* Placeholder avatar */}
                        <div className="user-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {user.nombre.charAt(0)}
                        </div>
                    </div>
                </div>

                {/* Área Scrollable */}
                <div className="content-scroll">
                    {seccion === "panel" && <PanelOverview />}
                    {seccion === "activos" && <Activos />}
                    {seccion === "reportes" && <Reportes />}
                    {seccion === "ordenes" && <Ordenes />}
                    {seccion === "usuarios" && <Usuarios />}
                </div>
            </div>
        </div>
    );
}