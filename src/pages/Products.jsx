import { useState } from "react";
import { products } from "../data/products.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { normalize } from "../utils.js";
import { batteryBrands } from "../data/brands.js";
import { WhatsAppLink } from "../components/WhatsAppLink.jsx";

export default function Products() {
  const [brand, setBrand] = useState(() => {
    const value = new URLSearchParams(window.location.search).get("marca");
    return batteryBrands.includes(value) ? value : "";
  });
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const matches = (product) =>
    (!brand || product.brand === brand) &&
    (!type || product.type === type) &&
    normalize(product.search).includes(normalize(search));
  const count = products.filter(matches).length;
  return (
    <main id="main">
      <section className="page-intro shell">
        <p className="eyebrow">NUESTROS PRODUCTOS</p>
        <h1>Baterías para tu vehículo.</h1>
        <p>
          Explorá algunas referencias de las marcas que trabajamos. Consultanos
          para confirmar el modelo, el precio y la disponibilidad.
        </p>
      </section>
      <section className="section shell product-section">
        <div className="filters">
          <div className="filter-title">
            Filtrar productos{" "}
            <span id="product-count">{`${count} modelos`}</span>
          </div>
          <div className="filter-row">
            <label>
              Buscar
              <input
                id="product-search"
                type="search"
                placeholder="Modelo o referencia"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label>
              Marca
              <select
                id="product-brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              >
                <option value="">Todas las marcas</option>
                {batteryBrands.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Vehículo
              <select
                id="product-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="">Autos y camionetas</option>
                <option value="autos">Autos</option>
                <option value="camionetas">Camionetas</option>
              </select>
            </label>
          </div>
        </div>
        <div className="product-grid" id="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              hidden={!matches(product)}
            />
          ))}
        </div>
        <p id="product-empty" className="empty" hidden={count > 0}>
          {"No encontramos productos con esos filtros. "}
          <WhatsAppLink
            source="catalog_empty"
            inquiry={{
              battery: brand ? `${brand} (modelo a confirmar)` : undefined,
              specifications: type ? `Para ${type}` : undefined,
              message: search ? `Estoy buscando: ${search}` : undefined,
            }}
          >
            Consultanos por tu batería.
          </WhatsAppLink>
        </p>
        <p className="small-note">
          Las imágenes son ilustrativas y pueden no representar la presentación
          exacta del modelo. Precios y stock sujetos a confirmación.
        </p>
      </section>
      <section className="soft-cta">
        <div className="shell soft-inner">
          <div>
            <h2>¿No encontraste lo que buscabas?</h2>
            <p>Pasános el modelo y año de tu auto y te asesoramos.</p>
          </div>
          <a href="buscador.html" className="button btn-primary">
            Buscar por vehículo →
          </a>
        </div>
      </section>
    </main>
  );
}
