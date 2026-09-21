import './Escenario.css';
import Dragon from '../../components/Escenario/Dragon.jsx';
import BotonDerecha from '../../components/Escenario/BotonDerecha.jsx';
import BotonIzquierda from '../../components/Escenario/BotonIzquierda.jsx';
import BotonReiniciar from '../../components/Escenario/BotonReiniciar.jsx';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

function Escenario() {
    const { tema } = useTheme();
    const [posicion, setPosicion] = useState(0);
    const [direccion, setDireccion] = useState('izquierda');
    const limiteMaximo = 600;

    function moverDerecha() {
        setPosicion((valorActual) => Math.min(valorActual + 20, limiteMaximo));
        setDireccion('derecha');
    }

    function moverIzquierda() {
        setPosicion((valorActual) => Math.max(valorActual - 20, 0));
        setDireccion('izquierda');
    }

    function reset() {
        setPosicion(0);
        setDireccion('izquierda');
    }
    useEffect(() => {
        function manejarTecla(evento) {
            if (evento.key === "ArrowRight") {
                moverDerecha();
            } else if (evento.key === "ArrowLeft") {
                moverIzquierda();
            } else if (evento.key === "r" || evento.key === "R") {
                reset();
            }
        }
        window.addEventListener("keydown", manejarTecla);
        return () => window.removeEventListener("keydown", manejarTecla);
    }, []);
    

    return (
        <div className={`escenario-wrapper ${tema === 'oscuro' ? 'escenario-wrapper--oscuro' : ''}`}>
            <span
                className="dragon__posicion"
            >
                Posición: {posicion}px
            </span>
            <div className="escenario">
                <Dragon posicion={posicion} direccion={direccion} />
            </div>
            <div className="controles">

                <BotonIzquierda mover={moverIzquierda} />
                <BotonReiniciar mover={reset} />
                <BotonDerecha mover={moverDerecha} />
            </div>
        </div>
    );
}

export default Escenario;
