import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_WC_URL;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  if (!url || !key || !secret) {
    return NextResponse.json(
      { error: "Faltan variables de entorno" },
      { status: 500 }
    );
  }

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  const response = await fetch(`${url}/wp-json/wc/v3/products?per_page=100`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "No se pudo conectar con WooCommerce" },
      { status: response.status }
    );
  }

  const products = await response.json();

  return NextResponse.json(products);
}
