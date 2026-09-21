import React, { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import FormInput from './components/FormInput';
import FormSelect from './components/FormSelect';
import FormTextArea from './components/FormTextArea';
import FormFile from './components/FormFile';

function ContactoForm() {

  const [fileResetKey, setFileResetKey] = useState(0);

  const {
    register, control, handleSubmit, reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      primerNombre: "", segundoNombre: "",
      primerApellido: "", segundoApellido: "",
      genero: "", pais: "", ciudad: "",
      correo: "", telefono: "", mensaje: "",
      archivo: [],
    },
  });

  const formData = new FormData();

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "archivo") {
        value.forEach((file) => formData.append("archivo", file));
      } else {
        formData.append(key, value);
      }
    });
    try {
      const response = await fetch(import.meta.env.VITE_FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        console.log("Datos del formulario:", data);
        toast.success("Formulario enviado correctamente");
        reset();
        setFileResetKey((key) => key + 1);
      } else {
        // Formspree responde con { errors: [{ message: "..." }, ...] } si algo falla
        const resultado = await response.json();
        const mensajeError = resultado.errors ?
          resultado.errors.map((e) => e.message).join(", ") :
          "Ocurrió un error al enviar el formulario";


        toast.error(mensajeError);
      }
    }
    catch (error) {
      console.error("Error de red al enviar el formulario:", error);


      toast.error("Revisa tu conexión a internet e intenta de nuevo.");
    }
    finally{
      // Limpiar el formulario y los archivos seleccionados
      reset();
      setFileResetKey((key) => key + 1);
    }
  }

  const onInvalid = (formErrors) => {
    const primerError = Object.values(formErrors)[0];
    toast.error(primerError?.message || "Revisa los campos obligatorios");
  }


  const paises = ["Argentina", "Brasil", "Chile", "Colombia", "México", "Perú", "Uruguay"]

  const ciudades = ["Buenos Aires", "São Paulo", "Santiago", "Bogotá", "Ciudad de México", "Lima", "Montevideo"]

  return (
    <div className='max-w-3xl mx-auto px-4 py-10 sm:px-6 sm:py-16'>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className='space-y-6 rounded-2xl border border-violet-200 dark:border-violet-900 bg-white dark:bg-zinc-900 p-5 shadow-xl shadow-violet-200/60 dark:shadow-black/40 sm:p-8' action="">
        <p className='text-xs text-zinc-500'>
          <span className='text-fuchsia-400'>*</span> Campos obligatorios
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <FormInput
            label="Primer nombre"
            placeholder="Escribe tu primer nombre"
            required
            error={errors.primerNombre?.message}
            {...register("primerNombre", { required: "El primer nombre es obligatorio" })}

          />
          <FormInput
            label="Segundo nombre"
            placeholder="Escribe tu segundo nombre"
            error={errors.segundoNombre?.message}
            {...register("segundoNombre")}

          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <FormInput
              label="Primer apellido"
              placeholder="Escribe tu primer apellido"
              required
              error={errors.primerApellido?.message}
              {...register("primerApellido", { required: "El primer apellido es obligatorio" })}

            />
          </div>
          <div>
            <FormInput
              label="Segundo apellido"
              placeholder="Escribe tu segundo apellido"
              error={errors.segundoApellido?.message}
              {...register("segundoApellido")}
            />
          </div>
        </div>

        <div>
          <FormSelect
            label="Género"
            name='genero'
            required
            options={["Femenino", "Masculino", "Otro"]}
            error={errors.genero?.message}
            {...register("genero", {
              required: "El género es obligatorio",
            })}

          />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <FormSelect
              label="País"
              name='pais'
              placeholder="Ingrese su país"
              options={paises}
              required
              error={errors.pais?.message}
              {...register("pais", {
                required: "El país es obligatorio",
              })}
            />
          </div>
          <div>
            <FormSelect
              label="Ciudad"
              name='ciudad'
              placeholder="Ingrese su ciudad"
              options={ciudades}
              required
              error={errors.ciudad?.message}
              {...register("ciudad", {
                required: "La ciudad es obligatoria",
              })}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <FormInput
              label="Correo electrónico"
              type="email"
              placeholder="Ingrese su correo electrónico"
              required
              error={errors.correo?.message}
              {...register("correo", { required: "El correo electrónico es obligatorio", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "El correo electrónico no es válido" } })}

            />
          </div>
          <div>
            <FormInput
              label="Teléfono"
              name='telefono'
              type="tel"
              placeholder="Ingrese su número de teléfono"
              required
              error={errors.telefono?.message}
              {...register("telefono", {
                required: "El número de teléfono es obligatorio",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El número de teléfono no es válido"
                }
              })}
            />
          </div>
        </div>

        <div>
          <FormTextArea
            label="Mensaje"
            placeholder="Ingrese su mensaje"
            required
            error={errors.mensaje?.message}
            {...register("mensaje", { required: "El mensaje es obligatorio" })}
          />
        </div>

        <div>
          <Controller
            name="archivo"
            control={control}
            render={({ field }) => (
              <FormFile
                key={fileResetKey}
                label="Adjuntar archivo"
                name='archivo'
                accept={{
                  "application/pdf": [".pdf"],
                  "application/msword": [".doc"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                  "image/png": [".png"],
                  "image/jpeg": [".jpg", ".jpeg"],
                  "video/*": []
                }}
                maxSizeMB={2}
                maxFiles={3}
                onFilesChange={field.onChange}
                error={errors.archivo?.message}
              />
            )}
          />
        </div>

        <div className='pt-2 flex justify-center'>
          <button
            type="submit"
            className='rounded-lg bg-violet-700 px-6 py-2.5 font-medium text-violet-50 shadow-md shadow-violet-900/40 transition duration-200 hover:bg-fuchsia-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900'
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactoForm;
