import imagen from '../../assets/Logo.png';
import perfil from '../../assets/perfil.png';
import './Header.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Minus, Plus, ShoppingCart, Sun, Moon, Trash2, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import Login from '../Auth/Login.jsx';

const CLAVE_USUARIO = "usuario-sesion";
const EVENTO_SESION = "sesion-actualizada";

function formatearPrecio(valor) {
    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    });
}

function Header() {
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [usuario, setUsuario] = useState(() => localStorage.getItem(CLAVE_USUARIO));
    const [mensajeSesion, setMensajeSesion] = useState(null);
    const navigate = useNavigate();
    const { tema, cambiarTema } = useTheme();
    const {
        carrito,
        carritoVisible,
        carritoCerrando,
        mensaje,
        confirmandoPago,
        cantidadProductos,
        subtotalCarrito,
        ivaCarrito,
        totalCarrito,
        abrirCarrito,
        cerrarCarrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        pagarCarrito,
        cancelarPago,
        confirmarPago,
    } = useCart();

    function manejarLogin(nombreUsuario) {
        setUsuario(nombreUsuario);
        localStorage.setItem(CLAVE_USUARIO, nombreUsuario);
        window.dispatchEvent(new Event(EVENTO_SESION));
        setMostrarLogin(false);
        setMensajeSesion(`Bienvenido, ${nombreUsuario}. Inicio de sesión exitoso.`);
        window.setTimeout(() => setMensajeSesion(null), 2500);
    }

    function cerrarSesion() {
        setUsuario(null);
        localStorage.removeItem(CLAVE_USUARIO);
        window.dispatchEvent(new Event(EVENTO_SESION));
        setMensajeSesion("Sesión cerrada correctamente.");
        window.setTimeout(() => setMensajeSesion(null), 2500);
        navigate("/");
    }

    return (
        <>
            <header className="Header">
                <div className="logo-container">
                    <Link to="/">
                        <img src={imagen} alt="Yuzhong" className="cabecera_imagen" />
                    </Link>
                    <h1 className="cabecera_titulo">Carrera del dragón</h1>
                </div>
                <div className="login-container">
                    <button
                        type="button"
                        onClick={abrirCarrito}
                        title="Ver carrito"
                        className="relative p-2"
                    >
                        <ShoppingCart size={25} />
                        {cantidadProductos > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-400 text-xs font-bold text-white">
                                {cantidadProductos}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={cambiarTema} //Paso la porp cambiarTema
                        title={tema === "claro" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
                        className="p-2 rounded-full hover:bg-slate-700/20 transition-colors"
                    >
                        {tema === "claro" ? <Moon size={35} /> : <Sun size={35} />}
                    </button>
                    {usuario && (
                        <Link to="/perfil" className="perfil-link" title={`Ver perfil de ${usuario}`}>
                            <img src={perfil} alt={`Perfil de ${usuario}`} className="perfil-avatar" />
                        </Link>
                    )}
                    {usuario ? (
                        <button type="button" className="btn-login" onClick={cerrarSesion}>
                            Cerrar sesión
                        </button>
                    ) : (
                        <button type="button" className="btn-login" onClick={() => setMostrarLogin(true)}>
                            Iniciar sesión
                        </button>
                    )}
                </div>
            </header>
            {mostrarLogin && (
                <Login
                    onClose={() => setMostrarLogin(false)}
                    onLogin={manejarLogin}
                />
            )}
            {mensajeSesion && (
                <div
                    role="status"
                    className="fixed right-5 top-5 z-90 rounded-lg bg-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-lg"
                >
                    {mensajeSesion}
                </div>
            )}
            {mensaje && (
                <div
                    role="status"
                    className={`pointer-events-none fixed bottom-24 left-1/2 z-80 w-[min(90vw,24rem)] -translate-x-1/2 rounded-lg px-4 py-3 text-center text-sm font-semibold shadow-lg ${
                        mensaje.tipo === "info" ? "bg-zinc-800 text-violet-100" : "bg-violet-700 text-white"
                    }`}
                >
                    {mensaje.texto}
                </div>
            )}

            {carritoVisible && (
                <>
                    <button
                        type="button"
                        aria-label="Cerrar carrito"
                        onClick={cerrarCarrito}
                        className="fixed inset-0 z-40 cursor-default bg-black/45 dark:bg-black/65"
                    />
                    <aside className={`carrito-panel-animado ${carritoCerrando ? "carrito-panel-cerrando" : ""} fixed inset-y-0 right-0 z-50 w-80 overflow-y-auto bg-white p-5 shadow-2xl ring-1 ring-violet-200 dark:bg-zinc-900 dark:ring-violet-900 sm:w-96`}>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-violet-900 dark:text-violet-50">Tu carrito</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{cantidadProductos} producto(s)</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {carrito.length > 0 && (
                                    <button type="button" onClick={vaciarCarrito} className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300">
                                        Vaciar
                                    </button>
                                )}
                                <button type="button" onClick={cerrarCarrito} className="rounded-full p-2 text-zinc-400 hover:bg-violet-950 hover:text-violet-50" title="Cerrar carrito" aria-label="Cerrar carrito">
                                    <X size={21} />
                                </button>
                            </div>
                        </div>

                        {carrito.length === 0 ? (
                            <p className="mt-5 rounded-lg bg-violet-50 p-5 text-center text-zinc-500 dark:bg-black/30 dark:text-zinc-400">Tu carrito está vacío.</p>
                        ) : (
                            <>
                                <div className="mt-5 space-y-3">
                                    {carrito.map((producto) => (
                                        <div key={producto.id} className="flex items-center gap-3 border-b border-violet-950 pb-3">
                                            <img src={producto.image} alt={producto.name} className="h-14 w-20 rounded-md object-cover object-center" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-zinc-900 dark:text-violet-50">{producto.name}</p>
                                                <p className="text-sm text-fuchsia-600 dark:text-fuchsia-400">{formatearPrecio(producto.precio)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => cambiarCantidad(producto.id, producto.cantidad - 1)} disabled={producto.cantidad === 1} className="rounded border border-violet-300 p-1 text-violet-700 hover:border-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-800 dark:text-violet-300" title="Disminuir cantidad">
                                                    <Minus size={15} />
                                                </button>
                                                <span className="w-5 text-center text-sm font-semibold text-zinc-800 dark:text-violet-100">{producto.cantidad}</span>
                                                <button type="button" onClick={() => cambiarCantidad(producto.id, producto.cantidad + 1)} className="rounded border border-violet-300 p-1 text-violet-700 hover:border-fuchsia-400 dark:border-violet-800 dark:text-violet-300" title="Aumentar cantidad">
                                                    <Plus size={15} />
                                                </button>
                                            </div>
                                            <button type="button" onClick={() => eliminarDelCarrito(producto)} className="p-1 text-fuchsia-400 hover:text-fuchsia-300" title="Eliminar producto">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 space-y-2 border-t border-violet-200 pt-4 text-sm dark:border-violet-950">
                                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300"><span>Subtotal</span><span>{formatearPrecio(subtotalCarrito)}</span></div>
                                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300"><span>IVA (19%)</span><span>{formatearPrecio(ivaCarrito)}</span></div>
                                    <div className="flex items-center justify-between pt-2"><span className="font-semibold text-zinc-800 dark:text-violet-200">Total</span><span className="text-xl font-bold text-fuchsia-600 dark:text-fuchsia-400">{formatearPrecio(totalCarrito)}</span></div>
                                </div>
                                <button type="button" onClick={pagarCarrito} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-fuchsia-600">
                                    <CreditCard size={19} />
                                    Pagar carrito
                                </button>
                            </>
                        )}
                    </aside>
                </>
            )}

            {confirmandoPago && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/55 px-4" role="presentation" onClick={cancelarPago}>
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-violet-200 dark:bg-zinc-900 dark:ring-violet-900" role="dialog" aria-modal="true" aria-labelledby="confirmacion-pago-titulo" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-start gap-4">
                            <div className="rounded-full bg-violet-100 p-3 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><CreditCard size={24} /></div>
                            <div>
                                <h3 id="confirmacion-pago-titulo" className="text-xl font-bold text-zinc-900 dark:text-violet-50">Confirmar pago</h3>
                                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">¿Deseas finalizar la compra por {formatearPrecio(totalCarrito)}?</p>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button type="button" onClick={cancelarPago} className="rounded-lg border border-violet-200 px-4 py-2.5 font-semibold text-zinc-700 transition-colors hover:border-fuchsia-400 hover:text-fuchsia-600 dark:border-violet-800 dark:text-violet-200">Cancelar</button>
                            <button type="button" onClick={confirmarPago} className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-fuchsia-600"><CreditCard size={18} />Confirmar pago</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header;