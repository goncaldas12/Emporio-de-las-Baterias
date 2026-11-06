import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { batteryGuide } from "../data/batteryGuide.js";
import { track } from "../analytics.js";
import { vehicleInquiry } from "../inquiries.js";
import { WhatsAppLink } from "./WhatsAppLink.jsx";

const unique = (values) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "es"));

function initialSelection(mini) {
  const query = new URLSearchParams(window.location.search);
  const brand =
    !mini && batteryGuide.some((row) => row[0] === query.get("marca"))
      ? query.get("marca")
      : "";
  const model =
    brand &&
    batteryGuide.some(
      (row) => row[0] === brand && row[1] === query.get("modelo"),
    )
      ? query.get("modelo")
      : "";
  const engine =
    model &&
    batteryGuide.some(
      (row) =>
        row[0] === brand && row[1] === model && row[2] === query.get("motor"),
    )
      ? query.get("motor")
      : "";
  return { brand, model, engine };
}

export function VehicleFinder({ mini = false, onSelectionChange }) {
  const [selection, setSelection] = useState(() => initialSelection(mini));
  const { brand, model, engine } = selection;
  useEffect(() => {
    onSelectionChange?.(selection);
  }, [selection, onSelectionChange]);
  const [result, setResult] = useState(
    () =>
      (!mini &&
        batteryGuide.find(
          (row) => row[0] === brand && row[1] === model && row[2] === engine,
        )) ||
      null,
  );
  const resultRef = useRef(null);
  const brands = unique(batteryGuide.map((row) => row[0]));
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

  function updateSelection(next) {
    setSelection(next);
    setResult(null);
  }

  function submit(event) {
    event.preventDefault();
    const row = batteryGuide.find(
      (row) => row[0] === brand && row[1] === model && row[2] === engine,
    );
    if (!row) return;
    track("vehicle_search", {
      vehicle: `${brand} ${model}`,
      source: mini ? "home" : "finder",
    });
    if (mini) {
      const query = new URLSearchParams({
        marca: brand,
        modelo: model,
        motor: engine,
      });
      window.location.href = `buscador.html?${query}`;
    } else {
      setResult([...row]);
    }
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
            name="marca"
            id={`${prefix}-brand`}
            required
            value={brand}
            onChange={(event) =>
              updateSelection({
                brand: event.target.value,
                model: "",
                engine: "",
              })
            }
          >
            <option value="">Seleccioná la marca</option>
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
            name="modelo"
            id={`${prefix}-model`}
            required
            disabled={!brand}
            value={model}
            onChange={(event) =>
              updateSelection({
                ...selection,
                model: event.target.value,
                engine: "",
              })
            }
          >
            <option value="">
              {brand ? "Seleccioná el modelo" : "Primero elegí la marca"}
            </option>
            {models.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          Motor
          <select
            name="motor"
            id={`${prefix}-engine`}
            required
            disabled={!model}
            value={engine}
            onChange={(event) =>
              updateSelection({ ...selection, engine: event.target.value })
            }
          >
            <option value="">
              {model ? "Seleccioná el motor" : "Primero elegí el modelo"}
            </option>
            {engines.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
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
              <div className="preferred-battery">
                <small>MODELOS DE REFERENCIA</small>
                <strong>{result[5]}</strong>
                <span>
                  Consultanos para confirmar el modelo compatible con tu
                  vehículo.
                </span>
              </div>
              {[
                ["Motor", result[2]],
                ["Batería orientativa", result[3]],
                ["Medidas", `${result[4]} mm`],
              ].map(([label, value]) => (
                <div className="result-line" key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </div>
              ))}
              <WhatsAppLink
                className="button btn-primary"
                inquiry={vehicleInquiry(result)}
                source="finder_result"
              >
                Consultar disponibilidad por WhatsApp ↗
              </WhatsAppLink>
            </>
          )}
        </div>
      )}
    </>
  );
}
