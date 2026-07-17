"use client";

import { FormEvent, useEffect, useState } from "react";
import Chatbot from "./components/Chatbot";

type Product = {
  id: number;
  name: string;
  price: string;
  short_description: string;
  categories: { name: string }[];
  images: { src: string }[];
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

function cleanHtml(html: string) {
  return html?.replace(/<[^>]*>/g, "").trim();
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  function addToCart(product: Product) {
    const price = Number(product.price || 0);

    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);

      if (exists) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { id: product.id, name: product.name, price, quantity: 1 }];
    });
  }

  function confirmOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderConfirmed(true);
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#FBF7F0] text-[#2B2B2B]">
      <header className="sticky top-0 z-30 border-b border-[#E6E3E0] bg-[#FBF7F0]/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl items-center gap-4 px-6 py-4 md:grid-cols-3 md:px-10">
          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.12em] text-[#2B2B2B] md:flex">
            <a href="#">Inicio</a>
            <a href="#productos">Productos</a>
            <a href="#materiales">Información</a>
          </nav>

          <div className="flex justify-center">
            <img
              src="/brand/gildajoyaslogo.svg"
              alt="GILDA Joyas"
              className="h-24 w-24 object-contain md:h-28 md:w-28"
            />
          </div>

          <div className="flex items-center justify-center gap-5 text-[#2B2B2B] md:justify-end">
            <button className="hidden text-sm font-medium uppercase tracking-[0.12em] md:inline">
              Cuenta
            </button>

            <button aria-label="Buscar" className="rounded-full p-2 transition hover:bg-white focus:outline-none focus:ring-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.5 16.5" />
              </svg>
            </button>

            <button aria-label="Favoritos" className="rounded-full p-2 transition hover:bg-white focus:outline-none focus:ring-0">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20.5 8.5C20.5 14 12 20 12 20S3.5 14 3.5 8.5C3.5 5.7 5.4 4 7.8 4C9.4 4 10.8 4.9 12 6.3C13.2 4.9 14.6 4 16.2 4C18.6 4 20.5 5.7 20.5 8.5Z" />
              </svg>
            </button>

            <button
              aria-label="Carrito"
              onClick={() => {
                if (cart.length > 0) setShowCheckout(true);
              }}
              className="relative rounded-full p-2 transition hover:bg-white focus:outline-none focus:ring-0"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 7H18L17 20H7L6 7Z" />
                <path d="M9 7C9 4.8 10.2 3.5 12 3.5C13.8 3.5 15 4.8 15 7" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2B2B2B] px-1 text-[11px] text-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="grid items-center gap-10 px-6 pb-14 pt-8 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:pl-10 lg:pr-0">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8B6A8] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#6b625d]">
            <span className="h-2 w-2 rounded-full bg-[#E79CB3]" />
            Nueva colección
          </p>

          <h1 className="max-w-lg font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-[5.8rem]">
            Brillá a tu manera.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#5f5752] md:text-[1.05rem]">
            Joyas simples, modernas y auténticas para acompañarte todos los días.
            Diseños versátiles en plata, acero y piezas artesanales.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#productos"
              className="rounded-full bg-[#2B2B2B] px-8 py-4 text-center text-sm font-semibold text-white"
            >
              Ver productos
            </a>
            <a
              href="#como-comprar"
              className="rounded-full border border-[#C8B6A8] px-8 py-4 text-center text-sm font-semibold text-[#2B2B2B]"
            >
              Cómo comprar
            </a>
          </div>
        </div>

        <div className="relative lg:justify-self-end lg:w-full">
          <div className="relative h-[380px] overflow-hidden rounded-[2rem] border-2 border-[#BFAE9E] shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:h-[460px] lg:h-[560px] lg:rounded-l-[2rem] lg:rounded-r-none">
            <img
              src="/brand/herogchic.png"
              alt="Editorial GILDA Joyas"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A9A5A0]">
              Catálogo
            </p>
            <h2 className="mt-3 font-serif text-5xl">Productos destacados</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6b625d]">
            Una selección de piezas simples, versátiles y auténticas para todos los días.
            Elegí tus favoritas y armá tu pedido de forma simple.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group rounded-[1.7rem] border border-[#E6E3E0] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex aspect-square items-center justify-center rounded-[1.3rem] bg-[#FBF7F0]">
                {product.images?.[0]?.src ? (
                  <img
                    src={product.images[0].src}
                    alt={product.name}
                    className="h-full w-full rounded-[1.3rem] object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#C8B6A8] text-4xl text-[#C8B6A8]">
                    ✦
                  </div>
                )}
              </div>

              <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-[#A9A5A0]">
                {product.categories?.[0]?.name}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[#6b625d]">
                {cleanHtml(product.short_description)}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#E6E3E0] pt-4">
                <strong>$ {product.price}</strong>
                <button
                  onClick={() => addToCart(product)}
                  className="rounded-full bg-[#2B2B2B] px-4 py-2 text-sm text-white"
                >
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="como-comprar"
        className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3 md:px-10"
      >
        {[
          ["01", "Elegí tus piezas", "Explorá el catálogo y seleccioná las joyas que más conectan con tu estilo."],
          ["02", "Armá tu pedido", "Completá tus datos y dejá tu zona de entrega para poder coordinar disponibilidad."],
          ["03", "Coordiná la entrega", "GILDA Joyas confirma el pedido, el stock y la forma de entrega más conveniente."],
        ].map(([number, title, text]) => (
          <div key={number} className="rounded-[1.5rem] border border-[#C8B6A8] bg-white/50 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A9A5A0]">{number}</p>
            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#6b625d]">{text}</p>
          </div>
        ))}
      </section>

      <section id="materiales" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="rounded-[2rem] bg-[#2B2B2B] p-8 text-white md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C8B6A8]">
            Materiales y cuidados
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl">
            Diseños pensados para acompañarte todos los días.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-[#E6E3E0]">
            Cada pieza está pensada para acompañarte en lo cotidiano: diseños simples,
            combinables y fáciles de usar. Trabajamos con plata 925, acero blanco,
            acero dorado, acero quirúrgico y accesorios artesanales. Para conservar
            tus joyas por más tiempo, evitá el contacto directo con perfumes,
            cremas, agua de pileta, agua de mar y productos químicos.
          </p>
        </div>
      </section>

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2B2B]/50 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl">
            {!orderConfirmed ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold">Finalizar compra</h4>
                  <button onClick={() => setShowCheckout(false)}>✕</button>
                </div>

                <form onSubmit={confirmOrder} className="mt-5 space-y-3">
                  <input required placeholder="Nombre" className="w-full rounded-2xl border border-[#C8B6A8] px-4 py-3" />
                  <input required type="email" placeholder="Email" className="w-full rounded-2xl border border-[#C8B6A8] px-4 py-3" />
                  <input required placeholder="Zona de entrega" className="w-full rounded-2xl border border-[#C8B6A8] px-4 py-3" />
                  <select required className="w-full rounded-2xl border border-[#C8B6A8] px-4 py-3">
                    <option value="">Medio de pago</option>
                    <option>Transferencia bancaria</option>
                    <option>Efectivo al retirar</option>
                  </select>

                  <div className="rounded-2xl bg-[#FBF7F0] p-4 text-sm">
                    <p className="font-semibold">Total estimado: $ {total}</p>
                    <p className="mt-1 text-[#6b625d]">
                      Demo funcional: no procesa pagos reales.
                    </p>
                  </div>

                  <button className="w-full rounded-full bg-[#2B2B2B] px-5 py-3 text-white">
                    Confirmar pedido
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <img src="/brand/gildajoyaslogo.svg" alt="" className="mx-auto h-20 w-20" />
                <h4 className="mt-4 text-xl font-semibold">
                  Pedido recibido correctamente
                </h4>
                <p className="mt-2 text-sm text-[#6b625d]">
                  GILDA Joyas se comunicará para confirmar disponibilidad y entrega.
                </p>
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setOrderConfirmed(false);
                  }}
                  className="mt-5 rounded-full bg-[#2B2B2B] px-5 py-3 text-white"
                >
                  Volver a la tienda
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Chatbot />
    </main>
  );
}
