import { useRef, useState, useLayoutEffect } from "react";
import { batteryGuide } from "../data/batteryGuide.js";
import { track } from "../analytics.js";

const unique = (values) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "es"));

export function VehicleFinder({ mini = false }) {
  const query = new URLSearchParams(window.location.search);
  const brands = unique(batteryGuide.map((row) => row[0]));
  const initialBrand =
    !mini && brands.includes(query.get("marca")) ? query.get("marca") : "";
  const initialModels = unique(
    batteryGuide.filter((row) => row[0] === initialBrand).map((row) => row[1]),
  );
  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(
    !mini && initialModels.includes(query.get("modelo"))
      ? query.get("modelo")
      : "",
  );
  const [engine, setEngine] = useState("");
  const [brandChanged, setBrandChanged] = useState(!mini && query.has("marca"));
  const [modelChanged, setModelChanged] = useState(
    !mini && query.has("marca") && query.has("modelo"),
  );
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const models = unique(
    batteryGuide.filter((row) => row[0] === brand).map((row) => row[1]),
  );
  const engines = unique(
    batteryGuide
      .filter((row) => row[0] === brand && row[1] === model)
      .map((row) => row[2]),
  );
  const prefix = mini ? "mini" : "finder";

  useLayoutEffect(() => {
    if (result)
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }, [result]);

  function submit(event) {
    event.preventDefault();
    if (mini) {
      if (brand && model)
        window.location.href = `buscador.html?marca=${encodeURIComponent(brand)}&modelo=${encodeURIComponent(model)}`;
      return;
    }
    const row = batteryGuide.find(
      (row) => row[0] === brand && row[1] === model && row[2] === engine,
    );
    if (!row) return;
    track("vehicle_search", { vehicle: `${row[0]} ${row[1]}` });
    setResult([...row]);
  }

  return (
    <>
      <form
        id={mini ? "mini-finder" : "finder-form"}
        className={mini ? "mini-form" : "finder-form"}
        onSubmit={submit}
      >
        <label>
          Marca
          <select
            name={mini ? "brand" : undefined}
            id={`${prefix}-brand`}
            required
            value={brand}
            onChange={(event) => {
              setBrand(event.target.value);
              setModel("");
              setEngine("");
              setBrandChanged(true);
              setModelChanged(false);
            }}
          >
            <option value="">
              {mini ? "Seleccioná una marca" : "Seleccioná la marca"}
            </option>
            {brands.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          Modelo
          <select
            name={mini ? "model" : undefined}
            id={`${prefix}-model`}
            required
            disabled={!brand}
            value={model}
            onChange={(event) => {
              setModel(event.target.value);
              setEngine("");
              setModelChanged(true);
            }}
          >
            <option value="">
              {brandChanged ? "Seleccioná el modelo" : "Primero elegí la marca"}
            </option>
            {models.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        {!mini && (
          <label>
            Motor
            <select
              id="finder-engine"
              required
              disabled={!model}
              value={engine}
              onChange={(event) => setEngine(event.target.value)}
            >
              <option value="">
                {modelChanged
                  ? "Seleccioná el motor"
                  : "Primero elegí el modelo"}
              </option>
              {engines.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          className={`button ${mini ? "btn-orange" : "btn-primary"}`}
          type="submit"
        >
          {mini ? "Buscar " : "Ver batería sugerida "}
          <span>→</span>
        </button>
      </form>
      {!mini && (
        <div
          id="finder-result"
          className="finder-result"
          hidden={!result}
          aria-live="polite"
          ref={resultRef}
        >
          {result && (
            <>
              <h3>{`${result[0]} ${result[1]}`}</h3>
              {[
                ["Motor", result[2]],
                ["Batería orientativa", result[3]],
                ["Medidas", `${result[4]} mm`],
                ["Modelos de referencia", result[5]],
              ].map(([label, value]) => (
                <div className="result-line" key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </div>
              ))}
              <a
                className="button btn-primary"
                href={`contacto.html?vehiculo=${encodeURIComponent(`${result[0]} ${result[1]}`)}&motor=${encodeURIComponent(result[2])}`}
              >
                Consultar disponibilidad →
              </a>
            </>
          )}
        </div>
      )}
    </>
  );
}
