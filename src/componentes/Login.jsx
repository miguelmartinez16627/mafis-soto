import { useState } from "react";
import { API_URL } from "../config";
import "./Login.css";

export default function Login({ onLogin }) {
    const [vista, setVista] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState("solicitante");

    // ---------- LOGIN ----------
    const login = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            alert("Credenciales inválidas");
            return;
        }
        const { token, user } = await res.json();
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(user);
    };

    // ---------- REGISTRO ----------
    const register = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password, rol }),
        });
        if (!res.ok) {
            const msg = await res.json();
            alert(msg.error || "Error al registrar");
            return;
        }
        alert("Usuario creado");
        setVista("login");
    };

    // ---------- RECUPERAR ----------
    const recover = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/api/recover`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) {
            const msg = await res.json();
            alert(msg.error || "Error al recuperar");
            return;
        }
        alert("Revisa tu bandeja (simulado)");
        setVista("login");
    };

    // Vista actual
    return (
        <div className="login-container">
            {/* Encabezado Común */}
            <div className="login-header">
                <div className="logo-circle">SENA</div>
                <h1 className="title-mafis">MAFIS</h1>
                <p className="subtitle">
                    Sistema de gestión de mantenimiento de activos fijos<br />
                    servicio nacional de aprendizaje sena
                </p>
                <div className="section-title">
                    {vista === "login" && "Inicio de sesión"}
                    {vista === "register" && "Crear cuenta"}
                    {vista === "recover" && "Recuperar contraseña"}
                </div>
            </div>

            {/* Tarjeta de Contenido */}
            <div className="login-card">
                {vista === "login" && (
                    <form onSubmit={login}>
                        <div className="form-group">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-login">
                            Iniciar sesión
                        </button>
                        <div className="login-links" style={{ justifyContent: 'center', gap: '5px' }}>
                            <button type="button" className="login-link" onClick={() => setVista("register")}>
                                Crear cuenta
                            </button>
                            <span className="Link-separator">|</span>
                            <button type="button" className="login-link" onClick={() => setVista("recover")}>
                                Olvidé mi contraseña
                            </button>
                        </div>
                    </form>
                )}

                {vista === "register" && (
                    <form onSubmit={register}>
                        <div className="form-group">
                            <label className="form-label">Nombre Completo</label>
                            <input
                                className="form-input"
                                placeholder="Nombre completo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Rol</label>
                            <select
                                className="form-input" // Reusing input styles for select
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="solicitante">Solicitante</option>
                                <option value="tecnico">Técnico</option>
                                <option value="administrador">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-login" style={{ backgroundColor: '#198754' }}>
                            Crear cuenta
                        </button>
                        <div className="text-center">
                            <button
                                type="button"
                                className="login-link"
                                onClick={() => setVista("login")}
                            >
                                Volver al inicio de sesión
                            </button>
                        </div>
                    </form>
                )}

                {vista === "recover" && (
                    <form onSubmit={recover}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                            Ingresa tu correo para recibir instrucciones de recuperación.
                        </p>
                        <div className="form-group">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email de tu cuenta"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-login" style={{ backgroundColor: '#ffc107', color: '#000' }}>
                            Enviar enlace
                        </button>
                        <div className="text-center">
                            <button
                                type="button"
                                className="login-link"
                                onClick={() => setVista("login")}
                            >
                                Volver al inicio de sesión
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}