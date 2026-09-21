import { useCharacters } from "../../hooks/useCharacters";
import CharacterCard from "../../components/Catalogo/CharacterCard";
import { ChevronLeft, ChevronRight, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

// Cantidad máxima de personajes mostrados por página.
const PERSONAJES_POR_PAGINA = 12;

// Convierte un valor numérico a formato de moneda colombiana.
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

// Renderiza el catálogo, el buscador, el carrito y el detalle del personaje.
function Productos() {
  // Datos del catálogo y estados de carga o error provenientes del hook.
  const { personajes, cargando, error } = useCharacters(100);
  const {
    carrito,
    carritoAbierto,
    carritoAnimado,
    cantidadProductos,
    abrirCarrito,
    agregarAlCarrito,
  } = useCart();
  // Personaje que se muestra actualmente en el modal de detalle.
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  // Texto escrito en el buscador del catálogo.
  const [busqueda, setBusqueda] = useState("");
  // Número de la página visible actualmente.
  const [paginaActual, setPaginaActual] = useState(1);

  // Personajes que coinciden con el texto de búsqueda.
  const personajesFiltrados = personajes.filter((personaje) => {
    const texto = `${personaje.name} ${personaje.title} ${personaje.tags.join(" ")} ${personaje.partype}`;
    return texto.toLowerCase().includes(busqueda.trim().toLowerCase());
  });
  // Número de páginas necesarias para mostrar los resultados filtrados.
  const totalPaginas = Math.ceil(personajesFiltrados.length / PERSONAJES_POR_PAGINA);
  const paginas = Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
  // Personajes que corresponden únicamente a la página actual.
  const personajesDeLaPagina = personajesFiltrados.slice(
    (paginaActual - 1) * PERSONAJES_POR_PAGINA,
    paginaActual * PERSONAJES_POR_PAGINA
  );

  // Devuelve el catálogo a la primera página cuando cambia la búsqueda.
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // Corrige la página activa si un filtro reduce el número de páginas disponibles.
  useEffect(() => {
    if (totalPaginas > 0 && paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);


  return (
    <section id="catalogo" className="bg-violet-50 dark:bg-zinc-950 min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-violet-50">Catálogo</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Campeones de League of Legends disponibles en la tienda
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-md">
            <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
            <input
              type="search"
              value={busqueda}
              onChange={(event) => {
                setBusqueda(event.target.value);
                setPaginaActual(1);
              }}
              placeholder="Buscar campeón, rol o recurso..."
              className="w-full rounded-lg border border-violet-200 dark:border-violet-900 bg-white dark:bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-zinc-900 dark:text-violet-50
              outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900"
            />
          </label>
        </div>

        {cargando && <p className="mt-10 text-center text-zinc-500">Cargando personajes...</p>}
        {error && <p className="mt-10 text-center text-fuchsia-400">{error}</p>}

        {!cargando && !error && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                  gap-6">
            {personajesDeLaPagina.map((personaje) => (
              <CharacterCard
                key={personaje.id}
                personaje={personaje}
                onVerDetalle={setPersonajeSeleccionado}
              />
            ))}
          </div>
        )}
        {!cargando && !error && personajesFiltrados.length > 0 && (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación del catálogo">
            <button
              type="button"
              onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
              disabled={paginaActual === 1}
              aria-label="Página anterior"
              className="rounded-lg border border-violet-200 bg-white p-2 text-violet-700 transition-colors hover:border-fuchsia-400 hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-900 dark:bg-zinc-900 dark:text-violet-300"
            >
              <ChevronLeft size={20} />
            </button>
            {paginas.map((pagina) => (
              <button
                key={pagina}
                type="button"
                onClick={() => {
                  setPaginaActual(pagina);
                  document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                aria-label={`Ir a la página ${pagina}`}
                aria-current={paginaActual === pagina ? "page" : undefined}
                className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                  paginaActual === pagina
                    ? "border-violet-700 bg-violet-700 text-white shadow-md"
                    : "border-violet-200 bg-white text-violet-700 hover:border-fuchsia-400 hover:text-fuchsia-600 dark:border-violet-900 dark:bg-zinc-900 dark:text-violet-300"
                }`}
              >
                {pagina}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPaginaActual((pagina) => Math.min(totalPaginas, pagina + 1))}
              disabled={paginaActual === totalPaginas}
              aria-label="Página siguiente"
              className="rounded-lg border border-violet-200 bg-white p-2 text-violet-700 transition-colors hover:border-fuchsia-400 hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-900 dark:bg-zinc-900 dark:text-violet-300"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        )}
        {!cargando && !error && personajesFiltrados.length === 0 && (
          <p className="mt-10 rounded-lg bg-white dark:bg-zinc-900 p-8 text-center text-zinc-500 dark:text-zinc-400 ring-1 ring-violet-200 dark:ring-violet-950">
            No se encontraron campeones para “{busqueda}”.
          </p>
        )}
      </div>

      {personajeSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 dark:bg-black/80 px-4 py-6"
          onClick={() => setPersonajeSeleccionado(null)}
          role="presentation"
        >
          <article
            className="relative grid w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl
            md:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPersonajeSeleccionado(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/80 p-2 text-violet-100 hover:bg-fuchsia-600
              hover:text-white transition-colors"
              title="Cerrar detalle"
              aria-label="Cerrar detalle"
            >
              <X size={22} />
            </button>

            <img
              src={personajeSeleccionado.image}
              alt={personajeSeleccionado.name}
              decoding="async"
              className="h-80 w-full bg-violet-950 dark:bg-black object-contain object-center md:h-full md:min-h-150"
            />

            <div className="p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-fuchsia-400">
                {personajeSeleccionado.tags.join(" / ")}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-violet-50">
                {personajeSeleccionado.name}
              </h2>
              <p className="mt-1 text-lg text-zinc-500 dark:text-zinc-400">{personajeSeleccionado.title}</p>
              <p className="mt-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{personajeSeleccionado.blurb}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-zinc-500">Recurso</dt>
                  <dd className="font-semibold text-zinc-800 dark:text-violet-100">{personajeSeleccionado.partype}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Precio</dt>
                  <dd className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                    {personajeSeleccionado.precio.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    })}
                  </dd>
                </div>
              </dl>

              <h3 className="mt-7 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Estadísticas
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                <span>Ataque: {personajeSeleccionado.info.attack}</span>
                <span>Defensa: {personajeSeleccionado.info.defense}</span>
                <span>Magia: {personajeSeleccionado.info.magic}</span>
                <span>Dificultad: {personajeSeleccionado.info.difficulty}</span>
              </div>
              <button
                type="button"
                onClick={() => agregarAlCarrito(personajeSeleccionado)}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-800 px-4 py-3
                font-semibold text-violet-50 transition-colors hover:bg-fuchsia-600 hover:text-white"
              >
                <ShoppingCart size={19} />
                Agregar al carrito
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

export default Productos;
