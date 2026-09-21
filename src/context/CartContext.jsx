import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CLAVE_CARRITO = "carrito";
const CLAVE_CARRITO_ANTERIOR = "league-catalogo-carrito";
const PORCENTAJE_IVA = 0.19;
const CartContext = createContext(null);

// Lee el carrito guardado y devuelve un arreglo válido para el estado inicial.
function leerCarritoDesdeStorage() {
    try {
        const data = localStorage.getItem(CLAVE_CARRITO)
            ?? localStorage.getItem(CLAVE_CARRITO_ANTERIOR);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState(leerCarritoDesdeStorage);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [carritoVisible, setCarritoVisible] = useState(false);
    const [carritoCerrando, setCarritoCerrando] = useState(false);
    const [carritoAnimado, setCarritoAnimado] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [confirmandoPago, setConfirmandoPago] = useState(false);

    useEffect(() => {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    }, [carrito]);

    function mostrarMensaje(texto, tipo = "exito") {
        setMensaje({ texto, tipo });
        window.setTimeout(() => setMensaje(null), 1000);
    }

    function abrirCarrito() {
        setCarritoCerrando(false);
        setCarritoVisible(true);
        setCarritoAbierto(true);
    }

    function cerrarCarrito() {
        setCarritoCerrando(true);
        setCarritoAbierto(false);
        window.setTimeout(() => {
            setCarritoVisible(false);
            setCarritoCerrando(false);
        }, 250);
    }

    const agregarAlCarrito = useCallback((personaje) => {
        setCarritoAnimado(true);
        window.setTimeout(() => setCarritoAnimado(false), 550);
        setCarrito((carritoActual) => {
            const productoExistente = carritoActual.find((producto) => producto.id === personaje.id);

            if (productoExistente) {
                return carritoActual.map((producto) => (
                    producto.id === personaje.id
                        ? { ...producto, cantidad: producto.cantidad + 1 }
                        : producto
                ));
            }

            return [...carritoActual, { ...personaje, cantidad: 1 }];
        });
        mostrarMensaje(`${personaje.name} se agregó al carrito.`);
    }, []);

    function cambiarCantidad(id, cantidad) {
        const cantidadSegura = Math.max(1, cantidad);

        setCarrito((carritoActual) => carritoActual.map((producto) => (
            producto.id === id ? { ...producto, cantidad: cantidadSegura } : producto
        )));
    }

    function eliminarDelCarrito(producto) {
        setCarrito((carritoActual) => carritoActual.filter((item) => item.id !== producto.id));
        mostrarMensaje(`${producto.name} se eliminó del carrito.`, "info");
    }

    function vaciarCarrito() {
        setCarrito([]);
        mostrarMensaje("El carrito se vació.", "info");
    }

    function pagarCarrito() {
        if (carrito.length) {
            setConfirmandoPago(true);
        }
    }

    function cancelarPago() {
        setConfirmandoPago(false);
    }

    function confirmarPago() {
        setConfirmandoPago(false);
        setCarrito([]);
        cerrarCarrito();
        mostrarMensaje("Pago realizado correctamente. ¡Gracias por tu compra!");
    }

    const cantidadProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const subtotalCarrito = carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
    );
    const ivaCarrito = subtotalCarrito * PORCENTAJE_IVA;
    const totalCarrito = subtotalCarrito + ivaCarrito;

    return (
        <CartContext.Provider
            value={{
                carrito,
                carritoAbierto,
                carritoVisible,
                carritoCerrando,
                carritoAnimado,
                mensaje,
                confirmandoPago,
                cantidadProductos,
                subtotalCarrito,
                ivaCarrito,
                totalCarrito,
                abrirCarrito,
                cerrarCarrito,
                agregarAlCarrito,
                cambiarCantidad,
                eliminarDelCarrito,
                vaciarCarrito,
                pagarCarrito,
                cancelarPago,
                confirmarPago,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart debe usarse dentro de CartProvider");
    }

    return context;
}
