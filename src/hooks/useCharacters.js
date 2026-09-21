import { useState, useEffect } from "react";

const RANGO_PRECIO = { min: 7000, max: 50000 };


function precioAleatorio() {
  return Math.floor(Math.random() * (RANGO_PRECIO.max - RANGO_PRECIO.min + 1)) + RANGO_PRECIO.min;
}

export function useCharacters(limit = 12) {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true; // evita actualizar el estado si el componente ya se desmontó
    async function cargarPersonajes() {
      try {
        setCargando(true);
        const resPersonajes = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion.json"
        );
        if (!resPersonajes.ok) throw new Error("No se pudo cargar el catálogo");

        const dataPersonajes = await resPersonajes.json();
        const lista = Object.values(dataPersonajes.data).slice(0, limit);
        const listaConDetalles = lista.map((personaje) => ({
          ...personaje,
          image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${personaje.id}_0.jpg`,
          precio: precioAleatorio(),
        }));

        if (activo) setPersonajes(listaConDetalles);
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarPersonajes(); //Se ejecuta la función definida
    return () => { activo = false; }; //Esta es una función de cleanup de limpieza
  }, [limit]);

  return { personajes, cargando, error };
}