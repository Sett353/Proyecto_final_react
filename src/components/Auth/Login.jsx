import { useEffect, useState } from 'react';
import './Login.css';
import { Eye, EyeOff, X } from 'lucide-react';

function Login({ onClose, onLogin }) {
const [usuario, setUsuario] = useState('');
const [contrasena, setContrasena] = useState('');
const [mostrarContrasena, setMostrarContrasena] = useState(false);

useEffect(() => {
    function manejarEscape(e) {
        if (e.key === 'Escape') {
            onClose();
        }
    }

    document.addEventListener('keydown', manejarEscape);
    return () => document.removeEventListener('keydown', manejarEscape);
}, [onClose]);

function manejarSubmit(e) {
e.preventDefault();
if (usuario.trim()) {
    onLogin(usuario.trim());
}
}

return (
<div className="login" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="login-caja" role="dialog" aria-modal="true" aria-labelledby="login-titulo">
        <button type="button" className="login-cerrar" onClick={onClose} aria-label="Cerrar inicio de sesión">
            <X size={21} />
        </button>
        <div className="login-encabezado">
            <span className="login-insignia">Carrera del dragón</span>
            <h2 id="login-titulo">Iniciar sesión</h2>
            <p>Continúa tu aventura y guarda tu progreso.</p>
        </div>
            
        <form onSubmit={manejarSubmit}>
            <label htmlFor="login-usuario">Usuario</label>
            <input id="login-usuario" type="text" placeholder="Escribe tu usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" autoFocus required />

            <label htmlFor="login-contrasena">Contraseña</label>
            <div className="login-contrasena">
                <input id="login-contrasena" type={mostrarContrasena ? 'text' : 'password'} placeholder="Escribe tu contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} autoComplete="current-password" required />
                <button type="button" className="login-mostrar" onClick={() => setMostrarContrasena((visible) => !visible)} aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {mostrarContrasena ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
            </div>

            <button type="submit" className="boton">Entrar a mi cuenta</button>
        </form>
    </div>
</div>
);
}

export default Login;