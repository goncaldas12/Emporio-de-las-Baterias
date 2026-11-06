import { useState } from "react";
import { VehicleFinder } from "../components/VehicleFinder.jsx";
import { WhatsAppLink } from "../components/WhatsAppLink.jsx";
import { batteryGuide } from "../data/batteryGuide.js";
import { normalize } from "../utils.js";
import { vehicleInquiry, contactFormHref } from "../inquiries.js";

const unique = (values) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "es"));
const emptyFilters = {
  brand: "",
  model: "",
  engine: "",
  battery: "",
  dimensions: "",
};

export default function Finder() {
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState({
    brand: "",
    model: "",
    engine: "",
  });
  const selectedRow = batteryGuide.find(
    (row) =>
      row[0] === selection.brand &&
      row[1] === selection.model &&
      row[2] === selection.engine,
  );
  const sidebarInquiry = selectedRow
    ? vehicleInquiry(selectedRow)
    : {
        vehicle: [selection.brand, selection.model].filter(Boolean).join(" "),
        engine: selection.engine,
      };
  const [filters, setFilters] = useState(emptyFilters);
  const modelRows = batteryGuide.filter(
    (row) => !filters.brand || row[0] === filters.brand,
  );
  const engineRows = modelRows.filter(
    (row) => !filters.model || row[1] === filters.model,
  );
  const options = [
    [
      "brand",
      "Marca del vehículo",
      "Todas las marcas",
      unique(batteryGuide.map((row) => row[0])),
    ],
    [
      "model",
      "Modelo",
      "Todos los modelos",
      unique(modelRows.map((row) => row[1])),
    ],
    [
      "engine",
      "Motor",
      "Todos los motores",
      unique(engineRows.map((row) => row[2])),
    ],
    [
      "battery",
      "Batería orientativa",
      "Todas las baterías",
      unique(batteryGuide.map((row) => row[3])),
    ],
    [
      "dimensions",
      "Medidas (mm)",
      "Todas las medidas",
      unique(batteryGuide.map((row) => row[4])),
    ],
  ];
  const rows = batteryGuide.filter(
    (row) =>
      (!filters.brand || row[0] === filters.brand) &&
      (!filters.model || row[1] === filters.model) &&
      (!filters.engine || row[2] === filters.engine) &&
      (!filters.battery || row[3] === filters.battery) &&
      (!filters.dimensions || row[4] === filters.dimensions) &&
      normalize(row.join(" ")).includes(normalize(search)),
  );
  const hasFilters = search || Object.values(filters).some(Boolean);

  function updateFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "brand"
        ? { model: "", engine: "" }
        : key === "model"
          ? { engine: "" }
          : {}),
    }));
  }

  return (
    <main id="main">
      <section className="page-intro shell">
        <p className="eyebrow">GUÍA DE COMPATIBILIDAD</p>
        <h1>Buscá tu batería.</h1>
        <p>
          Seleccioná tu vehículo y encontrá una referencia orientativa. La
          compatibilidad final se confirma según el año, la versión y la batería
          instalada.
        </p>
      </section>
      <section className="section shell finder-layout">
        <div className="finder-card">
          <div className="finder-heading">
            <span className="step">01</span>
            <div>
              <h2>Datos del vehículo</h2>
              <p>Elegí la marca, el modelo y la motorización.</p>
            </div>
          </div>
          <VehicleFinder onSelectionChange={setSelection} />
        </div>
        <aside className="finder-side">
          <div className="side-box">
            <h3>Antes de elegir</h3>
            <p>
              Tené en cuenta estos datos para confirmar la batería correcta:
            </p>
            <ul>
              <li>Año y versión del vehículo</li>
              <li>Medidas de la batería actual</li>
              <li>Posición de los bornes</li>
              <li>Si tiene sistema Start-Stop</li>
            </ul>
            <a className="arrow-link" href={contactFormHref(sidebarInquiry)}>
              Hacer una consulta →
            </a>
          </div>
          <img
            src="assets/local-interior.webp"
            alt="Baterías exhibidas en el local"
          />
        </aside>
      </section>
      <section className="section shell guide-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">CONSULTA RÁPIDA</p>
            <h2>Referencias por vehículo</h2>
            <p>Combiná los filtros para encontrar tu referencia.</p>
          </div>
          <div className="guide-search">
            <label htmlFor="table-query" className="sr-only">
              Buscar vehículo o referencia
            </label>
            <input
              id="table-query"
              type="search"
              placeholder="Buscar vehículo o referencia"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div
          className="filters guide-filters"
          role="group"
          aria-label="Filtros de referencias por vehículo"
        >
          <div className="filter-title">
            <span>Filtrar referencias</span>
            <button
              className="clear-filters"
              type="button"
              disabled={!hasFilters}
              onClick={() => {
                setFilters(emptyFilters);
                setSearch("");
              }}
            >
              Limpiar filtros
            </button>
          </div>
          <div className="guide-filter-row">
            {options.map(([key, label, placeholder, values]) => (
              <label key={key} htmlFor={`guide-${key}`}>
                {label}
                <select
                  id={`guide-${key}`}
                  value={filters[key]}
                  onChange={(event) => updateFilter(key, event.target.value)}
                >
                  <option value="">{placeholder}</option>
                  {values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
        <div className="table-wrapper">
          <table className="guide-table">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Motor</th>
                <th>Batería orientativa</th>
                <th>Modelos de referencia</th>
                <th>Consulta</th>
              </tr>
            </thead>
            <tbody id="guide-body">
              {rows.length ? (
                rows.map((row) => (
                  <tr key={row.join("|")}>
                    <td>{`${row[0]} ${row[1]}`}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td className="guide-references">
                      <strong>{row[5]}</strong>
                    </td>
                    <td>
                      <WhatsAppLink
                        className="card-link"
                        inquiry={vehicleInquiry(row)}
                        source="guide_table"
                        aria-label={`Consultar batería para ${row[0]} ${row[1]}`}
                      >
                        Consultar ↗
                      </WhatsAppLink>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No se encontraron coincidencias.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="small-note">
          <span
            id="guide-count"
            aria-live="polite"
          >{`${rows.length} ${rows.length === 1 ? "referencia" : "referencias"}`}</span>{" "}
          · Datos orientativos. Confirmá antes de comprar.
        </p>
      </section>
    </main>
  );
}
