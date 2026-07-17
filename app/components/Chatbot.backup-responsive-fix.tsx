"use client";

import { FormEvent, useState } from "react";

type Message = {
  from: "bot" | "user";
  text: string;
};

const quickAnswers = [
  {
    q: "Pagos",
    a: "Aceptamos efectivo, transferencia, billeteras virtuales, débito y tarjeta de crédito en cuotas. En efectivo o transferencia tenés 15% de descuento.",
  },
  {
    q: "Envíos",
    a: "Hacemos entregas en Santa Fe Capital y alrededores, previa coordinación y con costo según zona. También enviamos por Correo Argentino al resto del país.",
  },
  {
    q: "Cambios",
    a: "Los cambios se aceptan dentro de las 24 hs de recibido el producto y solo por fallas en el material. Aros, argollas y piercings no tienen cambio por higiene, salvo falla.",
  },
  {
    q: "Cuidados",
    a: "Evitá perfumes, transpiración, jabones, cosméticos y productos de limpieza. La plata puede oscurecerse, pero recupera brillo con limpieza adecuada.",
  },
  {
    q: "Materiales",
    a: "Trabajamos con plata 925, acero quirúrgico, acero blanco, acero dorado y piezas artesanales. El acero quirúrgico es inalterable y de alta durabilidad.",
  },
  {
    q: "Regalo",
    a: "Sí, si la compra es para regalo preparamos un packaging especial. Puede ser bolsita, cajita o sobre, según el tipo de producto.",
  },
];

