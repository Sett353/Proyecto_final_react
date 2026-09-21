import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";

function FormFile({
    label,
    name,
    required = false,
    error = "",
    accept = { "application/pdf": [".pdf"] },
    maxSizeMB = 2,
    maxFiles = 3, // cantidad máxima de archivos permitidos
    onFilesChange = () => { },
}) {
    const MAX_SIZE_MB = maxSizeMB;
    const [errorMsg, setErrorMsg] = useState("");

    const [archivos, setArchivos] = useState([]);
    
    useEffect(() => {
        onFilesChange(archivos.map((a) => a.file));
    }, [archivos]);


    // mensaje temporal al eliminar un archivo
    const [mensajeEliminado, setMensajeEliminado] = useState("");

    const generarId = (file) => `${file.name}-${file.lastModified}-${file.size}`;

    const limiteAlcanzado = archivos.length >= maxFiles;

    // libera las URLs de preview al desmontar
    useEffect(() => {
        return () => {
            archivos.forEach((a) => {
                if (a.preview) URL.revokeObjectURL(a.preview);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mensajeEliminado) {
            const timer = setTimeout(() => {
                setMensajeEliminado("");
            }, 3000);
            // cancela el timer si el mensaje cambia antes
            return () => clearTimeout(timer);
        }
    }, [mensajeEliminado]);

    const onDrop = (acceptedFiles, rejectedFiles) => {
        setErrorMsg("");

        if (acceptedFiles.length > 0) {
            // espacio disponible según lo ya subido
            const espacioDisponible = maxFiles - archivos.length;

            if (espacioDisponible <= 0) {
                setErrorMsg(`Ya alcanzaste el máximo de ${maxFiles} archivos`);
            } else {
                // toma solo los archivos que quepan en el espacio disponible
                const nuevosArchivos = acceptedFiles
                    .slice(0, espacioDisponible)
                    .map((file) => ({
                        id: generarId(file),
                        file,
                        // preview solo si es una imagen
                        preview: file.type.startsWith("image/")
                            ? URL.createObjectURL(file)
                            : null,
                    }));

                setArchivos((anteriores) => [...anteriores, ...nuevosArchivos]);

                if (acceptedFiles.length > espacioDisponible) {
                    setErrorMsg(
                        `Solo se agregaron ${espacioDisponible} archivo(s). Máximo ${maxFiles} en total.`
                    );
                }
            }
        }
        console.log(acceptedFiles);

        if (rejectedFiles.length > 0) {
            const primerError = rejectedFiles[0].errors[0];
            if (primerError.code === "file-too-large") {
                setErrorMsg(`El archivo supera el tamaño máximo de ${maxSizeMB}MB`);
            } else if (primerError.code === "file-invalid-type") {
                setErrorMsg("Tipo de archivo no permitido");
            } else if (primerError.code === "too-many-files") {
                setErrorMsg(`Ya alcanzaste el máximo de ${maxFiles} archivos`);
            } else {
                setErrorMsg(primerError.message);
            }
        }
        console.log({ acceptedFiles, rejectedFiles });
    };

    // elimina por id, no por índice
    const eliminarArchivo = (id) => {
        setArchivos((anteriores) => {
            // libera el preview antes de eliminar
            const archivoAEliminar = anteriores.find((arch) => arch.id === id);
            if (archivoAEliminar?.preview) {
                URL.revokeObjectURL(archivoAEliminar.preview);
            }
            return anteriores.filter((arch) => arch.id !== id);
        });

        setMensajeEliminado("Archivo eliminado correctamente");
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        onDrop,
        multiple: true,
        maxFiles: maxFiles, // límite por tanda (no acumulado)
        maxSize: MAX_SIZE_MB * 1024 * 1024, // dropzone trabaja en bytes
        accept,
        disabled: limiteAlcanzado,
    });

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={name}
                className='block mb-1.5 text-sm font-semibold text-violet-900 dark:text-violet-200'
            >
                {label} {required && <span className="text-fuchsia-400">*</span>}
            </label>

            {/* Contenedor del Dropzone */}
            <div
                {...getRootProps()}
                className={`w-full rounded-xl border-2 border-dashed p-4 text-sm text-zinc-700 dark:text-zinc-400 shadow-sm outline-none transition ${limiteAlcanzado
                        ? "cursor-not-allowed border-violet-200 dark:border-violet-950 bg-violet-100 dark:bg-black/30 opacity-60"
                        : "cursor-pointer " +
                        (isDragActive
                            ? "border-fuchsia-400 bg-violet-100 dark:bg-violet-950/50"
                            : "border-violet-300 dark:border-violet-800 bg-violet-50 dark:bg-zinc-950 hover:border-fuchsia-400 hover:bg-violet-100 dark:hover:bg-violet-950/40")
                    }`}
            >
                <input
                    {...getInputProps({
                        id: name,
                        name: name,
                        // obligatorio solo si aún no hay archivos
                        required: required && archivos.length === 0,
                    })}
                />
                <div className="flex flex-col items-center justify-center">
                    📁
                </div>
                {limiteAlcanzado ? (
                    <p className="mt-2 text-center text-sm font-medium text-zinc-500">
                        Máximo de {maxFiles} archivos alcanzado
                    </p>
                ) : isDragActive ? (
                    <p className="mt-2 text-center text-sm font-medium text-fuchsia-400">
                        Suelta el archivo aquí...
                    </p>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <p className="font-semibold text-violet-900 dark:text-violet-200">
                            Arrastra tus archivos aquí
                        </p>
                        <p className="mt-3 text-center text-sm font-bold text-fuchsia-400">
                            {archivos.length > 0
                                ? `${archivos.length} de ${maxFiles} archivo(s) listo(s)`
                                : "Ningún archivo seleccionado"}
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">
                            o haz clic para seleccionarlos
                        </p>
                    </div>
                )}
            </div>

            {/* Mensaje temporal de eliminación */}
            {mensajeEliminado && (
                <div className="text-center">
                    <span className="text-sm font-medium text-fuchsia-400">
                        {mensajeEliminado}
                    </span>
                </div>
            )}

            {/* Lista de archivos cargados */}
            {archivos.length > 0 && (
                <div className="flex flex-col gap-3">
                    {archivos.map(({ id, file, preview }) => (
                        <div
                            key={id}
                            className="flex flex-col items-start justify-between gap-4 rounded-lg border border-violet-200 dark:border-violet-900 bg-white dark:bg-zinc-950 p-4 sm:flex-row"
                        >
                            <div className="min-w-0 text-left text-sm text-zinc-700 dark:text-zinc-400">
                                <p className="mb-2 font-semibold text-violet-900 dark:text-violet-100">
                                    Archivo seleccionado
                                </p>
                                <p><strong>Nombre:</strong> {file.name}</p>
                                <p><strong>Tipo:</strong> {file.type || "Desconocido"}</p>
                                <p><strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                                <p><strong>Última modificación:</strong> {new Date(file.lastModified).toLocaleString()}</p>
                            </div>

                            <div className="flex shrink-0 flex-col items-center gap-2">
                                {/* solo si es imagen */}
                                {preview && (
                                    <img
                                        src={preview}
                                        alt={`Vista previa de ${file.name}`}
                                        className="h-40 w-40 rounded-lg border border-violet-800 object-cover object-center"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => eliminarArchivo(id)}
                                    className="flex items-center gap-1 rounded-lg border border-fuchsia-900 bg-fuchsia-950/40 px-3 py-1.5 text-xs font-semibold text-fuchsia-300 transition hover:bg-fuchsia-900/50"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error del dropzone o externo (formulario) */}
            {(errorMsg || error) && (
                <div className="text-center">
                    <span className="text-sm text-fuchsia-400">
                        {errorMsg || error}
                    </span>
                </div>
            )}
        </div>
    );
}

export default FormFile;
