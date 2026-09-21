import perfil from '../../assets/perfil.png';
import './Perfil.css';
import { ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const RANGOS = {
    invitado: { titulo: 'Explorador', lema: 'Aún no has alzado el vuelo' },
    registrado: { titulo: 'Jinete de bronce', lema: 'Listo para tu próxima expedición' },
};

function Perfil() {
    const usuario = localStorage.getItem('usuario-sesion') || 'Invitado';
    const sesionActiva = usuario !== 'Invitado';
    const iniciales = usuario
        .split(' ')
        .map((parte) => parte[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    const rango = sesionActiva ? RANGOS.registrado : RANGOS.invitado;
    const fechaHoy = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' }).format(new Date());

    return (
        <section className="perfil-pagina">
            <div className="perfil-cabecera">
                <div>
                    <p className="perfil-etiqueta">Área personal</p>
                    <h2>Tu carnet de jinete</h2>
                </div>
                <span className={`perfil-estado ${sesionActiva ? 'perfil-estado-activo' : ''}`}>
                    <span className="perfil-estado-punto" />
                    {sesionActiva ? 'Sesión activa' : 'Sin sesión'}
                </span>
            </div>

            <div className="perfil-carnet">
                <div className="perfil-carnet-identidad">
                    <div className="perfil-imagen-contenedor">
                        <img src={perfil} alt={`Perfil de ${usuario}`} className="perfil-pagina-imagen" />
                        <span className="perfil-iniciales">{iniciales}</span>
                    </div>
                    <div>
                        <p className="perfil-rango">
                            <Flame size={15} />
                            {rango.titulo}
                        </p>
                        <h3>{usuario}</h3>
                        <p className="perfil-lema">{rango.lema}</p>
                    </div>
                </div>

                <div className="perfil-carnet-sello">
                    <div className="perfil-sello-item">
                        <span>Estado</span>
                        <strong>{sesionActiva ? 'Verificado' : 'Pendiente de acceso'}</strong>
                    </div>
                    <div className="perfil-sello-divisor" />
                    <div className="perfil-sello-item">
                        <span>{sesionActiva ? 'Miembro desde' : 'Visto hoy'}</span>
                        <strong>{fechaHoy}</strong>
                    </div>
                </div>
            </div>

            <div className="perfil-accesos">
                <div>
                    <p className="perfil-subtitulo">Siguiente parada</p>
                    <p className="perfil-texto-secundario">
                        {sesionActiva ? 'Sigue explorando lo nuevo del catálogo.' : 'Inicia sesión para guardar tu progreso.'}
                    </p>
                </div>
                <div className="perfil-botones">
                    <Link to="/catalogo" className="perfil-boton perfil-boton-principal">
                        Ver catálogo
                        <ArrowRight size={17} />
                    </Link>
                    <Link to="/contacto" className="perfil-boton perfil-boton-secundario">
                        Contacto
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Perfil;