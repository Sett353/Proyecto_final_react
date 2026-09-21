import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from './components/Layout/Layout.jsx';
import Escenario from "./pages/Escenario/Escenario.jsx";
import Inicio from "./pages/Inicio/Inicio.jsx";
import Producto from "./pages/Catalogo/Producto.jsx";
import Contacto from "./pages/Contacto/Contacto.jsx";
import Perfil from "./pages/Perfil/Perfil.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <>
      <ThemeProvider>
        <CartProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route
                  path="/"
                  element={<Inicio />}
                />
                <Route
                  path="/escenario"
                  element={<Escenario />}
                />
                <Route
                  path="/catalogo"
                  element={<Producto />}
                />
                <Route
                  path="/contacto"
                  element={<Contacto />}
                />
                <Route
                  path="/perfil"
                  element={<Perfil />}
                />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
    </>
  )
}

export default App
