import Header from "./Header.jsx";
import Navbar from "./Navbar.jsx";
import "./Layout.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const CLAVE_USUARIO = "usuario-sesion";
const EVENTO_SESION = "sesion-actualizada";

function Layout( { children }){
    const [usuario, setUsuario] = useState(() => localStorage.getItem(CLAVE_USUARIO));

    useEffect(() => {
        function actualizarUsuario() {
            setUsuario(localStorage.getItem(CLAVE_USUARIO));
        }

        window.addEventListener(EVENTO_SESION, actualizarUsuario);
        return () => window.removeEventListener(EVENTO_SESION, actualizarUsuario);
    }, []);

    return(
        <>
            <Header/>
            <Navbar/>
            <main>
                {children}
            </main>
            <footer className="border-t border-violet-200 bg-violet-950 text-violet-100 dark:border-violet-900 dark:bg-black" role="contentinfo">
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-3 text-xl font-bold text-white transition-colors hover:text-fuchsia-300">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-400 text-violet-950">R7</span>
                            React705
                        </Link>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-violet-200">
                            Un espacio para aprender React, explorar APIs y construir experiencias web modernas.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-fuchsia-300">Explora</h2>
                        <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-violet-200" aria-label="Enlaces del pie de página">
                            <Link to="/" className="transition-colors hover:text-white">Inicio</Link>
                            <Link to="/escenario" className="transition-colors hover:text-white">Escenario</Link>
                            <Link to="/catalogo" className="transition-colors hover:text-white">Catálogo</Link>
                            <Link to="/contacto" className="transition-colors hover:text-white">Contáctame</Link>
                        </nav>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-fuchsia-300">Proyecto</h2>
                        <p className="mt-4 text-sm leading-6 text-violet-200">
                            Desarrollado con React, Vite, React Router y Tailwind CSS.
                        </p>
                        {usuario ? (
                            <Link to="/perfil" className="mt-4 inline-flex text-sm font-semibold text-fuchsia-300 transition-colors hover:text-white">
                                Ver perfil
                            </Link>
                        ) : (
                            <span className="mt-4 inline-flex text-sm text-violet-400">
                                Inicia sesión para ver tu perfil
                            </span>
                        )}
                    </div>
                </div>
                <div className="border-t border-violet-800/70">
                    <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-violet-300 sm:flex-row sm:items-center sm:justify-between">
                        <p>© 2026 React705. Todos los derechos reservados.</p>
                        <p>Aprendiendo desarrollo web moderno</p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Layout;