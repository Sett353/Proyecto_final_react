import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar(){
    return(
        <>
            <nav className="navbar">
                <ul className="menu">
                    <li>
                        <Link to="/">
                        Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to="/catalogo">
                            Catálogo
                        </Link>
                    </li>
                    <li>
                        <Link to="/escenario">
                            Diviertete
                        </Link>
                    </li>
                    <li>
                        <Link to="/contacto">
                            Contactame
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );    
}

export default Navbar;