function getBotAnswer(question: string) {
  const text = question.toLowerCase();

  if (text.includes("comprar") || text.includes("pedido") || text.includes("carrito") || text.includes("agregar")) {
    return "Para comprar, elegí el producto que te guste, tocá “Agregar”, revisá el carrito y completá tus datos. Después GILDA Joyas se contacta por WhatsApp para coordinar pago y entrega.";
  }

  if (text.includes("stock") || text.includes("disponible") || text.includes("hay")) {
    return "El stock puede variar según el producto. Podés agregar la pieza al carrito y, al confirmar el pedido, GILDA Joyas revisa la disponibilidad y se contacta por WhatsApp.";
  }

  if (text.includes("hombre") || text.includes("unisex")) {
    return "Algunas piezas pueden usarse como unisex, especialmente pulseras, cadenas y accesorios de acero o estilo artesanal. Te recomiendo revisar las categorías de pulseras y accesorios boho/artesanales.";
  }

  if (text.includes("pulsera") || text.includes("pulseras")) {
    return "Tenemos pulseras en distintos estilos y materiales, incluyendo acero, plata y piezas artesanales. Podés filtrarlas desde la categoría Pulseras en el catálogo.";
  }

  if (text.includes("anillo") || text.includes("anillos")) {
    return "Podés ver los anillos desde la categoría Anillos del catálogo. Hay opciones en plata 925, acero y otros materiales según disponibilidad.";
  }

  if (text.includes("aro") || text.includes("aros") || text.includes("argolla") || text.includes("piercing")) {
    return "Tenemos aros, argollas y piercings según stock. Por higiene, estos productos no tienen cambio, salvo que presenten una falla en el material.";
  }

  if (text.includes("collar") || text.includes("cadena") || text.includes("dije")) {
    return "Podés ver collares, cadenas y dijes desde sus categorías en el catálogo. Hay opciones simples, modernas y también piezas más artesanales.";
  }

  if (text.includes("pago") || text.includes("transferencia") || text.includes("efectivo") || text.includes("tarjeta") || text.includes("cuota") || text.includes("mercado pago") || text.includes("billetera")) {
    return "Aceptamos efectivo, transferencia, billeteras virtuales, tarjeta de débito y tarjeta de crédito en cuotas. En efectivo o transferencia tenés 15% de descuento.";
  }

  if (text.includes("descuento")) {
    return "Sí, abonando en efectivo o por transferencia tenés 15% de descuento.";
  }

  if (text.includes("envio") || text.includes("envío") || text.includes("entrega") || text.includes("correo") || text.includes("santa fe")) {
    return "Hacemos entregas en Santa Fe Capital y alrededores, previa coordinación y con costo según zona. También enviamos por Correo Argentino al resto del país.";
  }

  if (text.includes("cambio") || text.includes("devolucion") || text.includes("devolución") || text.includes("falla")) {
    return "Los cambios se aceptan dentro de las 24 hs de recibido el producto y solo por fallas en el material. Aros, argollas y piercings no tienen cambio por higiene, salvo falla.";
  }

  if (text.includes("regalo") || text.includes("packaging") || text.includes("cajita") || text.includes("bolsita") || text.includes("sobre")) {
    return "Sí, si la compra es para regalo preparamos un packaging especial. Puede ser bolsita, cajita o sobre, según el tipo de producto.";
  }

  if (text.includes("cuidado") || text.includes("limpiar") || text.includes("oscurece") || text.includes("oscurecer") || text.includes("brillo")) {
    return "Recomendamos evitar perfumes, transpiración, jabones, cosméticos y productos de limpieza. La plata puede oscurecerse según el pH de la piel, pero con limpieza adecuada puede recuperar su brillo.";
  }

  if (text.includes("plata 925") || text.includes("plata")) {
    return "La plata 925 puede oscurecerse con el tiempo por el pH de la piel, perfumes, transpiración o productos de limpieza. Es normal y puede recuperar su brillo con limpieza adecuada.";
  }

  if (text.includes("acero quirurgico") || text.includes("acero quirúrgico")) {
    return "El acero quirúrgico es un material inalterable y de alta durabilidad. Es una buena opción si buscás una pieza resistente.";
  }

  if (text.includes("acero blanco")) {
    return "El acero blanco tiene un baño de plata sobre acero quirúrgico. Para cuidar su apariencia, evitá perfumes, transpiración, jabones, lavandina y sustancias corrosivas.";
  }

  if (text.includes("acero dorado") || text.includes("gold") || text.includes("rose")) {
    return "Las piezas doradas, rose o gold suelen tener baño de color. Recomendamos no usarlas para bañarse, hacer deporte o ir al gimnasio, y evitar contacto con cosméticos o químicos.";
  }

  if (text.includes("material") || text.includes("piel sensible") || text.includes("alergia")) {
    return "La elección del material depende de cada piel. Cada persona puede adaptarse mejor a plata, acero quirúrgico u otros materiales según su experiencia personal.";
  }

  return "Puedo ayudarte con pagos, envíos, cambios, cuidados, materiales, stock, regalos y cómo comprar. También podés buscar por categoría en el catálogo.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hola, soy tu asistente de GILDA. Podés preguntarme sobre pagos, envíos, cambios, cuidados o regalos.",
    },
  ]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();
    if (!question) return;

    setMessages((current) => [
      ...current,
      { from: "user", text: question },
      { from: "bot", text: getBotAnswer(question) },
    ]);

    setInput("");
  }

  function addQuickAnswer(answer: string) {
    setMessages((current) => [...current, { from: "bot", text: answer }]);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[310px] rounded-[18px] border border-[#D8C6B7] bg-[#FFFCF8] p-4 shadow-[0_18px_45px_rgba(80,55,40,0.18)]">
          <div className="relative mb-4 text-center">
            <h3 className="font-serif text-xl text-[#2B2B2B]">Tu asistente</h3>
            <p className="text-xs text-[#7B7068]">GILDA Joyas</p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-0 top-0 text-xl leading-none text-[#7B7068] hover:text-[#2B2B2B]"
            >
              ×
            </button>
          </div>

          <div className="max-h-[210px] space-y-2 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-[12px] px-3 py-2 text-xs leading-5 ${
                  message.from === "user"
                    ? "mx-auto max-w-[88%] bg-[#2B2B2B] text-center text-white"
                    : "mx-auto max-w-[88%] bg-[#F1E8DF] text-center text-[#2B2B2B]"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {quickAnswers.map((item) => (
              <button
                key={item.q}
                type="button"
                onClick={() => addQuickAnswer(item.a)}
                className="rounded-full border border-[#D8C6B7] px-3 py-1 text-[11px] text-[#6b625d] transition hover:bg-[#E9DDD2] hover:text-[#2B2B2B]"
              >
                {item.q}
              </button>
            ))}
          </div>

          <form onSubmit={sendMessage} className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribí tu consulta..."
              className="min-w-0 flex-1 rounded-[10px] border border-[#D8C6B7] bg-transparent px-3 py-2 text-center text-xs outline-none placeholder:text-[#A9A5A0] focus:border-[#2B2B2B]"
            />

            <button
              type="submit"
              className="rounded-[10px] bg-[#2B2B2B] px-3 py-2 text-xs font-medium text-white"
            >
              Enviar
            </button>
          </form>
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
