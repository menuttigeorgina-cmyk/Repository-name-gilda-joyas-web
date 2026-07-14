"use client";

import { useState } from "react";

function getBotResponse(message: string) {
  const text = message.toLowerCase();

  if (text.includes("envio") || text.includes("entrega") || text.includes("zona")) {
    return "Realizamos entregas a coordinar. Podés indicar tu zona al finalizar la compra para confirmar disponibilidad.";
  }

  if (text.includes("material") || text.includes("plata") || text.includes("acero")) {
    return "Trabajamos con piezas seleccionadas como plata 925, acero quirúrgico y acero dorado, según cada producto.";
  }

  if (text.includes("cuidado") || text.includes("agua") || text.includes("perfume")) {
    return "Para cuidar tus joyas, evitá el contacto directo con perfumes, cremas, agua de pileta o productos químicos.";
  }

  if (text.includes("pago") || text.includes("transferencia") || text.includes("efectivo")) {
    return "En esta demo podés simular el pedido con transferencia bancaria o efectivo al retirar.";
  }

  if (text.includes("whatsapp") || text.includes("asesora") || text.includes("contacto")) {
    return "Podés contactar a GIVEM Joyas por WhatsApp para recibir asesoramiento personalizado.";
  }

  return "Puedo ayudarte con envíos, materiales, cuidados, medios de pago o contacto por WhatsApp.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hola ✨ Soy el asistente de GIVEM Joyas. Podés preguntarme por envíos, materiales, cuidados o pagos.",
    },
  ]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) return;

    const userMessage = input;
    const botMessage = getBotResponse(userMessage);

    setMessages((current) => [
      ...current,
      { from: "user", text: userMessage },
      { from: "bot", text: botMessage },
    ]);

    setInput("");
  }

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {open && (
        <div className="mb-3 w-[320px] rounded-3xl bg-white p-5 shadow-xl">
          <h4 className="font-semibold">Asistente GIVEM</h4>

          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {messages.map((message, index) => (
              <p
                key={index}
                className={`rounded-2xl p-3 text-sm ${
                  message.from === "user"
                    ? "bg-[#2d2929] text-white"
                    : "bg-[#fff8f8] text-[#6f6060]"
                }`}
              >
                {message.text}
              </p>
            ))}
          </div>

          <form onSubmit={sendMessage} className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribí tu consulta..."
              className="min-w-0 flex-1 rounded-full border px-4 py-2 text-sm"
            />
            <button className="rounded-full bg-[#d98ca0] px-4 py-2 text-sm text-white">
              Enviar
            </button>
          </form>

          <p className="mt-4 text-xs text-[#9b8585]">
            Demo de chatbot con lógica predefinida. IA generativa: mejora futura.
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="rounded-full bg-[#2d2929] px-5 py-3 text-sm font-semibold text-white shadow-xl"
      >
        {open ? "Cerrar chat" : "Chat GIVEM"}
      </button>
    </div>
  );
}
