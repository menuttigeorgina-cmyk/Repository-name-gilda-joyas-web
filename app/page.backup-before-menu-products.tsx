"use client";

import { FormEvent, useEffect, useState } from "react";
import Chatbot from "./components/Chatbot";

type Product = {
  id: number;
  name: string;
  price: string;
  short_description: string;
  categories: { name: string }[];
  tags: { name: string }[];
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
  const [activeCategory, setActiveCategory] = useState("Plata 925");
  const [activeType, setActiveType] = useState("Todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const materialFilters = [
    "Plata 925",
    "Acero blanco",
    "Acero dorado",
    "Boho / Artesanal",
  ];

  const typeFilters = [
    "Todos",
    "Anillos",
    "Aros",
    "Pulseras",
    "Collares y Cadenas",
    "Dijes",
    "Tobilleras",
  ];

  function normalize(value = "") {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const filteredProducts = products.filter((product) => {
    const tags = product.tags?.map((tag) => normalize(tag.name)) || [];
    const categories = product.categories?.map((category) => normalize(category.name)) || [];

    const matchesMaterial =
      activeCategory === "Boho / Artesanal"
        ? tags.includes("boho") || tags.includes("artesanal") || categories.some((category) => category.includes("boho"))
        : tags.includes(normalize(activeCategory));

    const matchesType =
      activeType === "Todos"
        ? true
        : categories.includes(normalize(activeType));

    return matchesMaterial && matchesType;
  });

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
      <header className="sticky top-0 z-50 border-b border-[#E8DED5] bg-[#FAF6F2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          <div className="flex items-center gap-10">
            <img
              src="/brand/gildajoyasblanco.svg"
              alt="GILDA Joyas"
              className="h-14 w-14 object-contain"
            />

            <nav className="hidden items-center gap-7 text-[14px] font-normal text-[#2B2B2B] md:flex">
              <a href="#" className="transition hover:text-[#9C7F6C]">Inicio</a>
              <a href="#productos" className="transition hover:text-[#9C7F6C]">Productos</a>
              <a href="#materiales" className="transition hover:text-[#9C7F6C]">Nosotras</a>
            </nav>
          </div>

          <div className="flex items-center justify-center gap-4 text-[#2B2B2B] md:justify-end">
            <button className="hidden text-[14px] font-normal md:inline">
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
              className="rounded-[4px] border border-[#2B2B2B] bg-transparent px-8 py-4 text-center text-sm font-medium text-[#2B2B2B] transition hover:bg-[#2B2B2B] hover:text-white"
            >
              Ver productos
            </a>
            <a
              href="#como-comprar"
              className="rounded-[4px] border border-[#C8B6A8] px-8 py-4 text-center text-sm font-medium text-[#2B2B2B] transition hover:bg-[#C8B6A8]/20"
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
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#A9A5A0]">
            Catálogo
          </p>
          <h2 className="mt-3 font-serif text-5xl md:text-6xl">
            Productos destacados
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6b625d]">
            Explorá las piezas por material y tipo de joya. Una selección simple,
            moderna y pensada para todos los días.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-4xl flex-wrap justify-center gap-3">
          {materialFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveCategory(filter);
                setActiveType("Todos");
              }}
              className={`min-w-[155px] rounded-[4px] border px-5 py-3 text-sm transition ${
                activeCategory === filter
                  ? "border-[#E9DDD2] bg-[#E9DDD2] text-[#2B2B2B]"
                  : "border-[#2B2B2B] bg-[#2B2B2B] text-white hover:bg-transparent hover:text-[#2B2B2B]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mx-auto mb-12 max-w-5xl border-t border-[#E5DAD1] pt-7">
          <div className="flex flex-wrap justify-center gap-3">
            {typeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveType(filter)}
                className={`rounded-full px-5 py-2 text-sm transition ${
                  activeType === filter
                    ? "bg-[#E9DDD2] text-[#2B2B2B]"
                    : "text-[#8A7E76] hover:bg-[#F1E8DF] hover:text-[#2B2B2B]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-[4px] border border-[#E5DAD1] bg-white/35 px-6 py-10 text-center text-sm text-[#6b625d]">
            No hay productos cargados en esta combinación todavía.
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group bg-transparent">
                <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[4px] bg-[#F1EAE2]">
                  {product.images?.[0]?.src ? (
                    <img
                      src={product.images[0].src}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center border border-[#C8B6A8] text-4xl text-[#C8B6A8]">
                      ✦
                    </div>
                  )}
                </div>

                <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#9F958E]">
                  {product.categories?.[0]?.name}
                </p>

                <h3 className="mt-2 text-[15px] font-normal leading-snug text-[#2B2B2B]">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-end justify-between gap-4">
                  <strong className="text-[15px] font-medium">
                    $ {product.price}
                  </strong>

                  <button
                    onClick={() => addToCart(product)}
                    className="text-[13px] font-normal text-[#6f5f55] underline-offset-4 transition hover:text-[#2B2B2B] hover:underline"
                  >
                    Ver producto →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
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

      <section id="materiales" className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-[#E6E3E0] bg-white/65 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-stretch">
            <div className="flex flex-col items-center justify-center rounded-[1.5rem] bg-[#2B2B2B] p-7 text-center text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-[#C8B6A8]">
                Materiales y cuidados
              </p>
              <h2 className="mt-7 max-w-sm font-serif text-4xl leading-tight">
                Joyas para usar todos los días.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.3rem] border border-[#E6E3E0] bg-white/85 p-5">
                <h3 className="text-base font-semibold text-[#2B2B2B]">Materiales</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f5752]">
                  Plata 925, acero blanco, acero dorado, acero quirúrgico y piezas artesanales.
                </p>
              </article>

              <article className="rounded-[1.3rem] border border-[#E6E3E0] bg-white/85 p-5">
                <h3 className="text-base font-semibold text-[#2B2B2B]">Uso diario</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f5752]">
                  Diseños cómodos y combinables para acompañar distintos estilos.
                </p>
              </article>

              <article className="rounded-[1.3rem] border border-[#E6E3E0] bg-white/85 p-5">
                <h3 className="text-base font-semibold text-[#2B2B2B]">Cuidados</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f5752]">
                  Evitá perfumes, cremas, agua de mar, pileta y productos químicos.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-16 border-t border-[#3A3A3A] bg-[#2B2B2B] px-6 py-12 text-white md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="flex flex-col items-center text-center">
            <img
              src="/brand/gildajoyasblanco.svg"
              alt="GILDA Joyas"
              className="h-24 w-24 object-contain"
            />
            <p className="mt-5 max-w-xs text-center text-sm leading-6 text-[#E6E3E0]">
              Joyas simples, modernas y auténticas para acompañarte todos los días.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B6A8]">
              GILDA Joyas
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#E6E3E0]">
              <li><a href="#sobre-gilda">Sobre la marca</a></li>
              <li><a href="#productos">Productos</a></li>
              <li><a href="#materiales">Materiales y cuidados</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B6A8]">
              Ayuda
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#E6E3E0]">
              <li>Envíos y retiros</li>
              <li>Cambios</li>
              <li>Medios de pago</li>
              <li>Preguntas frecuentes</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B6A8]">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#E6E3E0]">
              <li>Instagram: @gvmjoyas</li>
              <li>Email: gvmjoyas@hotmail.com</li>
              <li>Atención personalizada</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.2em] text-[#A9A5A0] md:flex-row">
          <p>© GILDA Joyas</p>
          <p>Simple · Versátil · Moderna · Auténtica</p>
        </div>
      </footer>

      <Chatbot />
    </main>
  );
}
