import { useState } from "react";
import { VehicleFinder } from "../components/VehicleFinder.jsx";
import { batteryGuide } from "../data/batteryGuide.js";
import { normalize } from "../utils.js";

export default function Finder() {
  const [search, setSearch] = useState("");
  const rows = batteryGuide.filter((row) =>
    normalize(row.join(" ")).includes(normalize(search)),
  );
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
          <VehicleFinder />
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
            <a href="contacto.html" className="arrow-link">
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
            <p>Buscá un modelo en nuestra guía.</p>
          </div>
          <div className="guide-search">
            <label htmlFor="table-query" className="sr-only">
              Buscar vehículo
            </label>
            <input
              id="table-query"
              type="search"
              placeholder="Buscar marca o modelo"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Motor</th>
                <th>Batería orientativa</th>
                <th>Modelo de referencia</th>
              </tr>
            </thead>
            <tbody id="guide-body">
              {rows.length ? (
                rows.map((row) => (
                  <tr key={row.join("|")}>
                    <td>{`${row[0]} ${row[1]}`}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[5]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No se encontraron coincidencias.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="small-note">
          <span id="guide-count">{`${rows.length} referencias`}</span> · Datos
          orientativos. Confirmá antes de comprar.
        </p>
      </section>
    </main>
  );
}
