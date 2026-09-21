import { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
    const [tema, setTema] = useState(() => {
        const temaGuardado = localStorage.getItem("tema-preferido");
        return temaGuardado === "oscuro" ? "oscuro" : "claro";
    });
    const cambiarTema = () => {
        setTema((actual) => (actual === "claro" ? "oscuro" : "claro"));
    };
    // Cada vez que "tema" cambia, agregamos o quitamos la clase "dark" en <html>
    useEffect(() => {
        const root = document.documentElement;
        if (tema === "oscuro") {
            root.classList.add("dark");
            root.style.colorScheme = "dark";
        } else {
            root.classList.remove("dark");
            root.style.colorScheme = "light";
        }
        localStorage.setItem("tema-preferido", tema);
    }, [tema]);
    return (
        <ThemeContext.Provider value={{ tema, cambiarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}
export function useTheme() {
    return useContext(ThemeContext);
}
