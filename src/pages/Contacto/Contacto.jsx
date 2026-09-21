import React from 'react'
import ContactoForm from "./ContactoForm";

function Contacto() {
  return (
    <section className="min-h-screen bg-violet-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
            {/* Encabezado */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-violet-50 mb-4">
                  Contáctame
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
                  ¿Tienes alguna pregunta, sugerencia o deseas comunicarte conmigo?
                  Completa el siguiente formulario y recibiré tu mensaje directamente
                  en mi correo electrónico.
                </p>
            </div>

            {/* Formulario */}
            <ContactoForm />
      </div>
    </section>
  );
}
export default Contacto;
