"use client";

import { useState } from "react";

const answers = [
  {
    q: "Pagos",
    a: "Aceptamos efectivo, transferencia, billeteras virtuales, débito y tarjeta de crédito en cuotas. En efectivo o transferencia tenés 15% de descuento.",
  },
  {
    q: "Envíos",
    a: "Hacemos entregas en Santa Fe Capital y alrededores, previa coordinación. También enviamos por Correo Argentino al resto del país.",
  },
  {
    q: "Cambios",
    a: "Los cambios se aceptan dentro de las 24 hs de recibido el producto y solo por fallas en el material. Aros, argollas y piercings no tienen cambio por higiene, salvo falla.",
  },
  {
    q: "Cuidados",
    a: "Evitá perfumes, transpiración, jabones, cosméticos y productos de limpieza. La plata puede oscurecerse, pero recupera brillo con limpieza adecuada.",
  },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[310px] rounded-[18px] border border-[#D8C6B7] bg-[#FFFCF8] p-4 shadow-[0_18px_45px_rgba(80,55,40,0.18)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl text-[#2B2B2B]">Tu asistente</h3>
              <p className="text-xs text-[#7B7068]">Preguntas frecuentes</p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xl leading-none text-[#7B7068] hover:text-[#2B2B2B]"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            {answers.map((item) => (
              <details key={item.q} className="rounded-[10px] border border-[#E8DED5] bg-white/50 px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium text-[#2B2B2B]">
                  {item.q}
                </summary>
                <p className="mt-2 text-xs leading-5 text-[#6b625d]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-[310px] items-center gap-3 rounded-[18px] border border-[#D8C6B7] bg-[#FFFCF8] px-4 py-3 shadow-[0_12px_30px_rgba(80,55,40,0.14)] transition hover:-translate-y-0.5 hover:opacity-100 ${
          open ? "opacity-100" : "opacity-75"
        }`}
      >
        <img
          src="/brand/gildajoyasblanco.svg"
          alt="GILDA"
          className="h-10 w-10 object-contain"
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-[#2B2B2B]">Tu asistente</p>
          <p className="text-xs text-[#7B7068]">GILDA</p>
        </div>
      </button>
    </div>
  );
}
