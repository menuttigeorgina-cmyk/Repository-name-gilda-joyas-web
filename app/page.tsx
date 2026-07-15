"use client";

import { useEffect, useState } from "react";
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

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price,
          quantity: 1,
        },
      ];
    });
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function confirmOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderConfirmed(true);
    setCart([]);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fffaf7_0%,#fdf4ee_50%,#fcf1ef_100%)] text-[#2d2929]">
      <section className="px-6 py-6 md:px-16 md:py-8">
        <nav className="flex items-center justify-between rounded-full border border-[#efe0d7] bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgba(94,62,49,0.06)] backdrop-blur">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-[#b88b3c]">GIVEM</p>
            <h1 className="text-xl font-semibold tracking-[0.02em]">Joyas</h1>
          </div>
          <a
            href="https://www.instagram.com/gvmjoyas/"
            target="_blank"
            className="rounded-full border border-[#e8d4c8] bg-[#fffaf6] px-4 py-2 text-sm text-[#5f4d45] transition hover:border-[#d7b18d] hover:bg-[#fcefe8]"
          >
            Instagram
          </a>
        </nav>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d8c5] bg-[#fff8f2] px-3 py-1.5 text-sm text-[#a36f4b]">
              <span className="h-2 w-2 rounded-full bg-[#d8aa5a]"></span>
              Ecommerce con IA
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-[#2d2929] sm:text-5xl lg:text-6xl">
              Joyas que te acompañan y te hacen brillar.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#6f6060]">
              Tienda online de joyas delicadas, modernas y versátiles. Comprá
              desde el catálogo y finalizá tu pedido con el asesoramiento de
              GIVEM.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#productos"
                className="inline-block rounded-full bg-[#d98ca0] px-6 py-3 text-white shadow-sm transition hover:bg-[#c97c92]"
              >
                Ver productos
              </a>
              <p className="rounded-full border border-[#eadfd8] bg-white/70 px-4 py-3 text-sm text-[#7b6c63]">
                Envíos y asesoramiento personalizados
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#f2e4dc] bg-white/80 p-5 shadow-[0_20px_60px_rgba(112,80,60,0.08)] backdrop-blur">
            <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top_left,_#fbe9e1_0%,_#f7e2d7_35%,_#f5d9de_100%)] text-8xl shadow-inner">
              ✨
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#f2e4dc] bg-[#fffaf7] px-4 py-3 text-sm text-[#7a655f]">
              <span>Diseño delicado y versátil</span>
              <span className="font-semibold text-[#b88b3c]">Nueva colección</span>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="px-6 py-14 md:px-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b88b3c]">
              Catálogo
            </p>
            <h3 className="text-3xl font-semibold text-[#2d2929]">
              Productos destacados
            </h3>
          </div>
          <p className="text-[#6f6060]">Catálogo conectado con WooCommerce.</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-[1.75rem] border border-[#f0e1da] bg-[#fffdfa] p-4 shadow-[0_10px_35px_rgba(120,90,70,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(120,90,70,0.12)]"
            >
              <div className="flex aspect-square items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,_#fbe9e4_0%,_#f7e2d7_100%)] text-5xl">
                {product.images?.[0]?.src ? (
                  <img
                    src={product.images[0].src}
                    alt={product.name}
                    className="h-full w-full rounded-[1.4rem] object-cover"
                  />
                ) : (
                  "💍"
                )}
              </div>

              <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-[#b88b3c]">
                {product.categories?.[0]?.name}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-[#2d2929]">
                {product.name}
              </h4>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[#6f6060]">
                {cleanHtml(product.short_description)}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#f4e7de] pt-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#8f7767]">
                    Precio
                  </p>
                  <strong className="text-lg text-[#2d2929]">
                    $ {product.price}
                  </strong>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="rounded-full bg-[#2d2929] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3f3532]"
                >
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="fixed bottom-5 right-5 z-40 w-[320px] rounded-[1.75rem] border border-[#f0e1da] bg-[#fffdfa] p-5 shadow-[0_20px_55px_rgba(72,45,40,0.15)]">
        <h4 className="text-lg font-semibold text-[#2d2929]">Carrito</h4>

        {cart.length === 0 ? (
          <p className="mt-2 text-sm text-[#6f6060]">
            Todavía no agregaste productos.
          </p>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <strong>$ {item.price * item.quantity}</strong>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t pt-3">
              <span>Total</span>
              <strong>$ {total}</strong>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="mt-4 w-full rounded-full bg-[#d98ca0] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Finalizar compra
            </button>
          </>
        )}
      </aside>
    
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            {!orderConfirmed ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold">Finalizar compra</h4>
                  <button onClick={() => setShowCheckout(false)}>✕</button>
                </div>

                <form onSubmit={confirmOrder} className="mt-5 space-y-3">
                  <input
                    required
                    placeholder="Nombre"
                    className="w-full rounded-2xl border border-[#ead0d5] px-4 py-3"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-2xl border border-[#ead0d5] px-4 py-3"
                  />
                  <input
                    required
                    placeholder="Zona de entrega"
                    className="w-full rounded-2xl border border-[#ead0d5] px-4 py-3"
                  />
                  <select
                    required
                    className="w-full rounded-2xl border border-[#ead0d5] px-4 py-3"
                  >
                    <option value="">Medio de pago</option>
                    <option>Transferencia bancaria</option>
                    <option>Efectivo al retirar</option>
                  </select>

                  <div className="rounded-2xl bg-[#fff8f8] p-4 text-sm">
                    <p className="font-semibold">Total estimado: $ {total}</p>
                    <p className="mt-1 text-[#6f6060]">
                      Demo funcional: no procesa pagos reales.
                    </p>
                  </div>

                  <button className="w-full rounded-full bg-[#2d2929] px-5 py-3 text-white">
                    Confirmar pedido
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6e4e8] text-3xl">
                  ✨
                </div>
                <h4 className="mt-4 text-xl font-semibold">
                  Pedido recibido correctamente
                </h4>
                <p className="mt-2 text-sm text-[#6f6060]">
                  GIVEM Joyas se comunicará para confirmar disponibilidad y entrega.
                </p>
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setOrderConfirmed(false);
                  }}
                  className="mt-5 rounded-full bg-[#d98ca0] px-5 py-3 text-white"
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
