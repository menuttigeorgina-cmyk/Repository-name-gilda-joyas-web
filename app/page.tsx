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
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeType, setActiveType] = useState("Todos");
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAccountNotice, setShowAccountNotice] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          return;
        }

        if (Array.isArray(data.products)) {
          setProducts(data.products);
          return;
        }

        if (Array.isArray(data.data)) {
          setProducts(data.data);
          return;
        }

        console.error("Formato inesperado de productos:", data);
        setProducts([]);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        setProducts([]);
      });
  }, []);

  const materialFilters = [
    "Todos",
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
      activeCategory === "Todos"
        ? true
        : activeCategory === "Boho / Artesanal"
          ? tags.includes("boho") || tags.includes("artesanal") || categories.some((category) => category.includes("boho"))
          : tags.includes(normalize(activeCategory));

    const matchesType =
      activeType === "Todos"
        ? true
        : categories.includes(normalize(activeType));

    return matchesMaterial && matchesType;
  });

  const visibleProducts = searchTerm.trim()
    ? products.filter((product) => {
        const text = [
          product.name,
          product.categories?.map((category) => category.name).join(" "),
          product.tags?.map((tag) => tag.name).join(" "),
        ].join(" ");

        return normalize(text).includes(normalize(searchTerm));
      })
    : filteredProducts.length > 0
      ? filteredProducts
      : products;

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

    setShowCheckout(true);
  }

  function submitSearch() {
    const query = normalize(searchTerm);

    const matchedType = typeFilters.find((filter) =>
      normalize(filter).includes(query) || query.includes(normalize(filter))
    );

    const matchedMaterial = materialFilters.find((filter) =>
      normalize(filter).includes(query) || query.includes(normalize(filter))
    );

    if (matchedType) {
      setActiveType(matchedType);
    }

    if (matchedMaterial) {
      setActiveCategory(matchedMaterial);
      setActiveType("Todos");
    }

    setShowSearch(false);
    window.location.hash = "productos";

    setTimeout(() => {
      document.getElementById("productos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function toggleFavorite(productId: number) {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function confirmOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderConfirmed(true);
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#2B2B2B]">
      <header className="sticky top-0 z-50 border-b border-[#E8DED5] bg-[#FAF6F2]/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-5 py-2 md:px-8 lg:px-10">
          <nav className="hidden items-center gap-6 text-[14px] font-normal text-[#2B2B2B] md:flex lg:gap-8 lg:text-[15px]">
            <a href="#" className="transition hover:text-[#9C7F6C]">
              Inicio
            </a>

            <a href="#productos" className="transition hover:text-[#9C7F6C]">
              Productos
            </a>

            <a href="#materiales" className="transition hover:text-[#9C7F6C]">
              Nosotras
            </a>
          </nav>

          <div className="flex justify-center">
            <a href="#" aria-label="Ir al inicio">
              <img
                src="/brand/gildajoyasblanco.svg"
                alt="GILDA Joyas"
                className="h-16 w-16 object-contain md:h-20 md:w-20 lg:h-24 lg:w-24"
              />
            </a>
          </div>

          <div className="flex items-center justify-end gap-3 text-[#2B2B2B] md:gap-5">
            <button
              type="button"
              onClick={() => setShowAccountNotice(true)}
              className="hidden text-[14px] font-normal md:inline lg:text-[15px]"
            >
              Cuenta
            </button>

            <button
              type="button"
              aria-label="Buscar"
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-full p-2 transition hover:bg-white focus:outline-none focus:ring-0"
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.5 16.5" />
              </svg>
            </button>

            <button aria-label="Favoritos" className="relative rounded-full p-2 transition hover:bg-white focus:outline-none focus:ring-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20.5 8.5C20.5 14 12 20 12 20S3.5 14 3.5 8.5C3.5 5.7 5.4 4 7.8 4C9.4 4 10.8 4.9 12 6.3C13.2 4.9 14.6 4 16.2 4C18.6 4 20.5 5.7 20.5 8.5Z" />
              </svg>

              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-[#2B2B2B] px-1.5 text-[10px] text-white">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              aria-label="Carrito"
              onClick={() => setShowCheckout(true)}
              className="relative rounded-full p-2 transition hover:bg-white focus:outline-none focus:ring-0"
            >
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 7H20L18.5 16H8L6 4H3" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>

              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-[#2B2B2B] px-1.5 text-[10px] text-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="grid items-center gap-8 px-6 pb-10 pt-8 text-center md:grid-cols-[0.85fr_1.15fr] md:px-8 md:text-left lg:gap-10 lg:pl-10 lg:pr-0">
        <div className="mx-auto max-w-xl md:mx-0">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8B6A8] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#6b625d] md:mx-0">
            <span className="h-2 w-2 rounded-full bg-[#E79CB3]" />
            Nueva colección
          </p>

          <h1 className="mx-auto max-w-lg font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl md:mx-0 lg:text-[5.8rem]">
            Brillá a tu manera.
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-[#5f5752] md:mx-0 md:text-[1.05rem]">
            Joyas simples, modernas y auténticas para acompañarte todos los días.
            Diseños versátiles en plata, acero y piezas artesanales.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
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
          <div className="relative h-[300px] overflow-hidden rounded-[1.5rem] border-2 border-[#BFAE9E] shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:h-[340px] md:h-[370px] lg:h-[560px] lg:rounded-l-[2rem] lg:rounded-r-none">
            <img
              src="/brand/herogchic.png"
              alt="Editorial GILDA Joyas"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-16">
        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#A9A5A0]">
            Catálogo
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Productos destacados
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6b625d]">
            Una selección de piezas simples, versátiles y auténticas para todos los días.
          </p>
        </div>

        <div className="mx-auto mb-7 max-w-6xl border-y border-[#E5DAD1] py-5 md:mb-12 md:py-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-14 md:gap-y-5">
            {materialFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveCategory(filter);
                  setActiveType("Todos");
                }}
                className={`text-center text-[13px] font-bold uppercase tracking-[0.14em] transition sm:text-[14px] md:text-[15px] md:tracking-[0.18em] ${
                  activeCategory === filter
                    ? "text-[#2B2B2B]"
                    : "text-[#A28776] hover:text-[#2B2B2B]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-5 h-px max-w-3xl bg-[#E5DAD1]" />

          <div className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-4 sm:gap-x-8">
            {typeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveType(filter)}
                className={`text-center text-[13px] transition sm:text-[14px] ${
                  activeType === filter
                    ? "font-bold text-[#2B2B2B]"
                    : "font-medium text-[#8A7E76] hover:text-[#2B2B2B]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {showSearch && (
          <div className="mx-auto mb-10 max-w-md">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre de producto"
              className="w-full rounded-[4px] border border-[#D8C6B7] bg-transparent px-4 py-3 text-center text-sm outline-none placeholder:text-[#A9A5A0] focus:border-[#2B2B2B]"
            />
          </div>
        )}

        {visibleProducts.length === 0 ? (
          <div className="mx-auto max-w-3xl border border-[#E5DAD1] bg-white/35 px-6 py-10 text-center text-sm text-[#6b625d]">
            No hay productos cargados en esta combinación todavía.
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-12">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                className="group w-[calc(50%-14px)] bg-transparent md:w-[calc(25%-21px)]"
              >
                <button
                  type="button"
                  aria-label={`Ver ${product.name}`}
                  className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[4px] bg-[#F1EAE2]"
                >
                  {product.images?.[0]?.src ? (
                    <img
                      src={product.images[0].src}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center border border-[#C8B6A8] text-4xl text-[#C8B6A8]">
                      ✦
                    </div>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <strong className="text-[15px] font-medium">
                    $ {product.price}
                  </strong>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Agregar a favoritos"
                      onClick={() => toggleFavorite(product.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
                        favorites.includes(product.id)
                          ? "border-[#2B2B2B] bg-[#2B2B2B] text-white"
                          : "border-[#D8C6B7] text-[#2B2B2B] hover:bg-[#E9DDD2]"
                      }`}
                    >
                      ♡
                    </button>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="rounded-[4px] border border-[#2B2B2B] px-3 py-1.5 text-[12px] font-medium text-[#2B2B2B] transition hover:bg-[#2B2B2B] hover:text-white"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-[#9F958E]">
                  {product.categories?.[0]?.name}
                </p>

                <h3 className="mx-auto mt-2 min-h-[42px] max-w-[92%] text-center text-[15px] font-normal leading-snug text-[#2B2B2B]">
                  {product.name}
                </h3>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        id="como-comprar"
        className="mx-auto max-w-7xl px-6 py-16 md:px-10"
      >
        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#A9A5A0]">
            Cómo comprar
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Comprar es muy fácil
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6b625d]">
            Elegí tus joyas favoritas, agregalas al carrito y completá tus datos.
            Luego nos contactamos por WhatsApp para coordinar el pago y la entrega.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["01", "Elegí tus piezas", "Explorá el catálogo y tocá “Agregar” en los productos que quieras sumar a tu pedido."],
            ["02", "Revisá tu carrito", "Entrá a “Mi carrito”, completá tu mail y tus datos de contacto con atención."],
            ["03", "Coordiná la entrega", "Seleccioná la forma de entrega y el método de pago. Realizamos entregas locales y envíos al resto del país según tu ubicación."],
          ].map(([number, title, text]) => (
            <div key={number} className="border border-[#E5DAD1] bg-white/35 p-7 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#A9A5A0]">{number}</p>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6b625d]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="materiales"
        className="bg-[#2B2B2B] px-6 py-14 text-[#FAF6F2] md:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C8B6A8]">
              Información
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Información útil
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#D8CFC8]">
              Pagos, envíos, cambios y cuidados para comprar con más confianza.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-x-14 gap-y-8 md:grid-cols-2">
            {[
              [
                "Medios de pago",
                "Aceptamos efectivo, transferencia bancaria, billeteras virtuales, débito y tarjeta de crédito en cuotas. En efectivo o transferencia tenés 15% de descuento.",
              ],
              [
                "Envíos",
                "Hacemos entregas en Santa Fe Capital y alrededores, previa coordinación y con costo según zona. También enviamos por Correo Argentino al resto del país.",
              ],
              [
                "Cambios",
                "Los cambios se aceptan dentro de las 24 horas de recibido el producto y solo por fallas en el material. Aros, argollas y piercings no tienen cambio por higiene, salvo falla.",
              ],
              [
                "Materiales",
                "Trabajamos con plata 925, acero quirúrgico, acero blanco, acero dorado y piezas artesanales. El acero quirúrgico es inalterable y de alta durabilidad.",
              ],
              [
                "Cuidados",
                "Evitá perfumes, transpiración, jabones, cosméticos, productos de limpieza o sustancias corrosivas. La plata puede oscurecerse, pero puede recuperar su brillo con limpieza adecuada.",
              ],
              [
                "Packaging para regalo",
                "Si la compra es para regalo, preparamos un packaging especial: bolsita, cajita o sobre, según el tipo de producto.",
              ],
            ].map(([title, text]) => (
              <article key={title} className="border-t border-white/15 pt-5">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#D8CFC8]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-16 border-t border-[#3A3A3A] bg-[#2B2B2B] px-6 pb-28 pt-12 text-center text-white md:px-10 md:pb-12">
        <div className="mx-auto grid max-w-7xl gap-10 text-center md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-start">
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

          <div className="text-center">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B6A8]">
              GILDA Joyas
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#E6E3E0]">
              <li><a href="#sobre-gilda">Sobre la marca</a></li>
              <li><a href="#productos">Productos</a></li>
              <li><a href="#materiales">Materiales y cuidados</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B6A8]">
              Ayuda
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#E6E3E0]">
              <li><a href="#materiales" className="transition hover:text-white">Envíos y retiros</a></li>
              <li><a href="#materiales" className="transition hover:text-white">Cambios</a></li>
              <li><a href="#materiales" className="transition hover:text-white">Medios de pago</a></li>
              <li><a href="#materiales" className="transition hover:text-white">Preguntas frecuentes</a></li>
            </ul>
          </div>

          <div className="text-center">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B6A8]">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#E6E3E0]">
              <li>
                Instagram:{" "}
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/gvmjoyas"}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  @gvmjoyas
                </a>
              </li>
              <li>
                Email:{" "}
                <a href="mailto:gvmjoyas@hotmail.com" className="transition hover:text-white">
                  gvmjoyas@hotmail.com
                </a>
              </li>
              <li>Atención personalizada</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs uppercase tracking-[0.2em] text-[#A9A5A0] md:flex-row">
          <p>© GILDA Joyas</p>
          <p>Simple · Versátil · Moderna · Auténtica</p>
        </div>
      </footer>

      {showSearch && (
        <div className="fixed inset-0 z-[90] bg-black/20 px-6 pt-28">
          <div className="mx-auto max-w-xl rounded-[8px] border border-[#E5DAD1] bg-[#FFFCF8] p-6 shadow-[0_20px_50px_rgba(80,55,40,0.18)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-serif text-3xl text-[#2B2B2B]">
                Buscar en GILDA Joyas
              </h3>

              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="text-2xl leading-none text-[#6b625d] hover:text-[#2B2B2B]"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
            >
              <input
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar anillos, aros, pulseras..."
                className="w-full rounded-[4px] border border-[#D8C6B7] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#A9A5A0] focus:border-[#2B2B2B]"
              />

              <button
                type="submit"
                className="mt-4 w-full rounded-[4px] border border-[#2B2B2B] px-5 py-3 text-sm font-medium text-[#2B2B2B] transition hover:bg-[#2B2B2B] hover:text-white"
              >
                Ver resultados
              </button>
            </form>
          </div>
        </div>
      )}

      {showAccountNotice && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 px-6">
          <div className="max-w-sm rounded-[8px] border border-[#E5DAD1] bg-[#FFFCF8] p-7 text-center shadow-[0_20px_50px_rgba(80,55,40,0.18)]">
            <h3 className="font-serif text-3xl text-[#2B2B2B]">Mi cuenta</h3>
            <p className="mt-3 text-sm leading-6 text-[#6b625d]">
              Esta sección estará disponible próximamente. Por ahora podés armar tu pedido desde el catálogo.
            </p>
            <button
              type="button"
              onClick={() => setShowAccountNotice(false)}
              className="mt-5 rounded-[4px] border border-[#2B2B2B] px-5 py-2 text-sm transition hover:bg-[#2B2B2B] hover:text-white"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <Chatbot />
    </main>
  );
}
