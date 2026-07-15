"use client";

import { FormEvent, useState } from "react";

type Message = {
  from: "bot" | "user";
  text: string;
};

const answers = {
  materiales:
    "Para uso diario, las opciones más prácticas suelen ser el acero quirúrgico, el acero blanco o el acero dorado, porque resisten mejor el uso frecuente. La plata 925 es más delicada y elegante, pero puede oscurecerse con el tiempo y requiere limpieza.",
  piel:
    "Si tenés piel sensible, lo más recomendable es elegir plata 925 o acero quirúrgico. Son materiales que suelen tolerarse mejor, aunque siempre conviene revisar la composición exacta de cada pieza.",
  cuidados:
    "Para conservar tus joyas, guardalas en un lugar seco y separadas entre sí. Evitá perfumes, cremas, agua de pileta, agua de mar y productos químicos. También es recomendable limpiarlas suavemente con un paño seco después del uso.",
  regalo:
    "Para regalar, las opciones más seguras suelen ser aros, collares o pulseras regulables, porque no dependen tanto del talle. Si querés regalar un anillo, lo ideal es saber la medida o elegir un diseño ajustable.",
  talles:
    "Para saber el talle de un anillo, podés medir el diámetro interno de un anillo que ya uses y compararlo con una guía de talles. Si no estás segura, conviene consultar antes de comprar.",
  envios:
    "Las entregas se coordinan según zona y disponibilidad. Al finalizar el pedido podés indicar tu zona para que GILDA Joyas confirme la mejor opción de entrega.",
  pagos:
    "En esta demo el pedido se simula dentro de la web. En una versión real, GILDA Joyas confirmaría el medio de pago disponible antes de cerrar la compra.",
  stock:
    "El stock se confirma antes de finalizar la compra real. Esto permite validar disponibilidad, material, color o talle antes de coordinar el pago y la entrega.",
  cambios:
    "Las condiciones de cambio deben confirmarse con la marca. En general, se recomienda conservar el producto sin uso y con su packaging. Esta respuesta se completará con la política real de GILDA Joyas.",
};

function getBotResponse(message: string) {
  const text = message.toLowerCase();

  if (text.includes("piel") || text.includes("sensible") || text.includes("alerg") || text.includes("delicada")) return answers.piel;
  if (text.includes("negro") || text.includes("oscure") || text.includes("oxida") || text.includes("mancha")) return answers.materiales;
  if (text.includes("material") || text.includes("plata") || text.includes("acero") || text.includes("dorado")) return answers.materiales;
  if (text.includes("cuidado") || text.includes("limpiar") || text.includes("agua") || text.includes("perfume")) return answers.cuidados;
  if (text.includes("regalo") || text.includes("cumple") || text.includes("packaging")) return answers.regalo;
  if (text.includes("talle") || text.includes("medida") || text.includes("anillo")) return answers.talles;
  if (text.includes("envio") || text.includes("envío") || text.includes("entrega") || text.includes("zona")) return answers.envios;
  if (text.includes("pago") || text.includes("transferencia") || text.includes("efectivo") || text.includes("cuotas")) return answers.pagos;
  if (text.includes("stock") || text.includes("disponible") || text.includes("hay")) return answers.stock;
  if (text.includes("cambio") || text.includes("devolucion") || text.includes("fallado")) return answers.cambios;

  return "Puedo orientarte sobre materiales, cuidados, talles, regalos, envíos, pagos, stock o cambios. También podés elegir una pregunta frecuente para recibir una respuesta rápida.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showFaqs, setShowFaqs] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hola ✨ Soy el asistente virtual de GILDA Joyas. Estoy para ayudarte a elegir mejor antes de comprar.",
    },
  ]);

  function addConversation(label: string, answer: string) {
    setMessages((current) => [
      ...current,
      { from: "user", text: label },
      { from: "bot", text: answer },
    ]);
    setShowFaqs(false);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages((current) => [
      ...current,
      { from: "user", text: userText },
      { from: "bot", text: getBotResponse(userText) },
    ]);
    setInput("");
  }

  const faqs = [
    ["Materiales", answers.materiales],
    ["Piel sensible", answers.piel],
    ["Cuidados", answers.cuidados],
    ["Regalos", answers.regalo],
    ["Talles", answers.talles],
    ["Envíos", answers.envios],
    ["Pagos", answers.pagos],
    ["Stock", answers.stock],
    ["Cambios", answers.cambios],
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-4 flex h-[560px] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.7rem] border border-[#C8B6A8] bg-white shadow-2xl">
          <div className="border-b border-[#E6E3E0] bg-white px-5 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBF7F0]">
                  <img src="/brand/gildajoyaslogo.svg" alt="" className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2B2B2B]">Asistente GILDA</h4>
                  <p className="mt-1 text-xs text-[#A9A5A0]">
                    Ayuda para elegir y comprar
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-lg text-[#A9A5A0]"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#FBF7F0] px-5 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                  message.from === "user"
                    ? "ml-auto bg-[#2B2B2B] text-white"
                    : "mr-auto bg-white text-[#5f5752]"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-[#E6E3E0] bg-white px-4 py-3">
            <button
              onClick={() => setShowFaqs(!showFaqs)}
              className="mb-3 flex w-full items-center justify-between rounded-2xl border border-[#E6E3E0] px-4 py-3 text-left text-sm font-medium text-[#2B2B2B]"
            >
              Preguntas frecuentes
              <span className="text-[#A9A5A0]">{showFaqs ? "−" : "+"}</span>
            </button>

            {showFaqs && (
              <div className="mb-3 grid grid-cols-2 gap-2">
                {faqs.map(([label, answer]) => (
                  <button
                    key={label}
                    onClick={() => addConversation(label, answer)}
                    className="rounded-full border border-[#E6E3E0] px-3 py-2 text-xs text-[#5f5752] transition hover:border-[#C8B6A8] focus:outline-none focus:ring-0"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribí tu consulta..."
                className="min-w-0 flex-1 rounded-full border border-[#C8B6A8] px-4 py-3 text-sm outline-none focus:ring-0"
              />
              <button className="rounded-full bg-[#2B2B2B] px-5 py-3 text-sm text-white">
                Enviar
              </button>
            </form>

            <p className="mt-2 text-[11px] leading-4 text-[#A9A5A0]">
              Demo con respuestas predefinidas. Las políticas finales se cargarán con datos reales de la marca.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex min-w-[280px] items-center gap-4 rounded-2xl border border-[#C8B6A8] bg-white px-5 py-4 text-left shadow-2xl transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(43,43,43,0.16)] focus:outline-none focus:ring-0 focus:ring-0"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#FBF7F0]">
          <img src="/brand/gildajoyaslogo.svg" alt="" className="h-10 w-10 object-contain" />
        </span>
        <span className="flex flex-col items-center leading-tight">
          <span className="block text-base font-semibold text-[#2B2B2B]">
            ¿Necesitás ayuda?
          </span>
          <span className="mt-1 block text-sm font-medium text-[#8a817c]">
            Asistente GILDA
          </span>
        </span>
      </button>
    </div>
  );
}
