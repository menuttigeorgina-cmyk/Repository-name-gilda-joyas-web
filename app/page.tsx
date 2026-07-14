"use client";

import { useEffect, useState } from "react";

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
    <main className="min-h-screen bg-[#fff8f8] text-[#2d2929]">
      <section className="px-6 py-6 md:px-16">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#c98292]">GIVEM</p>
            <h1 className="text-2xl font-semibold">Joyas</h1>
          </div>
          <a
            href="https://www.instagram.com/gvmjoyas/"
            target="_blank"
            className="rounded-full border border-[#e8c6cc] px-4 py-2 text-sm"
          >
            Instagram
          </a>
        </nav>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#c98292]">
              Ecommerce con IA
            </p>
            <h2 className="text-5xl font-semibold leading-tight md:text-6xl">
              Joyas que te acompañan y te hacen brillar.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-[#6f6060]">
              Tienda online de joyas delicadas, modernas y versátiles. Comprá
              desde el catálogo y finalizá tu pedido por WhatsApp.
            </p>
            <a
              href="#productos"
              className="mt-8 inline-block rounded-full bg-[#d98ca0] px-6 py-3 text-white shadow-sm"
            >
              Ver productos
            </a>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-[#f5d8de] text-8xl">
              ✨
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="px-6 py-14 md:px-16">
        <h3 className="text-3xl font-semibold">Productos destacados</h3>
        <p className="mt-2 text-[#6f6060]">
          Catálogo conectado con WooCommerce.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-1"
            >
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#f6e4e8] text-5xl">
                {product.images?.[0]?.src ? (
                  <img
                    src={product.images[0].src}
                    alt={product.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  "💍"
                )}
              </div>

              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#c98292]">
                {product.categories?.[0]?.name}
              </p>
              <h4 className="mt-1 text-lg font-semibold">{product.name}</h4>
              <p className="mt-2 min-h-12 text-sm text-[#6f6060]">
                {cleanHtml(product.short_description)}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <strong>$ {product.price}</strong>
                <button
                  onClick={() => addToCart(product)}
                  className="rounded-full bg-[#2d2929] px-4 py-2 text-sm text-white"
                >
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="fixed bottom-5 right-5 w-[320px] rounded-3xl bg-white p-5 shadow-xl">
        <h4 className="text-lg font-semibold">Carrito</h4>

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

    </main>
  );
}
