import { Eye, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

function formatearPrecio(valor) {
    return valor.toLocaleString("es-CO", {
        style: "currency",   //para mostrar el numero con moneda
        currency: "COP", // Peso colombiano
        maximumFractionDigits: 0,    // este es para decir que sin decimales
    });
}
export default function CharacterCard({ personaje, onVerDetalle }) {
    const { agregarAlCarrito } = useCart();

    return (
        <article className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-violet-200 dark:ring-violet-950 overflow-hidden hover:shadow-lg
        hover:-translate-y-1 transition-all duration-300">
            <div className="relative">
                <img
                    src={personaje.image}
                    alt={personaje.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 object-cover object-center"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium
            bg-violet-950/80 dark:bg-black/80 text-fuchsia-300 ring-1 ring-violet-400/30">
                    {personaje.tags.join(" / ")}
                </span>
            </div>


            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-violet-50 text-lg leading
                    tight">{personaje.name}</h3>
                    <span className="text-xs text-zinc-500 shrink-0">#{personaje.id}</span>
                </div>


                <ul className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <li><span className="text-zinc-500">Rol:</span> {personaje.tags.join(" / ")}</li>
                    <li><span className="text-zinc-500">Recurso:</span> {personaje.partype}</li>
                    <li><span className="text-zinc-500">Titulo:</span> {personaje.title}</li>
                </ul>


                <div className="mt-4 flex items-center justify-between">
                    <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold text- 
                    lg">{formatearPrecio(personaje.precio)}</span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onVerDetalle(personaje)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 dark:border-violet-800 px-3 py-2 text-sm
                            font-medium text-violet-800 dark:text-violet-200 hover:border-fuchsia-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-300 transition-colors"
                        >
                            <Eye size={17} />
                            Ver detalle
                        </button>
                        <button
                            type="button"
                            onClick={() => agregarAlCarrito(personaje)}
                            className="p-2 rounded-full bg-violet-900 dark:bg-black text-violet-100 hover:bg-violet-600 hover:text-white transition
                                colors"
                            title="Agregar al carrito"
                        >
                            <ShoppingCart size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
